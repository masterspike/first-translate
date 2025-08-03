'use client'

import { useState } from 'react'

interface QuickPhrasesProps {
  onPhraseSelect: (phrase: string) => void
  fromLanguage: 'nl' | 'ja'
}

const quickPhrases = {
  nl: [
    'hallo',
    'dank je',
    'hoe laat is het',
    'waar is het toilet',
    'hoeveel kost dit',
    'ik begrijp het niet',
    'spreek je engels',
    'waar is het station',
    'waar is het restaurant',
    'help',
    'waar is het ziekenhuis',
    'hoe kom ik naar het station',
    'hoeveel kost het',
    'wat is de tijd',
    'waar is het hotel'
  ],
  ja: [
    'こんにちは',
    'ありがとう',
    '何時ですか',
    'トイレはどこですか',
    'これはいくらですか',
    'わかりません',
    '英語を話しますか',
    '駅はどこですか',
    'レストランはどこですか',
    '助けて',
    '病院はどこですか',
    '駅にはどうやって行けますか',
    'いくらですか',
    '時間は何時ですか',
    'ホテルはどこですか'
  ]
}

export default function QuickPhrases({ onPhraseSelect, fromLanguage }: QuickPhrasesProps) {
  const [showPhrases, setShowPhrases] = useState(false)

  const phrases = quickPhrases[fromLanguage]

  return (
    <div className="mt-2">
      <button
        onClick={() => setShowPhrases(!showPhrases)}
        className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center space-x-1"
      >
        <span>{showPhrases ? 'Verberg' : 'Toon'} snelle zinnen</span>
        <svg className={`w-3 h-3 transition-transform ${showPhrases ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {showPhrases && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-xs font-medium text-gray-700 mb-2">
            Snelle zinnen:
          </h3>
          <div className="grid grid-cols-2 gap-1">
            {phrases.map((phrase, index) => (
              <button
                key={index}
                onClick={() => onPhraseSelect(phrase)}
                className="text-left p-2 text-xs bg-white border border-gray-300 rounded hover:bg-blue-100 hover:border-blue-400 transition-all duration-200 text-gray-800"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 