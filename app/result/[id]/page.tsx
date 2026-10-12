'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  History,
  ShieldQuestionMark,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Info,
  Calendar,
  Lock,
  Sparkles,
  ChevronRight,
  Database,
  Globe,
  RefreshCw,
} from 'lucide-react'
import { PageShell, DemoBadge, Meter } from '@/components/kit/primitives'
import { VerdictBadge } from '@/components/verdict/verdict-badge'
import { ConfidenceGauge } from '@/components/verdict/confidence-gauge'
import { EvidenceCard } from '@/components/verdict/evidence-card'
import { ClaimCard } from '@/components/verdict/claim-card'
import { DEMO_SCENARIOS, getScenario, matchScenario, type DemoScenario } from '@/lib/verification/demo/scenarios'
import { VERDICTS, confidenceLabel } from '@/lib/verification/verdicts'
import { getSource, TRUSTED_SOURCES } from '@/lib/verification/sources'
import { useLanguage } from '@/components/i18n/language-provider'
import type { Language, VerificationResult } from '@/lib/verification/types'
import { cn } from '@/lib/utils'

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const { lang, setLang, t } = useLanguage()
  const [copiedShare, setCopiedShare] = useState(false)

  // Resolve deterministic demo scenario from id or fallback
  let scenario: DemoScenario = DEMO_SCENARIOS[0]
  if (id.includes('note2000')) {
    scenario = getScenario('note2000') || DEMO_SCENARIOS[1]
  } else if (id.includes('hotwater')) {
    scenario = getScenario('hotwater') || DEMO_SCENARIOS[2]
  } else if (id.includes('ticks')) {
    scenario = getScenario('ticks') || DEMO_SCENARIOS[3]
  } else if (id.includes('chandrayaan')) {
    scenario = getScenario('chandrayaan') || DEMO_SCENARIOS[4]
  } else {
    scenario = getScenario('laptop') || DEMO_SCENARIOS[0]
  }

  const verdictMeta = VERDICTS[scenario.verdict]
  const supportingEvidence = scenario.evidence.filter((e) => e.stance === 'supports')
  const contradictingEvidence = scenario.evidence.filter((e) => e.stance === 'contradicts')
  const contextEvidence = scenario.evidence.filter((e) => e.stance === 'context')

  // Formatted shareable WhatsApp message
  const shareText = `🔍 *IS THIS FORWARD TRUE? FACT CHECK REPORT*
Verdict: ${verdictMeta.emoji} *${verdictMeta.label.en.toUpperCase()}* (${scenario.confidence}% Confidence)

*Summary:* ${scenario.summary[lang] || scenario.summary.en}

*Fact Check Details:*
• Original Claim: "${scenario.sampleText.slice(0, 100)}..."
• Sources Checked: ${scenario.evidence.map((e) => e.sourceName).join(', ')}

👉 Check before forwarding: https://isthisforwardtrue.in`

  const handleCopyShare = () => {
    navigator.clipboard.writeText(shareText)
    setCopiedShare(true)
    setTimeout(() => setCopiedShare(false), 2000)
  }

  return (
    <div className="relative pb-24 pt-6 md:pt-10">
      <PageShell>
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/50">
          <Link
            href="/verify"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Check Another Forward</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <DemoBadge />

            {/* Language Switcher for Localized Verdict */}
            <div className="flex items-center rounded-lg border border-border/70 bg-surface p-0.5 text-xs font-medium">
              {(['en', 'hi', 'mr'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={cn(
                    'rounded-md px-2.5 py-1 transition-all',
                    lang === l ? 'bg-primary text-white font-semibold' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : 'मराठी'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCopyShare}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/20 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-950/40 transition-colors"
            >
              {copiedShare ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
              <span>{copiedShare ? 'Copied to Clipboard' : 'Share on WhatsApp'}</span>
            </button>
          </div>
        </div>

        {/* HERO VERDICT CARD */}
        <div
          className={cn(
            'mt-8 rounded-3xl border p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl',
            verdictMeta.bg,
            verdictMeta.border
          )}
        >
          {/* Background Ambient Glow */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: verdictMeta.hex }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Big Verdict, Headline, and Summary */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl sm:text-4xl">{verdictMeta.emoji}</span>
                <span className={cn('text-2xl sm:text-4xl font-extrabold uppercase tracking-tight', verdictMeta.text)}>
                  {verdictMeta.label[lang] || verdictMeta.label.en}
                </span>
                <span className="rounded-full bg-black/40 px-3 py-1 font-mono text-xs font-medium text-foreground border border-border/40">
                  {confidenceLabel(scenario.confidence)} ({scenario.confidence}%)
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-snug">
                {scenario.headline[lang] || scenario.headline.en}
              </h1>

              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-foreground/90 font-sans">
                {scenario.summary[lang] || scenario.summary.en}
              </p>

              {/* Redacted Original WhatsApp Forward Preview */}
              <div className="rounded-xl border border-border/60 bg-black/40 p-4 text-xs font-sans text-muted-foreground">
                <div className="flex items-center justify-between mb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span>Sanitized WhatsApp Input</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Lock className="size-3" />
                    PII Scrubbed • Raw Media Flushed
                  </span>
                </div>
                <p className="italic text-foreground/80 line-clamp-3 leading-relaxed">
                  “{scenario.sampleText}”
                </p>
              </div>
            </div>

            {/* Right Column: Confidence Gauge & Quick Stat Ring */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-black/30 border border-border/40">
              <ConfidenceGauge value={scenario.confidence} verdict={scenario.verdict} size={200} />
              <div className="mt-4 w-full grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-lg bg-surface p-2 border border-border/40">
                  <span className="font-mono text-emerald-400 font-bold block text-sm">
                    {supportingEvidence.length}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase">Supporting</span>
                </div>
                <div className="rounded-lg bg-surface p-2 border border-border/40">
                  <span className="font-mono text-rose-400 font-bold block text-sm">
                    {contradictingEvidence.length}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase">Contradicting</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: CLAIM BREAKDOWN */}
        <div className="mt-12 sm:mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
                Decomposition
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Claim Breakdown ({scenario.claims.length} Independent Propositions)
              </h2>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block">
              Parsed from forwarded message
            </span>
          </div>

          <div className="space-y-4">
            {scenario.claims.map((claim, idx) => (
              <ClaimCard key={claim.id} claim={claim} index={idx} lang={lang} />
            ))}
          </div>
        </div>

        {/* SECTION 2: EVIDENCE SECTIONS (SUPPORTING & CONTRADICTING) */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Supporting Evidence Column */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-emerald-500/30">
              <CheckCircle2 className="size-5 text-emerald-400" />
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                Supporting Evidence ({supportingEvidence.length})
              </h3>
            </div>
            {supportingEvidence.length > 0 ? (
              <div className="space-y-4">
                {supportingEvidence.map((ev) => (
                  <EvidenceCard key={ev.id} evidence={ev} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border/60 bg-surface/40 p-6 text-center text-xs text-muted-foreground">
                No credible supporting evidence found in trusted government or registry records.
              </div>
            )}
          </div>

          {/* Contradicting Evidence Column */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-rose-500/30">
              <XCircle className="size-5 text-rose-400" />
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                Contradicting Evidence ({contradictingEvidence.length})
              </h3>
            </div>
            {contradictingEvidence.length > 0 ? (
              <div className="space-y-4">
                {contradictingEvidence.map((ev) => (
                  <EvidenceCard key={ev.id} evidence={ev} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border/60 bg-surface/40 p-6 text-center text-xs text-muted-foreground">
                No direct contradiction found from authoritative sources.
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: "WHY DID WE DECIDE THIS?" (AI ADJUDICATION SUMMARY) */}
        <div className="mt-16 sm:mt-20 rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-xl">
          <div className="max-w-2xl mb-8">
            <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
              Transparency & Provenance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Why did we decide this?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Our adjudication engine does not guess or generate synthetic hallucinations. It follows a verifiable 6-step audit trail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenario.steps.map((st, i) => (
              <div
                key={st.key}
                className="rounded-2xl border border-border/70 bg-surface-2/40 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] font-bold text-primary">
                      STEP 0{i + 1}
                    </span>
                    <CheckCircle2 className="size-4 text-emerald-400" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-foreground">{st.title}</h4>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {st.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: SOURCE TRUST SCORES & REGISTRY DETAILS */}
        <div className="mt-16 sm:mt-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Audited Sources
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Source Trust Scores & Publication Metadata
              </h2>
            </div>
            <Link
              href="/sources"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View Full Registry</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-border bg-surface-2/60 text-muted-foreground font-mono text-[11px] uppercase">
                <tr>
                  <th className="px-5 py-3.5">Source</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Authority Rating</th>
                  <th className="px-5 py-3.5">Domain</th>
                  <th className="px-5 py-3.5 text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {scenario.evidence.map((ev) => {
                  const src = getSource(ev.sourceId)
                  return (
                    <tr key={ev.id} className="hover:bg-surface-2/40 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-foreground">
                        {ev.sourceName}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        <span className="rounded bg-surface-2 px-2 py-0.5 text-xs font-mono">
                          {ev.sourceType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono">
                        <span className="font-bold text-primary">{ev.authority}</span>
                        <span className="text-muted-foreground"> / 100</span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-muted-foreground">
                        {src?.domain || 'official-portal.gov.in'}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <a
                          href={ev.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="size-3" />
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM CTA: CHECK ANOTHER / COPY WHATSAPP REPORT */}
        <div className="mt-16 sm:mt-20 rounded-2xl border border-border/80 bg-surface p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Help curb WhatsApp misinformation
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Copy this verified card and send it back to the group that forwarded it.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopyShare}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg hover:bg-emerald-500 transition-colors"
            >
              {copiedShare ? <Check className="size-4" /> : <Copy className="size-4" />}
              <span>{copiedShare ? 'Copied Message!' : 'Copy WhatsApp Fact Card'}</span>
            </button>
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-accent transition-colors"
            >
              <span>Check Another Forward</span>
            </Link>
          </div>
        </div>
      </PageShell>
    </div>
  )
}
