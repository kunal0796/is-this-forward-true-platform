'use client'

import Link from 'next/link'
import {
  FileText,
  Lock,
  Sparkles,
  Search,
  GitCompare,
  Database,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  BrainCircuit,
  Scale,
  CalendarClock,
  Layers,
} from 'lucide-react'
import { PageShell, DemoBadge } from '@/components/kit/primitives'
import { VERDICTS, VERDICT_ORDER } from '@/lib/verification/verdicts'
import { useLanguage } from '@/components/i18n/language-provider'
import { cn } from '@/lib/utils'

export default function HowItWorksPage() {
  const { lang } = useLanguage()

  const stages = [
    {
      num: '01',
      title: 'Multimodal Parsing & Ingestion',
      subtitle: 'Converting messy user forwards into normalized tokens',
      detail:
        'WhatsApp users circulate misinformation through forwarded text paragraphs, status screenshots, low-bitrate voice notes (.opus), and scanned PDF notices. Our parser extracts raw text using localized OCR, Whisper ASR (supporting Indic accents), and PDF byte decoders.',
      icon: FileText,
    },
    {
      num: '02',
      title: 'Zero-Knowledge PII Scrubbing',
      subtitle: 'Protecting user anonymity before any LLM inference',
      detail:
        'Before a forwarded message is sent to vector databases or language models, our client-side regex engine sanitizes personal details: 10-digit Indian phone numbers (+91), personal names, email addresses, Aadhaar, PAN, and UPI handles are replaced with typed tokens like [NAME] and [PHONE].',
      icon: Lock,
    },
    {
      num: '03',
      title: 'Claim Extraction & Atomic Decomposition',
      subtitle: 'Separating complex viral forwards into testable facts',
      detail:
        'A single forward often bundles multiple half-truths (e.g. “The government announced a laptop scheme, every student gets one, registration closes tomorrow”). We decompose this into atomic sub-claims: factual existence, eligibility scope, and deadline validity.',
      icon: Layers,
    },
    {
      num: '04',
      title: 'Authoritative Evidence Retrieval',
      subtitle: 'Querying official gazettes, regulators, and IFCN repositories',
      detail:
        'Rather than searching the open uncurated web where misinformation echoes, we query our curated Trusted Source Registry (PIB, RBI, WHO, Reuters, AltNews, BoomLive). Documents are indexed with publication timestamps and authority scores (0–100).',
      icon: Search,
    },
    {
      num: '05',
      title: 'Temporal Check & Contradiction Detection',
      subtitle: 'Resolving expired rules vs contemporary directives',
      detail:
        'Many viral forwards were once true years ago but are now expired (e.g. the ₹2000 note demonetisation deadline). Our temporal engine checks notification dates against the current calendar, separating OUTDATED notices from deliberate falsehoods.',
      icon: CalendarClock,
    },
    {
      num: '06',
      title: 'Calibrated Adjudication & Explanation',
      subtitle: 'Synthesizing evidence without black-box hallucination',
      detail:
        'The final verdict is derived deterministically from the evidence matrix. We never expose generative chain-of-thought; instead, we provide a structured 6-step audit trail, confidence percentage, and direct links to original statutory sources.',
      icon: Scale,
    },
  ]

  const comparisons = [
    {
      aspect: 'Privacy & Identity',
      us: '100% Zero-Knowledge PII scrubbing. Raw media deleted immediately.',
      others: 'Sends raw user phone numbers and contact details directly to third-party LLM providers.',
    },
    {
      aspect: 'Evidence Provenance',
      us: 'Strictly restricted to audited Government & IFCN registry sources with citations.',
      others: 'Generates plausible-sounding answers from training memory, prone to hallucination.',
    },
    {
      aspect: 'Temporal Calibration',
      us: 'Explicitly labels OUTDATED policies (e.g. ₹2000 note exchange windows).',
      others: 'Confuses old archived news articles with current government notifications.',
    },
    {
      aspect: 'Indian Modalities',
      us: 'Native support for Hinglish, Marathi, Indic audio notes, and WhatsApp screenshots.',
      others: 'Primarily tuned for formal English web queries, failing on vernacular forwards.',
    },
  ]

  return (
    <div className="relative pb-24 pt-8 md:pt-12">
      <PageShell>
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-2">
            <DemoBadge />
            <span className="font-mono text-xs text-muted-foreground">• System Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            How The Platform Works
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            A comprehensive look at our 6-stage multimodal pipeline: from client-side PII scrubbing
            to atomic claim decomposition and calibrated evidence adjudication.
          </p>
        </div>

        {/* 6 Stage Detailed Walkthrough */}
        <div className="space-y-6">
          {stages.map((stage) => {
            const Icon = stage.icon
            return (
              <div
                key={stage.num}
                className="rounded-3xl border border-border bg-surface p-6 sm:p-8 flex flex-col md:flex-row items-start gap-6 shadow-xl"
              >
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 font-mono font-extrabold text-xl">
                  {stage.num}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      {stage.title}
                    </h3>
                    <span className="rounded bg-surface-2 px-2.5 py-0.5 text-xs text-muted-foreground font-mono">
                      {stage.subtitle}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans pt-1">
                    {stage.detail}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Why Not Standard ChatGPT Comparison Table */}
        <div className="mt-20 rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-xl">
          <div className="max-w-2xl mb-8">
            <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
              Engineering Rationale
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Why not just use ChatGPT or Gemini?
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              General conversational models are not built for adversarial viral misinformation or zero-knowledge Indian WhatsApp safety.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-border bg-surface-2/60 font-mono text-[11px] uppercase text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5">Architecture Feature</th>
                  <th className="px-5 py-3.5 text-primary">Is This Forward True?</th>
                  <th className="px-5 py-3.5 text-muted-foreground">Generic Chatbots</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {comparisons.map((c) => (
                  <tr key={c.aspect} className="hover:bg-surface-2/30 transition-colors">
                    <td className="px-5 py-4 font-bold text-foreground">{c.aspect}</td>
                    <td className="px-5 py-4 text-emerald-300 font-medium bg-emerald-950/10">
                      ✓ {c.us}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      ✗ {c.others}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* The 5 Verdict Definitions */}
        <div className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              The 5 Verdict Standards
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Nuance matters. Here is our rigorous definition for each badge:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VERDICT_ORDER.map((v) => {
              const meta = VERDICTS[v]
              return (
                <div
                  key={v}
                  className={cn('rounded-2xl border p-5 flex flex-col justify-between', meta.bg, meta.border)}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{meta.emoji}</span>
                      <span className={cn('text-base font-bold uppercase', meta.text)}>
                        {meta.label[lang] || meta.label.en}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-foreground/90">
                      {meta.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-blue-600 transition-all"
          >
            <span>Try Verifying a Message Now</span>
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </PageShell>
    </div>
  )
}
