'use client'

import { useState, useEffect } from 'react'

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setIsOnline(navigator.onLine)

    // Check if app is installed
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.active) {
          setIsInstalled(true)
        }
      })
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Only show if offline or not installed
  if (isOnline && isInstalled) {
    return null
  }

  if (!isOnline) {
    return (
      <div className="fixed top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs z-50">
        📱 Offline
      </div>
    )
  }

  return (
    <div className="fixed top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs z-50">
      🌐 Installeer
    </div>
  )
} 