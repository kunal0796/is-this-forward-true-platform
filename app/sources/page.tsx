'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  ExternalLink,
  ShieldCheck,
  Award,
  Filter,
  CheckCircle2,
  Clock,
  Globe,
  Building2,
  ArrowRight,
} from 'lucide-react'
import { PageShell, DemoBadge, Meter } from '@/components/kit/primitives'
import { TRUSTED_SOURCES, SOURCE_TYPE_LABEL } from '@/lib/verification/sources'
import type { Source, SourceType } from '@/lib/verification/types'
import { cn } from '@/lib/utils'

export default function SourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')

  const filteredSources = TRUSTED_SOURCES.filter((src) => {
    const matchesSearch =
      src.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.shortName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedType === 'all' || src.type === selectedType

    return matchesSearch && matchesType
  })

  const types: { id: string; label: string }[] = [
    { id: 'all', label: 'All Sources' },
    { id: 'government', label: 'Government' },
    { id: 'regulator', label: 'Regulator' },
    { id: 'fact_checker', label: 'IFCN Fact-Checkers' },
    { id: 'international_org', label: 'International Bodies' },
    { id: 'news_agency', label: 'News Agencies' },
  ]

  return (
    <div className="relative pb-24 pt-8 md:pt-12">
      <PageShell>
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 mb-2">
            <DemoBadge />
            <span className="font-mono text-xs text-muted-foreground">• Primary Evidence Registry</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Trusted Source Registry
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Every verification on our platform relies exclusively on pre-audited government gazettes, regulatory notifications, international organizations, and IFCN certified fact-checkers.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or domain (e.g. pib.gov.in, rbi, reuters)..."
              className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Type Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            {types.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedType(t.id)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border shrink-0',
                  selectedType === t.id
                    ? 'border-primary bg-primary/20 text-primary font-semibold'
                    : 'border-border/60 bg-surface-2 text-muted-foreground hover:text-foreground'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Source Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSources.map((source) => (
            <div
              key={source.id}
              className="group rounded-2xl border border-border bg-surface p-5 sm:p-6 flex flex-col justify-between hover:border-primary/40 transition-all shadow-md"
            >
              <div>
                {/* Header row: Short name & Authority Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {source.shortName}
                  </span>
                  <div className="flex items-center gap-2">
                    {source.ifcnSignatory && (
                      <span className="inline-flex items-center gap-1 rounded bg-sky-950/80 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase text-sky-400 border border-sky-500/30">
                        <Award className="size-2.5" />
                        IFCN
                      </span>
                    )}
                    <span className="rounded bg-primary/10 border border-primary/30 px-2 py-0.5 font-mono text-[11px] font-bold text-primary">
                      {source.authorityScore}/100
                    </span>
                  </div>
                </div>

                {/* Full name */}
                <h3 className="text-xs sm:text-sm font-medium text-foreground/90 leading-snug">
                  {source.name}
                </h3>

                {/* Description */}
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {source.description}
                </p>
              </div>

              {/* Bottom Metadata & Link */}
              <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-[11px] text-muted-foreground block">
                    {source.domain}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    ● {source.status.toUpperCase()}
                  </span>
                </div>

                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-2.5 py-1 text-xs font-medium text-foreground hover:bg-primary hover:text-white transition-colors"
                >
                  <span>Portal</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredSources.length === 0 && (
          <div className="rounded-2xl border border-border bg-surface p-12 text-center text-sm text-muted-foreground">
            No sources match your search query. Try searching for &ldquo;pib&rdquo;, &ldquo;rbi&rdquo;, or &ldquo;reuters&rdquo;.
          </div>
        )}

        {/* Source Methodology Note */}
        <div className="mt-16 rounded-3xl border border-border bg-surface-2/40 p-6 sm:p-8">
          <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <ShieldCheck className="size-5 text-emerald-400" />
            Registry Inclusion & Authority Weighting Methodology
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Sources receive authority weightings based on constitutional statutory mandates (e.g. Government of India gazettes = 97), central banking regulatory authority (RBI = 98), international bodies (WHO = 96), and IFCN signatory status with transparent editorial codes. Unverified social media handles, self-published blogs, or partisan portals are barred from evidence synthesis.
          </p>
        </div>
      </PageShell>
    </div>
  )
}
