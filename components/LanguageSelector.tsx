'use client'

import { LANGUAGES } from '@/types/translation'

interface LanguageSelectorProps {
  value: 'nl' | 'ja'
  onChange: (value: 'nl' | 'ja') => void
  label: string
}

export default function LanguageSelector({ value, onChange, label }: LanguageSelectorProps) {
  return (
    <div className="text-center">
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as 'nl' | 'ja')}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
        >
          {Object.entries(LANGUAGES).map(([code, language]) => (
            <option key={code} value={code}>
              {language.flag} {language.nativeName}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
} 