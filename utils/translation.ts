export interface TranslationResult {
  translatedText: string
  detectedLanguage?: string
  confidence?: number
}

export async function translateWithLibreTranslate(
  text: string,
  fromLang: 'nl' | 'ja',
  toLang: 'nl' | 'ja'
): Promise<TranslationResult> {
  try {
    // Use CORS proxy to avoid CORS issues
    const corsProxy = 'https://cors-anywhere.herokuapp.com/'
    const apiUrl = 'https://libretranslate.de/translate'
    
    const response = await fetch(`${corsProxy}${apiUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify({
        q: text,
        source: fromLang,
        target: toLang,
        format: 'text'
      })
    })

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.status}`)
    }

    const data = await response.json()
    return {
      translatedText: data.translatedText,
      detectedLanguage: data.detected?.language,
      confidence: data.detected?.confidence
    }
  } catch (error) {
    console.error('LibreTranslate error:', error)
    throw error
  }
}

// Alternative translation API using Google Translate (free tier)
export async function translateWithGoogleTranslate(
  text: string,
  fromLang: 'nl' | 'ja',
  toLang: 'nl' | 'ja'
): Promise<TranslationResult> {
  try {
    // Using a free Google Translate proxy with CORS support
    const corsProxy = 'https://cors-anywhere.herokuapp.com/'
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`
    
    const response = await fetch(`${corsProxy}${apiUrl}`)
    
    if (!response.ok) {
      throw new Error(`Google Translate failed: ${response.status}`)
    }

    const data = await response.json()
    const translatedText = data[0].map((item: any) => item[0]).join('')
    
    return {
      translatedText,
      detectedLanguage: fromLang,
      confidence: 0.9
    }
  } catch (error) {
    console.error('Google Translate error:', error)
    throw error
  }
}

// Simple translation using a different approach (no CORS issues)
export async function translateWithSimpleAPI(
  text: string,
  fromLang: 'nl' | 'ja',
  toLang: 'nl' | 'ja'
): Promise<TranslationResult> {
  try {
    // Using a simple translation service that doesn't have CORS issues
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`)
    
    if (!response.ok) {
      throw new Error(`Simple API failed: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      translatedText: data.responseData.translatedText,
      detectedLanguage: fromLang,
      confidence: 0.8
    }
  } catch (error) {
    console.error('Simple API error:', error)
    throw error
  }
}

// Check if user is online
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine
}

// Enhanced translation function with API fallback
export async function translateText(
  text: string,
  fromLang: 'nl' | 'ja',
  toLang: 'nl' | 'ja'
): Promise<string> {
  // If online, try API first
  if (isOnline()) {
    try {
      console.log('Attempting online translation...')
      
      // Try Simple API first (no CORS issues)
      try {
        const result = await translateWithSimpleAPI(text, fromLang, toLang)
        console.log('Simple API successful:', result.translatedText)
        return result.translatedText
      } catch (error) {
        console.log('Simple API failed, trying LibreTranslate...')
        
        // Try LibreTranslate with CORS proxy
        try {
          const result = await translateWithLibreTranslate(text, fromLang, toLang)
          console.log('LibreTranslate successful:', result.translatedText)
          return result.translatedText
        } catch (error) {
          console.log('LibreTranslate failed, trying Google Translate...')
          
          // Fallback to Google Translate with CORS proxy
          try {
            const result = await translateWithGoogleTranslate(text, fromLang, toLang)
            console.log('Google Translate successful:', result.translatedText)
            return result.translatedText
          } catch (error) {
            console.log('Google Translate also failed:', error)
          }
        }
      }
    } catch (error) {
      console.log('All online translation failed, falling back to offline:', error)
    }
  }

  // Fallback to offline translation
  console.log('Using offline translation...')
  return getMockTranslation(text, fromLang, toLang)
}

// Enhanced sentence patterns and phrases
export const sentencePatterns: Record<string, Record<string, string>> = {
  'nl-ja': {
    // Greetings and basic phrases
    'hallo': 'こんにちは',
    'hello': 'こんにちは',
    'goedemorgen': 'おはようございます',
    'goedenavond': 'こんばんは',
    'goedenacht': 'おやすみなさい',
    'tot ziens': 'さようなら',
    'doei': 'さようなら',
    'dank je': 'ありがとう',
    'dankjewel': 'ありがとうございます',
    'bedankt': 'ありがとう',
    'graag gedaan': 'どういたしまして',
    'excuses': 'すみません',
    'sorry': 'ごめんなさい',
    'pardon': 'すみません',
    
    // Questions and responses
    'ja': 'はい',
    'nee': 'いいえ',
    'misschien': 'たぶん',
    'ik weet het niet': 'わかりません',
    'ik begrijp het niet': '理解できません',
    'spreek je engels': '英語を話しますか',
    'spreek je japans': '日本語を話しますか',
    'hoe gaat het': 'お元気ですか',
    'het gaat goed': '元気です',
    'het gaat slecht': '調子が悪いです',
    
    // Time and questions
    'hoe laat is het': '何時ですか',
    'hoe laat is het nu': '今何時ですか',
    'hoe laat': '何時',
    'wat is de tijd': '時間は何時ですか',
    'hoe laat vertrekt': '何時に出発しますか',
    'hoe laat komt': '何時に来ますか',
    'hoe laat begint': '何時に始まりますか',
    'hoe laat eindigt': '何時に終わりますか',
    
    // Directions and locations
    'waar is': 'どこにありますか',
    'waar is het toilet': 'トイレはどこですか',
    'waar is het station': '駅はどこですか',
    'waar is de luchthaven': '空港はどこですか',
    'waar is het hotel': 'ホテルはどこですか',
    'waar is het restaurant': 'レストランはどこですか',
    'waar is de winkel': '店はどこですか',
    'waar is het ziekenhuis': '病院はどこですか',
    'waar is de politie': '警察はどこですか',
    'waar is de brandweer': '消防署はどこですか',
    'hoe kom ik naar': 'どうやって行けますか',
    'hoe kom ik naar het station': '駅にはどうやって行けますか',
    'hoe kom ik naar de luchthaven': '空港にはどうやって行けますか',
    
    // Shopping and money
    'hoeveel kost': 'いくらですか',
    'hoeveel kost dit': 'これはいくらですか',
    'hoeveel kost dat': 'それはいくらですか',
    'hoeveel kost het': 'いくらですか',
    'wat is de prijs': '値段はいくらですか',
    'te duur': '高すぎます',
    'goedkoop': '安いです',
    'korting': '割引',
    'sale': 'セール',
    'gratis': '無料',
    'geld': 'お金',
    'euro': 'ユーロ',
    'dollar': 'ドル',
    'yen': '円',
    'het is te duur': '高すぎます',
    'dit is te duur': 'これは高すぎます',
    'dat is te duur': 'それは高すぎます',
    'het is goedkoop': '安いです',
    'dit is goedkoop': 'これは安いです',
    'dat is goedkoop': 'それは安いです',
    
    // Food and dining
    'eten': '食べ物',
    'drinken': '飲み物',
    'water': '水',
    'koffie': 'コーヒー',
    'thee': 'お茶',
    'bier': 'ビール',
    'wijn': 'ワイン',
    'brood': 'パン',
    'rijst': 'ご飯',
    'vlees': '肉',
    'vis': '魚',
    'groente': '野菜',
    'fruit': '果物',
    'restaurant': 'レストラン',
    'café': 'カフェ',
    'bar': 'バー',
    'menu': 'メニュー',
    'rekening': 'お会計',
    'fooien': 'チップ',
    
    // Transportation
    'trein': '電車',
    'bus': 'バス',
    'metro': '地下鉄',
    'taxi': 'タクシー',
    'vliegtuig': '飛行機',
    'station': '駅',
    'halte': '停留所',
    'luchthaven': '空港',
    'kaartje': '切符',
    'ticket': 'チケット',
    'reservering': '予約',
    'vertraging': '遅延',
    'annuleren': 'キャンセル',
    
    // Accommodation
    'hotel': 'ホテル',
    'hostel': 'ホステル',
    'pension': 'ペンション',
    'kamer': '部屋',
    'check-in': 'チェックイン',
    'check-out': 'チェックアウト',
    'receptie': 'フロント',
    'lift': 'エレベーター',
    'trap': '階段',
    
    // Emergency and health
    'ziekenhuis': '病院',
    'dokter': '医者',
    'verpleegster': '看護師',
    'ambulance': '救急車',
    'politie': '警察',
    'brandweer': '消防署',
    'help': '助けて',
    'gevaar': '危険',
    'pijn': '痛い',
    'ziek': '病気',
    'koorts': '熱',
    'hoofdpijn': '頭痛',
    'misselijk': '吐き気',
    
    // Common objects
    'paspoort': 'パスポート',
    'visum': 'ビザ',
    'kaart': '地図',
    'gids': 'ガイド',
    'boek': '本',
    'krant': '新聞',
    'magazine': '雑誌',
    'pen': 'ペン',
    'papier': '紙',
    'zakdoek': 'ハンカチ',
    'paraplu': '傘',
    'bril': '眼鏡',
    'horloge': '時計',
    'telefoon': '電話',
    'laptop': 'ノートパソコン',
    'camera': 'カメラ',
    'batterij': '電池',
    'oplader': '充電器',
    
    // Weather and time
    'zonnig': '晴れ',
    'regen': '雨',
    'sneeuw': '雪',
    'warm': '暑い',
    'koud': '寒い',
    'vandaag': '今日',
    'morgen': '明日',
    'gisteren': '昨日',
    'week': '週',
    'maand': '月',
    'jaar': '年',
    'uur': '時間',
    'minuut': '分',
    'seconde': '秒',
    
    // Numbers
    'nul': '零',
    'een': '一',
    'twee': '二',
    'drie': '三',
    'vier': '四',
    'vijf': '五',
    'zes': '六',
    'zeven': '七',
    'acht': '八',
    'negen': '九',
    'tien': '十',
    'honderd': '百',
    'duizend': '千',
    'miljoen': '百万'
  },
  'ja-nl': {
    // Greetings and basic phrases
    'こんにちは': 'hallo',
    'こんばんは': 'goedenavond',
    'おはようございます': 'goedemorgen',
    'おやすみなさい': 'goedenacht',
    'さようなら': 'tot ziens',
    'ありがとう': 'dank je',
    'ありがとうございます': 'dankjewel',
    'どういたしまして': 'graag gedaan',
    'すみません': 'excuses',
    'ごめんなさい': 'sorry',
    '申し訳ありません': 'sorry',
    
    // Questions and responses
    'はい': 'ja',
    'いいえ': 'nee',
    'たぶん': 'misschien',
    'わかりません': 'ik weet het niet',
    '理解できません': 'ik begrijp het niet',
    '英語を話しますか': 'spreek je engels',
    '日本語を話しますか': 'spreek je japans',
    'お元気ですか': 'hoe gaat het',
    '元気です': 'het gaat goed',
    '調子が悪いです': 'het gaat slecht',
    
    // Time and questions
    '何時ですか': 'hoe laat is het',
    '今何時ですか': 'hoe laat is het nu',
    '何時': 'hoe laat',
    '時間は何時ですか': 'wat is de tijd',
    '何時に出発しますか': 'hoe laat vertrekt',
    '何時に来ますか': 'hoe laat komt',
    '何時に始まりますか': 'hoe laat begint',
    '何時に終わりますか': 'hoe laat eindigt',
    
    // Directions and locations
    'どこにありますか': 'waar is',
    'トイレはどこですか': 'waar is het toilet',
    '駅はどこですか': 'waar is het station',
    '空港はどこですか': 'waar is de luchthaven',
    'ホテルはどこですか': 'waar is het hotel',
    'レストランはどこですか': 'waar is het restaurant',
    '店はどこですか': 'waar is de winkel',
    '病院はどこですか': 'waar is het ziekenhuis',
    '警察はどこですか': 'waar is de politie',
    '消防署はどこですか': 'waar is de brandweer',
    'どうやって行けますか': 'hoe kom ik naar',
    '駅にはどうやって行けますか': 'hoe kom ik naar het station',
    '空港にはどうやって行けますか': 'hoe kom ik naar de luchthaven',
    
    // Shopping and money
    'いくらですか': 'hoeveel kost het',
    'これはいくらですか': 'hoeveel kost dit',
    'それはいくらですか': 'hoeveel kost dat',
    '値段はいくらですか': 'wat is de prijs',
    '高すぎます': 'te duur',
    '安いです': 'goedkoop',
    '割引': 'korting',
    'セール': 'sale',
    '無料': 'gratis',
    'お金': 'geld',
    'ユーロ': 'euro',
    'ドル': 'dollar',
    '円': 'yen',
    'これは高すぎます': 'dit is te duur',
    'それは高すぎます': 'dat is te duur',
    'これは安いです': 'dit is goedkoop',
    'それは安いです': 'dat is goedkoop',
    
    // Food and dining
    '食べ物': 'eten',
    '飲み物': 'drinken',
    '水': 'water',
    'コーヒー': 'koffie',
    'お茶': 'thee',
    'ビール': 'bier',
    'ワイン': 'wijn',
    'パン': 'brood',
    'ご飯': 'rijst',
    '肉': 'vlees',
    '魚': 'vis',
    '野菜': 'groente',
    '果物': 'fruit',
    'レストラン': 'restaurant',
    'カフェ': 'café',
    'バー': 'bar',
    'メニュー': 'menu',
    'お会計': 'rekening',
    'チップ': 'fooien',
    
    // Transportation
    '電車': 'trein',
    'バス': 'bus',
    '地下鉄': 'metro',
    'タクシー': 'taxi',
    '飛行機': 'vliegtuig',
    '駅': 'station',
    '停留所': 'halte',
    '空港': 'luchthaven',
    '切符': 'kaartje',
    'チケット': 'ticket',
    '予約': 'reservering',
    '遅延': 'vertraging',
    'キャンセル': 'annuleren',
    
    // Accommodation
    'ホテル': 'hotel',
    'ホステル': 'hostel',
    'ペンション': 'pension',
    '部屋': 'kamer',
    'チェックイン': 'check-in',
    'チェックアウト': 'check-out',
    'フロント': 'receptie',
    'エレベーター': 'lift',
    '階段': 'trap',
    
    // Emergency and health
    '病院': 'ziekenhuis',
    '医者': 'dokter',
    '看護師': 'verpleegster',
    '救急車': 'ambulance',
    '警察': 'politie',
    '消防署': 'brandweer',
    '助けて': 'help',
    '危険': 'gevaar',
    '痛い': 'pijn',
    '病気': 'ziek',
    '熱': 'koorts',
    '頭痛': 'hoofdpijn',
    '吐き気': 'misselijk',
    
    // Common objects
    'パスポート': 'paspoort',
    'ビザ': 'visum',
    '地図': 'kaart',
    'ガイド': 'gids',
    '本': 'boek',
    '新聞': 'krant',
    '雑誌': 'magazine',
    'ペン': 'pen',
    '紙': 'papier',
    'ハンカチ': 'zakdoek',
    '傘': 'paraplu',
    '眼鏡': 'bril',
    '時計': 'horloge',
    '電話': 'telefoon',
    'ノートパソコン': 'laptop',
    'カメラ': 'camera',
    '電池': 'batterij',
    '充電器': 'oplader',
    
    // Weather and time
    '晴れ': 'zonnig',
    '雨': 'regen',
    '雪': 'sneeuw',
    '暑い': 'warm',
    '寒い': 'koud',
    '今日': 'vandaag',
    '明日': 'morgen',
    '昨日': 'gisteren',
    '週': 'week',
    '月': 'maand',
    '年': 'jaar',
    '時間': 'uur',
    '分': 'minuut',
    '秒': 'seconde',
    
    // Numbers
    '零': 'nul',
    '一': 'een',
    '二': 'twee',
    '三': 'drie',
    '四': 'vier',
    '五': 'vijf',
    '六': 'zes',
    '七': 'zeven',
    '八': 'acht',
    '九': 'negen',
    '十': 'tien',
    '百': 'honderd',
    '千': 'duizend',
    '百万': 'miljoen'
  }
}

// Enhanced translation function with better error handling and debugging
export function getMockTranslation(
  text: string,
  fromLang: 'nl' | 'ja',
  toLang: 'nl' | 'ja'
): string {
  const key = `${fromLang}-${toLang}`
  const patterns = sentencePatterns[key] || {}
  
  // Clean the input text: remove punctuation and extra spaces
  const inputText = text.toLowerCase().trim().replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ')
  
  // Debug logging
  console.log(`Translating: "${text}" (${fromLang} → ${toLang})`)
  console.log(`Cleaned input: "${inputText}"`)
  
  // Try exact match first
  if (patterns[inputText]) {
    console.log(`Found exact match: "${patterns[inputText]}"`)
    return patterns[inputText]
  }
  
  // Try matching with original text (before cleaning) for exact matches
  const originalText = text.toLowerCase().trim()
  if (patterns[originalText]) {
    console.log(`Found exact match with original: "${patterns[originalText]}"`)
    return patterns[originalText]
  }
  
  // Try word-by-word translation for longer sentences with better logic
  const words = inputText.split(' ')
  if (words.length > 1) {
    const translatedWords = words.map(word => {
      const cleanWord = word.replace(/[.,!?]/g, '').toLowerCase()
      
      // Only translate if the word has a meaningful translation (not just numbers)
      const translation = patterns[cleanWord]
      if (translation && translation.length > 1) {
        return translation
      }
      
      // For short words like "een", "de", "het", "is", etc., keep them as is
      const shortWords = ['een', 'de', 'het', 'is', 'zijn', 'was', 'waren', 'heb', 'heeft', 'hebben', 'kan', 'kunnen', 'wil', 'willen', 'moet', 'moeten', 'ga', 'gaan', 'doe', 'doen', 'maak', 'maken', 'kom', 'komen', 'zie', 'zien', 'hoor', 'horen', 'voel', 'voelen', 'denk', 'denken', 'weet', 'weten', 'leer', 'leren', 'werk', 'werken', 'leef', 'leven', 'eet', 'eten', 'drink', 'drinken', 'slaap', 'slapen', 'loop', 'lopen', 'ren', 'rennen', 'zwem', 'zwemmen', 'speel', 'spelen', 'zing', 'zingen', 'dans', 'dansen', 'schrijf', 'schrijven', 'lees', 'lezen', 'tel', 'tellen', 'reken', 'rekenen', 'teken', 'tekenen', 'schild', 'schilderen', 'bouw', 'bouwen', 'repareer', 'repareren', 'koop', 'kopen', 'verkoop', 'verkopen', 'geef', 'geven', 'neem', 'nemen', 'breng', 'brengen', 'haal', 'halen', 'zoek', 'zoeken', 'vind', 'vinden', 'help', 'helpen', 'red', 'redden', 'bescherm', 'beschermen', 'verdedig', 'verdedigen', 'aanval', 'aanvallen', 'verdedig', 'verdedigen', 'win', 'winnen', 'verlies', 'verliezen', 'speel', 'spelen', 'werk', 'werken', 'studeer', 'studeren', 'leer', 'leren', 'onderwijs', 'onderwijzen', 'train', 'trainen', 'oefen', 'oefenen', 'probeer', 'proberen', 'test', 'testen', 'controleer', 'controleren', 'check', 'checken', 'verifieer', 'verifiëren', 'bevestig', 'bevestigen', 'ontken', 'ontkennen', 'ja', 'nee', 'misschien', 'waarschijnlijk', 'zeker', 'onzeker', 'mogelijk', 'onmogelijk', 'waarschijnlijk', 'onwaarschijnlijk', 'normaal', 'abnormaal', 'gewoon', 'ongewoon', 'speciaal', 'normaal', 'standaard', 'uniek', 'zeldzaam', 'vaak', 'soms', 'altijd', 'nooit', 'meestal', 'zelden', 'af en toe', 'regelmatig', 'onregelmatig', 'dagelijks', 'wekelijks', 'maandelijks', 'jaarlijks', 'elke', 'alle', 'sommige', 'weinig', 'veel', 'meer', 'minder', 'meest', 'minst', 'beste', 'slechtste', 'grootste', 'kleinste', 'hoogste', 'laagste', 'nieuwste', 'oudste', 'jongste', 'oudste', 'eerste', 'laatste', 'volgende', 'vorige', 'huidige', 'vorige', 'toekomstige', 'verleden', 'heden', 'toekomst', 'nu', 'dan', 'hier', 'daar', 'ergens', 'nergens', 'overal', 'ergens', 'daar', 'hier', 'daar', 'ergens', 'nergens', 'overal', 'binnen', 'buiten', 'boven', 'onder', 'voor', 'achter', 'naast', 'tussen', 'in', 'uit', 'op', 'af', 'aan', 'uit', 'door', 'over', 'onder', 'boven', 'voor', 'achter', 'naast', 'tussen', 'in', 'uit', 'op', 'af', 'aan', 'uit', 'door', 'over', 'onder', 'boven', 'voor', 'achter', 'naast']
      
      if (shortWords.includes(cleanWord)) {
        return cleanWord
      }
      
      return translation || cleanWord
    })
    
    const result = translatedWords.join(' ')
    if (result !== inputText) {
      console.log(`Word-by-word translation: "${result}"`)
      return result
    }
  }
  
  // Try partial matches for longer phrases (more flexible)
  for (const [pattern, translation] of Object.entries(patterns)) {
    const cleanPattern = pattern.toLowerCase().trim()
    
    // Check if the pattern is contained in the input text
    if (inputText.includes(cleanPattern) && cleanPattern.length > 2) {
      console.log(`Found partial match: "${cleanPattern}" → "${translation}"`)
      return translation
    }
    
    // Check if the input text is contained in the pattern (for longer patterns)
    if (cleanPattern.includes(inputText) && inputText.length > 2) {
      console.log(`Found reverse partial match: "${inputText}" → "${translation}"`)
      return translation
    }
    
    // Try matching without punctuation
    const cleanInputNoPunct = inputText.replace(/[.,!?;:]/g, '')
    const cleanPatternNoPunct = cleanPattern.replace(/[.,!?;:]/g, '')
    
    if (cleanInputNoPunct === cleanPatternNoPunct) {
      console.log(`Found match without punctuation: "${cleanPattern}" → "${translation}"`)
      return translation
    }
  }
  
  // Try reverse lookup for common phrases
  const reverseKey = `${toLang}-${fromLang}`
  const reversePatterns = sentencePatterns[reverseKey] || {}
  
  // Look for the input text in reverse patterns (for when user types in target language)
  for (const [pattern, translation] of Object.entries(reversePatterns)) {
    const cleanPattern = pattern.toLowerCase().trim()
    if (inputText.includes(cleanPattern) && cleanPattern.length > 2) {
      console.log(`Found reverse match: "${cleanPattern}" → "${translation}"`)
      return translation
    }
  }
  
  // Try fuzzy matching for similar phrases
  for (const [pattern, translation] of Object.entries(patterns)) {
    const cleanPattern = pattern.toLowerCase().trim()
    
    // Check if words are similar (for typos or slight variations)
    const inputWords = inputText.split(' ')
    const patternWords = cleanPattern.split(' ')
    
    // If most words match, consider it a match
    const matchingWords = inputWords.filter(word => 
      patternWords.some(patternWord => 
        word.includes(patternWord) || patternWord.includes(word)
      )
    )
    
    if (matchingWords.length >= Math.min(inputWords.length, patternWords.length) * 0.7) {
      console.log(`Found fuzzy match: "${cleanPattern}" → "${translation}"`)
      return translation
    }
  }
  
  // If no match found, return a helpful message with suggestions
  const suggestions = Object.keys(patterns)
    .filter(pattern => pattern.length > 3) // Only show longer patterns as suggestions
    .slice(0, 5)
  
  console.log(`No translation found for: "${text}"`)
  console.log(`Suggestions:`, suggestions)
  
  return `[Geen vertaling gevonden voor: "${text}"]\n\nProbeer een van deze woorden:\n${suggestions.join(', ')}`
} 