import Link from 'next/link'
import { ExternalLink, Calendar, CheckCircle2, XCircle, Info, ShieldCheck, Award } from 'lucide-react'
import type { Evidence, Source } from '@/lib/verification/types'
import { SOURCE_TYPE_LABEL, getSource } from '@/lib/verification/sources'
import { Meter } from '@/components/kit/primitives'
import { cn } from '@/lib/utils'

interface EvidenceCardProps {
  evidence: Evidence
  compact?: boolean
}

export function EvidenceCard({ evidence, compact = false }: EvidenceCardProps) {
  const source: Source | undefined = getSource(evidence.sourceId)
  const isSupporting = evidence.stance === 'supports'
  const isContradicting = evidence.stance === 'contradicts'

  const formattedDate = new Date(evidence.publishedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div
      className={cn(
        'group relative rounded-xl border p-4 sm:p-5 transition-all duration-200',
        isSupporting && 'border-emerald-500/20 bg-emerald-950/10 hover:border-emerald-500/40 hover:bg-emerald-950/20',
        isContradicting && 'border-rose-500/20 bg-rose-950/10 hover:border-rose-500/40 hover:bg-rose-950/20',
        !isSupporting && !isContradicting && 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
      )}
    >
      {/* Top Header: Source Info & Stance Badge */}
      <div className="flex flex-wrap items-start justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-semibold',
              isSupporting && 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
              isContradicting && 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
              !isSupporting && !isContradicting && 'bg-slate-800 text-slate-300 border border-slate-700'
            )}
          >
            {isSupporting ? (
              <CheckCircle2 className="size-4" />
            ) : isContradicting ? (
              <XCircle className="size-4" />
            ) : (
              <Info className="size-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-sm tracking-tight">{evidence.sourceName}</span>
              {source?.ifcnSignatory && (
                <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.2 font-mono text-[9px] font-medium uppercase tracking-wide bg-sky-950/80 text-sky-400 border border-sky-500/30">
                  <Award className="size-2.5" />
                  IFCN Signatory
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {SOURCE_TYPE_LABEL[evidence.sourceType] ?? evidence.sourceType}
              {source?.region ? ` • ${source.region}` : ''}
            </span>
          </div>
        </div>

        {/* Stance tag */}
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider',
            isSupporting && 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
            isContradicting && 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
            !isSupporting && !isContradicting && 'bg-slate-800/80 text-slate-300 border border-slate-700'
          )}
        >
          {isSupporting ? 'Supports' : isContradicting ? 'Contradicts' : 'Context'}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-sm sm:text-base font-medium text-foreground/95 leading-snug group-hover:text-primary transition-colors">
        {evidence.title}
      </h4>

      {/* Snippet Block */}
      <blockquote className="mt-3 relative rounded-lg border border-border/50 bg-black/30 p-3 text-xs sm:text-sm text-foreground/80 leading-relaxed italic">
        <span className="text-primary font-serif font-bold text-base mr-1">“</span>
        {evidence.snippet}
        <span className="text-primary font-serif font-bold text-base ml-1">”</span>
      </blockquote>

      {/* Metadata & Scores */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-border/40 text-xs">
        <div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
            <span>Source Authority</span>
            <span className="font-mono font-medium text-foreground">{evidence.authority}/100</span>
          </div>
          <Meter value={evidence.authority} color={evidence.authority >= 90 ? 'bg-sky-400' : 'bg-primary'} label="Source Authority" />
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
            <span>Relevance</span>
            <span className="font-mono font-medium text-foreground">{evidence.relevance}%</span>
          </div>
          <Meter value={evidence.relevance} color="bg-emerald-400" label="Relevance Score" />
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-end gap-2">
          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
            <Calendar className="size-3.5" />
            <span>{formattedDate}</span>
          </div>
          <a
            href={evidence.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-foreground hover:bg-primary hover:text-white transition-colors"
          >
            <span>Open Source</span>
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
