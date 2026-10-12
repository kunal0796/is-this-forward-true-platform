import { VerdictBadge } from './verdict-badge'
import type { Claim, Language } from '@/lib/verification/types'
import { Meter } from '@/components/kit/primitives'
import { Check, X, AlertTriangle, Clock, HelpCircle, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ClaimCardProps {
  claim: Claim
  index: number
  lang?: Language
}

const KIND_LABEL: Record<Claim['kind'], { label: string; color: string }> = {
  factual: { label: 'Factual Claim', color: 'border-blue-500/30 bg-blue-500/10 text-blue-400' },
  eligibility: { label: 'Eligibility Scope', color: 'border-amber-500/30 bg-amber-500/10 text-amber-400' },
  numerical: { label: 'Numerical / Quota', color: 'border-purple-500/30 bg-purple-500/10 text-purple-400' },
  temporal: { label: 'Deadline / Date', color: 'border-orange-500/30 bg-orange-500/10 text-orange-400' },
  health: { label: 'Medical / Health', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' },
  attribution: { label: 'Official Attribution', color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400' },
}

export function ClaimCard({ claim, index, lang = 'en' }: ClaimCardProps) {
  const kindMeta = KIND_LABEL[claim.kind] ?? KIND_LABEL.factual

  return (
    <div className="rounded-xl border border-border/80 bg-surface/70 p-4 sm:p-5 transition-all duration-200 hover:border-primary/30">
      {/* Top Header: Claim Index, Kind Badge, Verdict Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 font-mono text-xs font-semibold text-primary border border-primary/30">
            {index + 1}
          </span>
          <span className={cn('rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider border', kindMeta.color)}>
            {kindMeta.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <span>Confidence:</span>
            <span className="font-semibold text-foreground">{claim.confidence}%</span>
          </div>
          <VerdictBadge verdict={claim.verdict} lang={lang} size="sm" />
        </div>
      </div>

      {/* Claim statement */}
      <p className="mt-3 text-base sm:text-lg font-medium text-foreground leading-snug">
        “{claim.text}”
      </p>

      {/* Rationale */}
      <div className="mt-3 rounded-lg bg-black/25 p-3 text-xs sm:text-sm text-foreground/80 leading-relaxed border border-border/40">
        <span className="font-semibold text-primary block sm:inline mr-1.5 font-mono text-[11px] uppercase tracking-wide">
          Analysis Rationale:
        </span>
        {claim.rationale}
      </div>

      {/* Sub-claims decomposition if present */}
      {claim.subClaims && claim.subClaims.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border/40">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
            <Layers className="size-3.5 text-primary" />
            <span>Decomposed Sub-Claims:</span>
          </div>
          <div className="space-y-1.5">
            {claim.subClaims.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between gap-2 rounded-md bg-surface-2/60 px-3 py-1.5 text-xs"
              >
                <span className="text-foreground/90">{sub.text}</span>
                <span className="shrink-0">
                  <VerdictBadge verdict={sub.verdict} lang={lang} size="xs" />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
