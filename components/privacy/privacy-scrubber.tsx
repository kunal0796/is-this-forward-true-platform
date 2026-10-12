'use client'

import { useState } from 'react'
import { Shield, ShieldAlert, ShieldCheck, Copy, Check, Sparkles, RefreshCw, Lock, Trash2, ArrowRight } from 'lucide-react'
import { detectPii, redact } from '@/lib/verification/pii'
import type { PiiEntity, PiiType } from '@/lib/verification/types'
import { cn } from '@/lib/utils'

const PRESETS = [
  {
    name: 'Standard WhatsApp Forward',
    text: 'Hi Rahul, call me on 9876543210. Email: example@gmail.com. Check the link below before it expires!',
  },
  {
    name: 'Govt KYC Scheme Scam',
    text: 'Dear Amit, update your Aadhaar 2345 6789 0123 and PAN ABCDE1234F immediately at http://kyc-update-portal.com to avoid account freezing. Contact Officer Sharma on 9823456789.',
  },
  {
    name: 'UPI Cashback Lure',
    text: 'Hello Priya, send ₹1 to priya.kumar@oksbi to claim your ₹5,000 festive bonus! For issues contact support@cashback-rewards.in or call 8899001122.',
  },
]

export function PrivacyScrubber() {
  const [inputText, setInputText] = useState(PRESETS[0].text)
  const [copied, setCopied] = useState(false)

  const detectedEntities: PiiEntity[] = detectPii(inputText)
  const redactedText = redact(inputText, detectedEntities)

  const counts: Record<string, number> = {}
  for (const ent of detectedEntities) {
    counts[ent.type] = (counts[ent.type] || 0) + 1
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(redactedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Visual Pipeline Flow Header */}
      <div className="rounded-2xl border border-border/80 bg-surface/80 p-5 sm:p-7 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/50">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-400" />
              Zero-Knowledge Redaction Pipeline
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Personal identifiable information is stripped entirely on client before any vector search or AI adjudication.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-400 border border-emerald-500/30 w-fit">
            <Lock className="size-3" />
            DPDP Act & GDPR Aligned
          </span>
        </div>

        {/* 6 Step Flowchart */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
          {[
            { step: '1', title: 'USER CONTENT', desc: 'Forward received', color: 'border-slate-700 bg-slate-900/60 text-slate-300' },
            { step: '2', title: 'PII DETECTION', desc: 'Heuristic regex scan', color: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
            { step: '3', title: 'REDACTION', desc: 'Mask sensitive tokens', color: 'border-sky-500/30 bg-sky-500/10 text-sky-300' },
            { step: '4', title: 'AI PROCESSING', desc: 'Search with clean text', color: 'border-blue-500/30 bg-blue-500/10 text-blue-300' },
            { step: '5', title: 'RESULT', desc: 'Fact card generated', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' },
            { step: '6', title: 'RAW MEDIA DELETED', desc: 'Flushed from RAM', color: 'border-rose-500/30 bg-rose-500/10 text-rose-300' },
          ].map((item, idx) => (
            <div key={item.step} className={cn('relative rounded-xl border p-3 flex flex-col items-center justify-center', item.color)}>
              <span className="font-mono text-[10px] opacity-70 mb-1">STAGE 0{item.step}</span>
              <span className="font-bold text-[11px] sm:text-xs tracking-tight">{item.title}</span>
              <span className="text-[10px] opacity-80 mt-1">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Sandbox */}
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-7 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h4 className="text-sm sm:text-base font-semibold text-foreground">
              Live Interactive PII Scrubber Sandbox
            </h4>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1">Presets:</span>
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setInputText(p.text)}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors border',
                  inputText === p.text
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-border/60 bg-surface-2 text-muted-foreground hover:text-foreground hover:bg-surface-2/80'
                )}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Two column interactive scrubber */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
          {/* Left: Input Textarea */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span className="font-mono uppercase tracking-wider text-[11px]">Original Message (Editable)</span>
              <span>{inputText.length} chars</span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste any message here containing names, phone numbers, emails, Aadhaar, PAN, UPI, or cards..."
              rows={6}
              className="w-full rounded-xl border border-border/80 bg-black/40 p-3.5 text-sm font-sans text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed resize-none"
            />
          </div>

          {/* Right: Redacted Output */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span className="font-mono uppercase tracking-wider text-[11px] text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" />
                Sanitized Zero-Knowledge Output
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] text-foreground hover:text-primary transition-colors"
              >
                {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="min-h-[140px] flex-1 rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-3.5 text-sm font-mono text-emerald-200/90 leading-relaxed whitespace-pre-wrap break-words">
              {redactedText || <span className="text-muted-foreground italic">Type in the left box to test live redaction...</span>}
            </div>
          </div>
        </div>

        {/* Protection Summary Pill Box */}
        <div className="mt-5 pt-5 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
              {detectedEntities.length}
            </span>
            <span className="text-sm font-medium text-foreground">
              {detectedEntities.length === 1 ? '1 sensitive entity' : `${detectedEntities.length} sensitive entities`} protected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(counts).map(([type, count]) => (
              <span
                key={type}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-medium text-emerald-300"
              >
                <span>[{type}]</span>
                <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[10px] text-emerald-200">
                  {count}
                </span>
              </span>
            ))}
            {detectedEntities.length === 0 && (
              <span className="text-xs text-muted-foreground">No PII detected in current text</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
