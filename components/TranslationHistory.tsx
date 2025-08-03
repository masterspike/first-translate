'use client'

import { Translation } from '@/types/translation'

interface TranslationHistoryProps {
  translations: Translation[]
}

export default function TranslationHistory({ translations }: TranslationHistoryProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('nl-NL', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4">
      <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center">
        <span className="mr-2">📝</span>
        Vertalingsgeschiedenis
      </h2>
      
      <div className="space-y-2">
        {translations.map((translation, index) => (
          <div
            key={translation.id}
            className="bg-blue-50 rounded-lg p-3 border border-blue-100"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500">
                  {translation.fromLanguage === 'nl' ? '🇳🇱' : '🇯🇵'} → {translation.toLanguage === 'nl' ? '🇳🇱' : '🇯🇵'}
                </span>
                <span className="text-xs text-gray-400">
                  {formatTime(translation.timestamp)}
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-600">
                <span className="font-medium">Origineel:</span> {translation.originalText}
              </div>
              <div className="text-xs text-gray-800 font-medium">
                <span className="font-medium">Vertaling:</span> {translation.translatedText}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 