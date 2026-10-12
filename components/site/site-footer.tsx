import Link from 'next/link'
import { Logo } from './logo'

const groups = [
  {
    title: 'Product',
    links: [
      { href: '/verify', label: 'Check a forward' },
      { href: '/whatsapp-demo', label: 'WhatsApp demo' },
      { href: '/dashboard', label: 'Dashboard' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { href: '/how-it-works', label: 'How it works' },
      { href: '/sources', label: 'Source registry' },
      { href: '/privacy', label: 'Privacy' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.5fr_1fr_1fr] md:px-6">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            A privacy-first verification layer for forwarded messages. We explain evidence, we never claim certainty we
            do not have, and we label demo results clearly.
          </p>
        </div>
        {groups.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{g.title}</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-foreground/80 transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border">
        <p className="mx-auto w-full max-w-6xl px-4 py-5 font-mono text-[11px] text-muted-foreground md:px-6">
          Verdicts are guidance, not legal or medical advice. Always confirm with the official source linked in each report.
        </p>
      </div>
    </footer>
  )
}
