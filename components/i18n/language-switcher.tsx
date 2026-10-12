'use client'

import { Languages } from 'lucide-react'
import { LANGUAGES } from '@/lib/i18n/dictionary'
import { cn } from '@/lib/utils'
import { useLanguage } from './language-provider'

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useLanguage()
  return (
    <div
      role="radiogroup"
      aria-label={t.language}
      className={cn('flex items-center gap-0.5 rounded-lg border border-border bg-surface p-0.5', className)}
    >
      <Languages className="mx-1.5 size-3.5 text-muted-foreground" aria-hidden="true" />
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          role="radio"
          aria-checked={lang === l.code}
          aria-label={l.label}
          onClick={() => setLang(l.code)}
          className={cn(
            'min-w-8 rounded-md px-2 py-1 text-xs font-medium transition-colors',
            lang === l.code ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
          )}
        >
          {l.native}
        </button>
      ))}
    </div>
  )
}
