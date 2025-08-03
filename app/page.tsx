'use client'

import { useState } from 'react'
import TranslationForm from '@/components/TranslationForm'
import TranslationHistory from '@/components/TranslationHistory'
import OfflineIndicator from '@/components/OfflineIndicator'
import InstallPrompt from '@/components/InstallPrompt'
import { Translation } from '@/types/translation'

export default function Home() {
  const [translations, setTranslations] = useState<Translation[]>([])

  const addTranslation = (translation: Translation) => {
    setTranslations(prev => [translation, ...prev])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-teal-500 to-green-600">
      <OfflineIndicator />
      
      {/* Header */}
      <div className="pt-6 pb-4 px-4 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
          <span className="text-xl">🇯🇵</span>
        </div>
        <h1 className="text-xl font-bold text-white mb-1">
          FirstTranslate
        </h1>
        <p className="text-blue-100 text-sm">
          Nederlands ↔ Japans
        </p>
      </div>

      {/* Main Content - Scrollable area */}
      <div className="px-4 pb-40 overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
        <TranslationForm onTranslation={addTranslation} />
        
        {translations.length > 0 && (
          <div className="mt-6">
            <TranslationHistory translations={translations} />
          </div>
        )}
      </div>

      <InstallPrompt />
    </div>
  )
} 