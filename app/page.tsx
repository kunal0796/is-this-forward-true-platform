'use client'

import Link from 'next/link'
import {
  FileText,
  Image as ImageIcon,
  Mic,
  FileCheck,
  Link2,
  ShieldCheck,
  ScanSearch,
  MessageSquare,
  ArrowRight,
  Database,
  Lock,
  Sparkles,
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  History,
  HelpCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react'
import { DemoBadge, PageShell } from '@/components/kit/primitives'
import { DemoPreview } from '@/components/landing/demo-preview'
import { VERDICTS, VERDICT_ORDER } from '@/lib/verification/verdicts'
import { TRUSTED_SOURCES } from '@/lib/verification/sources'
import { useLanguage } from '@/components/i18n/language-provider'
import { cn } from '@/lib/utils'

export default function LandingPage() {
  const { t, lang } = useLanguage()

  const modalities = [
    { label: 'WhatsApp Text', icon: FileText, desc: 'Paste forwards or chain messages' },
    { label: 'Screenshots / Images', icon: ImageIcon, desc: 'OCR parsing for status & circulars' },
    { label: 'Voice Notes', icon: Mic, desc: 'Audio transcription & accent detection' },
    { label: 'Official PDFs', icon: FileCheck, desc: 'Government gazette & circular scanner' },
    { label: 'URLs & Portals', icon: Link2, desc: 'Domain authenticity & phishing check' },
  ]

  const pipelineStages = [
    { title: 'Multimodal Parsing', desc: 'Text, OCR, Whisper ASR, PDF byte extract' },
    { title: 'PII Scrubbing', desc: 'On-device regex redaction for phone, name, email' },
    { title: 'Claim Decomposition', desc: 'Atomic separation into verifiable statements' },
    { title: 'Evidence Retrieval', desc: 'Cross-querying 50+ official registries' },
    { title: 'Source Authority Weighting', desc: 'Calculated trust & IFCN verification audit' },
    { title: 'Calibrated Adjudication', desc: 'Multi-evidence synthesis with confidence rating' },
  ]

  return (
    <div className="relative overflow-hidden pb-20">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -z-10 h-[600px] w-full max-w-7xl opacity-30 blur-[120px] bg-gradient-to-b from-blue-600 via-indigo-600 to-transparent" />

      <PageShell className="pt-12 md:pt-20">
        {/* Top Hero Section */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 mb-6 text-xs font-mono font-medium text-primary">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            <span>AI-POWERED VERIFICATION FOR INDIA</span>
            <span className="text-white/30">•</span>
            <span className="text-muted-foreground">ZERO RETENTION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground text-balance">
            Before you forward it,{' '}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-primary bg-clip-text text-transparent">
              check it.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
            AI-powered fact checking for the messages people actually receive.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/verify"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-blue-600 hover:shadow-primary/40 transition-all active:scale-[0.98]"
            >
              <ScanSearch className="size-5" />
              <span>Check a Forward</span>
            </Link>

            <Link
              href="/whatsapp-demo"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/20 px-6 py-3.5 text-base font-semibold text-emerald-300 hover:bg-emerald-950/40 hover:border-emerald-500/60 transition-all active:scale-[0.98]"
            >
              <MessageSquare className="size-5 text-emerald-400" />
              <span>Try on WhatsApp</span>
            </Link>
          </div>

          {/* Modality Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
            {modalities.map((m) => {
              const Icon = m.icon
              return (
                <div
                  key={m.label}
                  className="flex items-center gap-2 rounded-xl border border-border/70 bg-surface/80 px-3.5 py-2 text-xs font-medium text-foreground/90 backdrop-blur-sm"
                >
                  <Icon className="size-3.5 text-primary" />
                  <span>{m.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Interactive Demo Preview Section */}
        <div className="mt-16 md:mt-24">
          <DemoPreview />
        </div>

        {/* The 5 Calibrated Verdicts */}
        <div className="mt-20 md:mt-28">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Calibrated Adjudication System
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Real world claims are rarely purely true or false. We decompose nuance into 5 definitive verdicts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {VERDICT_ORDER.map((v) => {
              const meta = VERDICTS[v]
              return (
                <div
                  key={v}
                  className={cn(
                    'rounded-2xl border p-5 transition-all flex flex-col justify-between',
                    meta.border,
                    meta.bg
                  )}
                >
                  <div>
                    <span className="text-2xl">{meta.emoji}</span>
                    <h3 className={cn('mt-2 text-base font-bold tracking-tight', meta.text)}>
                      {meta.label[lang] || meta.label.en}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-foreground/80">
                      {meta.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/30 font-mono text-[10px] text-muted-foreground uppercase">
                    Status: Standard Grade
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pipeline Architecture Walkthrough */}
        <div className="mt-20 md:mt-28 rounded-3xl border border-border bg-surface/60 p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-border/60">
            <div>
              <span className="font-mono text-xs text-primary font-semibold uppercase tracking-wider">
                How It Works
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-foreground">
                6-Stage Privacy-First Multimodal Pipeline
              </h2>
            </div>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>Read Full Architecture Spec</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pipelineStages.map((stage, idx) => (
              <div
                key={stage.title}
                className="rounded-2xl border border-border/70 bg-surface-2/40 p-5 relative overflow-hidden"
              >
                <span className="font-mono text-3xl font-black text-white/5 absolute right-4 top-3">
                  0{idx + 1}
                </span>
                <span className="font-mono text-[11px] font-semibold text-primary block mb-1">
                  STAGE 0{idx + 1}
                </span>
                <h3 className="text-base font-semibold text-foreground">{stage.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trusted Source Registry Highlight */}
        <div className="mt-20 md:mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="font-mono text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                Authoritative Ground Truth
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-foreground">
                Trusted Source Registry
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We only match evidence against audited government portals, regulatory bodies, and IFCN signatories.
              </p>
            </div>
            <Link
              href="/sources"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>Explore All {TRUSTED_SOURCES.length} Registered Sources</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {TRUSTED_SOURCES.slice(0, 8).map((src) => (
              <div
                key={src.id}
                className="rounded-xl border border-border/70 bg-surface/80 p-4 transition-all hover:border-primary/40"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-foreground">{src.shortName}</span>
                  <span className="rounded bg-sky-950/80 px-1.5 py-0.5 font-mono text-[10px] text-sky-400 border border-sky-500/30">
                    {src.authorityScore}/100
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{src.name}</p>
                <span className="mt-2 inline-block font-mono text-[10px] text-slate-400">
                  {src.domain}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-20 md:mt-28 rounded-3xl border border-primary/30 bg-gradient-to-r from-blue-950/40 via-surface to-blue-950/40 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Got a forwarded message you doubt?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              Don’t circulate it blindly. Check it in 5 seconds with zero identity exposure.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/verify"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/30 hover:bg-blue-600 transition-all"
              >
                <ScanSearch className="size-5" />
                <span>Check a Forward Now</span>
              </Link>
              <Link
                href="/whatsapp-demo"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-6 py-3.5 text-base font-semibold text-foreground hover:bg-accent transition-all"
              >
                <MessageSquare className="size-5" />
                <span>Simulate WhatsApp Bot</span>
              </Link>
            </div>
          </div>
        </div>
      </PageShell>
    </div>
  )
}
