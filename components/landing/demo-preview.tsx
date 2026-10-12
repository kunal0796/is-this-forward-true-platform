'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowRight, CheckCircle2, AlertTriangle, ShieldX, History, Sparkles, ExternalLink, ShieldCheck, Flame } from 'lucide-react'
import { DEMO_SCENARIOS, type DemoScenario } from '@/lib/verification/demo/scenarios'
import { VERDICTS } from '@/lib/verification/verdicts'
import { VerdictBadge } from '@/components/verdict/verdict-badge'
import { DemoBadge } from '@/components/kit/primitives'
import { cn } from '@/lib/utils'

export function DemoPreview() {
  const [activeKey, setActiveKey] = useState<string>('laptop')
  const scenario = DEMO_SCENARIOS.find((s) => s.key === activeKey) || DEMO_SCENARIOS[0]
  const meta = VERDICTS[scenario.verdict]

  const supportingCount = scenario.evidence.filter((e) => e.stance === 'supports').length
  const contradictingCount = scenario.evidence.filter((e) => e.stance === 'contradicts').length

  return (
    <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-surface/90 to-surface/40 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <DemoBadge />
            <span className="font-mono text-xs text-muted-foreground">• Deterministic Demo Engine</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Interactive Forward Inspector
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Pick a real viral WhatsApp forward below to see instant multimodal decomposition & verification.
          </p>
        </div>

        {/* Preset Selector Chips */}
        <div className="flex flex-wrap gap-2">
          {DEMO_SCENARIOS.map((s) => {
            const isCurrent = s.key === activeKey
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setActiveKey(s.key)}
                className={cn(
                  'rounded-xl px-3.5 py-2 text-xs font-medium transition-all border',
                  isCurrent
                    ? 'border-primary bg-primary/20 text-white shadow-[0_0_15px_rgba(59,130,255,0.25)]'
                    : 'border-border/60 bg-surface-2 text-muted-foreground hover:text-foreground hover:bg-surface-2/80'
                )}
              >
                {s.sampleLabel}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Preview Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Left Column: The Input WhatsApp Message */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-border/70 bg-black/40 p-5">
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pb-3 mb-3 border-b border-border/40">
                <span className="font-mono uppercase tracking-wider text-[11px] text-primary flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary animate-ping" />
                  Received WhatsApp Forward
                </span>
                <span className="rounded bg-surface-2 px-2 py-0.5 text-[10px] font-mono">
                  {scenario.category}
                </span>
              </div>
              <blockquote className="text-sm md:text-base leading-relaxed text-foreground/90 font-sans italic border-l-2 border-primary/60 pl-3 py-1">
                “{scenario.sampleText}”
              </blockquote>
            </div>

            <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                <ShieldCheck className="size-3.5" />
                Zero PII stored
              </span>
              <span className="font-mono text-[11px]">3 atomic claims identified</span>
            </div>
          </div>

          {/* Right Column: The AI Verdict & Evidence Summary */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-border/80 bg-surface-2/40 p-5 md:p-6">
            <div>
              {/* Verdict header banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-border/50">
                <div className="flex items-center gap-2.5">
                  <VerdictBadge verdict={scenario.verdict} size="md" />
                  <span className="font-mono text-xs text-muted-foreground">
                    Confidence: <strong className="text-foreground">{scenario.confidence}%</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="size-3.5" />
                    {supportingCount} Supporting
                  </span>
                  <span className="flex items-center gap-1 text-rose-400 font-medium">
                    <ShieldX className="size-3.5" />
                    {contradictingCount} Contradicting
                  </span>
                </div>
              </div>

              {/* Headline & Summary */}
              <h4 className="text-lg md:text-xl font-bold text-foreground tracking-tight leading-snug">
                {scenario.headline.en}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {scenario.summary.en}
              </p>

              {/* Evidence sources teaser */}
              <div className="mt-4 pt-3 border-t border-border/40 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                  Authoritative Primary Sources Consulted:
                </span>
                <div className="flex flex-wrap gap-2">
                  {scenario.evidence.map((ev) => (
                    <span
                      key={ev.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface px-2.5 py-1 text-xs text-foreground/90 font-medium"
                    >
                      <span className="size-1.5 rounded-full bg-primary" />
                      {ev.sourceName}
                      <span className="font-mono text-[10px] text-muted-foreground">({ev.authority}/100)</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA to inspect full dossier */}
            <div className="mt-6 pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground font-mono">
                Full cryptographic trace & sources available
              </span>
              <Link
                href={`/result/demo-text-${scenario.key}-001`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all active:scale-[0.98]"
              >
                <span>View Complete Fact Report</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
