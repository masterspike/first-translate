'use client'

import { useState } from 'react'
import { Translation, LANGUAGES } from '@/types/translation'
import LanguageSelector from './LanguageSelector'
import QuickPhrases from './QuickPhrases'
import { translateText } from '@/utils/translation'

interface TranslationFormProps {
  onTranslation: (translation: Translation) => void
}

export default function TranslationForm({ onTranslation }: TranslationFormProps) {
  const [fromLanguage, setFromLanguage] = useState<'nl' | 'ja'>('nl')
  const [toLanguage, setToLanguage] = useState<'nl' | 'ja'>('ja')
  const [originalText, setOriginalText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationSource, setTranslationSource] = useState<'online' | 'offline' | null>(null)

  const swapLanguages = () => {
    setFromLanguage(toLanguage)
    setToLanguage(fromLanguage)
    setOriginalText(translatedText)
    setTranslatedText(originalText)
  }

  const translateTextHandler = async () => {
    if (!originalText.trim()) return

    setIsTranslating(true)
    setTranslationSource(null)
    
    try {
      const translated = await translateText(originalText, fromLanguage, toLanguage)
      setTranslatedText(translated)

      const newTranslation: Translation = {
        id: Date.now().toString(),
        originalText,
        translatedText: translated,
        fromLanguage,
        toLanguage,
        timestamp: new Date()
      }

      onTranslation(newTranslation)
      
      // Determine translation source based on the result
      if (translated.includes('[Geen vertaling gevonden')) {
        setTranslationSource('offline')
      } else {
        setTranslationSource('online')
      }
    } catch (error) {
      console.error('Translation error:', error)
      setTranslatedText('Vertaling mislukt. Probeer het opnieuw.')
      setTranslationSource('offline')
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4">
      {/* Language Selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <LanguageSelector
            value={fromLanguage}
            onChange={setFromLanguage}
            label="Van"
          />
        </div>
        
        <button
          onClick={swapLanguages}
          className="mx-3 p-2 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md hover:shadow-lg transition-all duration-200"
          title="Wissel talen"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>
        
        <div className="flex-1">
          <LanguageSelector
            value={toLanguage}
            onChange={setToLanguage}
            label="Naar"
          />
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Originele Tekst
          </label>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Voer tekst in om te vertalen..."
            className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm bg-white text-gray-800 placeholder-gray-500"
          />
          <QuickPhrases onPhraseSelect={handlePhraseSelect} fromLanguage={fromLanguage} />
        </div>

        {/* Translate Button */}
        <div className="flex justify-center">
          <button
            onClick={translateTextHandler}
            disabled={!originalText.trim() || isTranslating}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
          >
            {isTranslating ? 'Vertalen...' : 'Vertaal'}
          </button>
        </div>

        {/* Translation Source Indicator */}
        {translationSource && (
          <div className="text-center">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              translationSource === 'online' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {translationSource === 'online' ? '🌐 Online vertaling' : '📱 Offline vertaling'}
            </span>
          </div>
        )}

        {/* Output Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vertaling
          </label>
          <div className="w-full min-h-20 p-3 border border-gray-300 rounded-lg bg-white text-sm">
            {translatedText ? (
              <div className="text-gray-800 font-medium">{translatedText}</div>
            ) : (
              <div className="text-gray-400">Vertaling verschijnt hier...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  function handlePhraseSelect(phrase: string) {
    setOriginalText(phrase)
  }
} 