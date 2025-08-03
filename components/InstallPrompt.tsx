'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if dismissed recently
    if (typeof window !== 'undefined') {
      const dismissedTime = localStorage.getItem('installPromptDismissed')
      if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
        setIsDismissed(true)
        return
      }
    }

    // Check if app is already installed
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true
      setIsStandalone(standalone)
      return standalone
    }

    // Check if already installed
    if (checkStandalone()) {
      return
    }

    const handleBeforeInstallPrompt = (e: any) => {
      console.log('beforeinstallprompt triggered!')
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
      setDebugInfo('Install prompt available')
    }

    // Check if service worker is supported and registered
    const checkServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // Wait a bit for the service worker to register
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          const registration = await navigator.serviceWorker.getRegistration()
          if (registration && registration.active) {
            setDebugInfo(prev => prev + ' | SW registered and active')
          } else if (registration) {
            setDebugInfo(prev => prev + ' | SW registered but not active')
          } else {
            setDebugInfo(prev => prev + ' | SW not registered')
          }
        } catch (error) {
          setDebugInfo(prev => prev + ' | SW error: ' + error)
        }
      } else {
        setDebugInfo(prev => prev + ' | SW not supported')
      }
    }

    // Check if PWA criteria are met
    const checkPWACriteria = () => {
      const hasManifest = document.querySelector('link[rel="manifest"]') !== null
      const hasSW = 'serviceWorker' in navigator
      
      // More comprehensive secure check
      const isSecure = window.location.protocol === 'https:' || 
                      window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname.includes('localhost') ||
                      window.location.hostname === '0.0.0.0' ||
                      window.location.hostname === '::1'
      
      setDebugInfo(`Manifest: ${hasManifest}, SW: ${hasSW}, Secure: ${isSecure}`)
    }

    // Register service worker if not already registered
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          console.log('Attempting to register service worker...')
          
          // Check if service worker file exists first
          const swResponse = await fetch('/sw.js')
          if (!swResponse.ok) {
            throw new Error(`Service worker not found: ${swResponse.status}`)
          }
          
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          })
          console.log('Service Worker registered:', registration)
          setDebugInfo(prev => prev + ' | SW registered successfully')
          
          // Wait for service worker to be active
          if (registration.installing) {
            registration.installing.addEventListener('statechange', () => {
              if (registration.installing?.state === 'activated') {
                setDebugInfo(prev => prev.replace(' | SW registered successfully', ' | SW active'))
              }
            })
          } else if (registration.active) {
            setDebugInfo(prev => prev.replace(' | SW registered successfully', ' | SW active'))
          }
        } catch (error) {
          console.error('Service Worker registration failed:', error)
          setDebugInfo(prev => prev + ' | SW registration failed: ' + error)
        }
      }
    }

    checkServiceWorker()
    checkPWACriteria()
    registerServiceWorker()

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Show manual install option after a delay if no prompt appears
    const timer = setTimeout(() => {
      if (!showPrompt && !isStandalone) {
        setShowPrompt(true)
        setDebugInfo('Manual install option shown')
      }
    }, 3000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      clearTimeout(timer)
    }
  }, [showPrompt, isStandalone])

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        console.log('Install outcome:', outcome)
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt')
          setShowPrompt(false)
          setDebugInfo('App installed successfully!')
        } else {
          setDebugInfo('Install cancelled by user')
        }
        setDeferredPrompt(null)
      } catch (error) {
        console.error('Install error:', error)
        setDebugInfo('Install failed: ' + error)
      }
    } else {
      // Manual install instructions
      setDebugInfo('Manual install: Open browser menu → Install/Add to Home Screen')
      alert('📱 Om de app te installeren:\n\n1. Open het browser menu (3 puntjes)\n2. Kies "Installeer" of "Add to Home Screen"\n3. De app verschijnt op je startscherm!')
    }
  }

  const handleDismiss = () => {
    console.log('Dismissing install prompt')
    setShowPrompt(false)
    // Store dismissal in localStorage to prevent showing again for a while
    if (typeof window !== 'undefined') {
      localStorage.setItem('installPromptDismissed', Date.now().toString())
    }
  }

  // Don't show if already installed or dismissed
  if (isStandalone || isDismissed) return null

  // Don't show if prompt is hidden
  if (!showPrompt) return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-2 z-40 border border-gray-200 max-w-sm mx-auto"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center">
            <span className="text-white text-xs">📱</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-xs">Installeer FirstTranslate</h3>
            <p className="text-xs text-gray-600">Voor offline gebruik</p>
            {debugInfo && (
              <p className="text-xs text-gray-500 mt-1">{debugInfo}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={handleDismiss}
            className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            Later
          </button>
          <button
            onClick={handleInstall}
            className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md text-xs font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md"
          >
            {deferredPrompt ? 'Installeren' : 'Installeer'}
          </button>
        </div>
      </div>
    </motion.div>
  )
} 