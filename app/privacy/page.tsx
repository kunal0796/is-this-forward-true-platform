'use client'

import {
  Shield,
  ShieldCheck,
  Lock,
  Trash2,
  EyeOff,
  ServerOff,
  KeyRound,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { PageShell, DemoBadge } from '@/components/kit/primitives'
import { PrivacyScrubber } from '@/components/privacy/privacy-scrubber'

export default function PrivacyPage() {
  const guarantees = [
    {
      title: 'Zero Identity Logging',
      desc: 'We never log sender phone numbers, IP addresses, WhatsApp chat metadata, or device IDs.',
      icon: EyeOff,
    },
    {
      title: 'Immediate Raw Media Flushed',
      desc: 'Uploaded screenshots, voice notes, and PDFs are processed in volatile RAM and purged immediately after text token extraction.',
      icon: Trash2,
    },
    {
      title: 'Client-Side Heuristic Redaction',
      desc: '10-digit Indian mobile numbers (+91), email addresses, Aadhaar numbers, and PAN cards are stripped before evidence retrieval.',
      icon: KeyRound,
    },
    {
      title: 'DPDP Act & GDPR Aligned',
      desc: 'Compliant with the Digital Personal Data Protection Act 2023 (India) and international privacy frameworks.',
      icon: FileCheck2,
    },
  ]

  return (
    <div className="relative pb-24 pt-8 md:pt-12">
      <PageShell>
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-2">
            <DemoBadge />
            <span className="font-mono text-xs text-muted-foreground">• Privacy Architecture & Data Policy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Privacy-First Verification
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            WhatsApp forwards often contain personal phone numbers, private names, or sensitive contacts.
            Our platform guarantees that zero private data ever touches external LLMs or persistent storage.
          </p>
        </div>

        {/* Interactive PII Scrubber Sandbox & Visualization */}
        <div className="mb-16">
          <PrivacyScrubber />
        </div>

        {/* Core Architectural Guarantees Grid */}
        <div className="mt-16 sm:mt-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Cryptographic Safeguards
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Zero-Knowledge Architecture Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guarantees.map((g) => {
              const Icon = g.icon
              return (
                <div
                  key={g.title}
                  className="rounded-2xl border border-border/80 bg-surface/70 p-6 flex items-start gap-4"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{g.title}</h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {g.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Detailed Lifecycle Q&A */}
        <div className="mt-16 sm:mt-20 rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
            Frequently Asked Privacy Questions
          </h3>

          <div className="space-y-6 text-sm divide-y divide-border/60">
            <div className="pt-4 first:pt-0">
              <h4 className="font-semibold text-foreground text-base mb-1">
                Does the AI read my family group name or contact details?
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                No. When you paste or upload text, the client-side regex engine replaces all names, phone numbers, and emails with masked tokens like <code>[NAME]</code> and <code>[PHONE]</code>. The AI model only receives the semantic claim (e.g. &ldquo;Is the laptop scheme real?&rdquo;), never who sent it.
              </p>
            </div>

            <div className="pt-4">
              <h4 className="font-semibold text-foreground text-base mb-1">
                What happens to screenshots and audio recordings after scanning?
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Raw images and audio streams are never saved to disk or Amazon S3 buckets. OCR and Whisper transcription happen in ephemeral memory; as soon as plain text tokens are extracted, the media buffer is permanently released and garbage collected.
              </p>
            </div>

            <div className="pt-4">
              <h4 className="font-semibold text-foreground text-base mb-1">
                How do you protect Aadhaar, PAN, and UPI information?
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Scams in India frequently circulate fake lottery forms asking for 12-digit Aadhaar numbers or 10-character PAN identifiers. Our regex suite matches Indian statutory identifier patterns and masks them into <code>[AADHAAR]</code> and <code>[PAN]</code> prior to search.
              </p>
            </div>
          </div>
        </div>
      </PageShell>
    </div>
  )
}
