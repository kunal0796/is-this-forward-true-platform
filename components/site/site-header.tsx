'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, ScanSearch, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/components/i18n/language-provider'
import { LanguageSwitcher } from '@/components/i18n/language-switcher'
import { buttonClass } from '@/components/kit/primitives'
import { cn } from '@/lib/utils'
import { Logo } from './logo'

export function SiteHeader() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/how-it-works', label: t.nav.how },
    { href: '/whatsapp-demo', label: t.nav.whatsapp },
    { href: '/sources', label: t.nav.sources },
    { href: '/privacy', label: t.nav.privacy },
    { href: '/dashboard', label: t.nav.dashboard },
  ]

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Logo />
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-2 text-sm transition-colors',
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:flex" />
          <Link href="/verify" className={cn(buttonClass({ size: 'sm' }), 'hidden sm:inline-flex')}>
            <ScanSearch aria-hidden="true" />
            {t.cta}
          </Link>
          <button
            type="button"
            className={cn(buttonClass({ variant: 'ghost', size: 'icon' }), 'lg:hidden')}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-16 h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-background px-4 pb-10 pt-4 lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {[{ href: '/verify', label: t.nav.verify }, ...links].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={pathname === l.href ? 'page' : undefined}
                  className="flex items-center justify-between border-b border-border py-4 text-lg font-medium text-foreground"
                >
                  {l.label}
                  <span aria-hidden="true" className="font-mono text-xs text-muted-foreground">
                    {l.href}
                  </span>
                </Link>
              ))}
            </nav>
            <LanguageSwitcher className="mt-6 w-fit" />
            <Link href="/verify" className={cn(buttonClass({ size: 'lg' }), 'mt-6 w-full')}>
              <ScanSearch aria-hidden="true" />
              {t.cta}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
