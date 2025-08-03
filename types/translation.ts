export interface Translation {
  id: string
  originalText: string
  translatedText: string
  fromLanguage: 'nl' | 'ja'
  toLanguage: 'nl' | 'ja'
  timestamp: Date
  isFavorite?: boolean
}

export interface Language {
  code: 'nl' | 'ja'
  name: string
  nativeName: string
  flag: string
}

export const LANGUAGES: Record<'nl' | 'ja', Language> = {
  nl: {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    flag: '🇳🇱'
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵'
  }
} 