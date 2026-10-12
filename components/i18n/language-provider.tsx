'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DICTIONARIES, type Dictionary } from '@/lib/i18n/dictionary'
import type { Language } from '@/lib/verification/types'

interface LanguageContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: Dictionary
}

const LanguageContext = createContext<LanguageContextValue | null>(null)
const STORAGE_KEY = 'itft-ui-language'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'hi' || stored === 'mr' || stored === 'en') setLangState(stored)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next: Language) => {
    setLangState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const value = useMemo(() => ({ lang, setLang, t: DICTIONARIES[lang] }), [lang, setLang])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
