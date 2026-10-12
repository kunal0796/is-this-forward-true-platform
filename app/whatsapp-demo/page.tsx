'use client'

import Link from 'next/link'
import {
  MessageSquare,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Smartphone,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import { PageShell, DemoBadge } from '@/components/kit/primitives'
import { WhatsAppSimulator } from '@/components/whatsapp/whatsapp-simulator'

export default function WhatsAppDemoPage() {
  return (
    <div className="relative pb-24 pt-8 md:pt-12">
      <PageShell>
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 mb-2">
            <DemoBadge />
            <span className="font-mono text-xs text-muted-foreground">• WhatsApp Bot Simulator</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            WhatsApp Bot Experience
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Experience how millions of everyday users verify viral forwards directly inside WhatsApp.
            Simply forward any dubious message, audio note, or screenshot to our verified bot number.
          </p>
        </div>

        {/* Two Column Layout: Simulator on Left / Center, Instructions & QR on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Smartphone Simulator */}
          <div className="lg:col-span-7 flex justify-center">
            <WhatsAppSimulator />
          </div>

          {/* Right Column: Bot Guide & Integration Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick How to use Card */}
            <div className="rounded-3xl border border-border bg-surface p-6 sm:p-7 shadow-xl">
              <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold text-base">
                <MessageSquare className="size-5" />
                <span>How to use the WhatsApp Bot</span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
                    1
                  </span>
                  <div>
                    <strong className="text-foreground block">Forward any message</strong>
                    <span className="text-muted-foreground">
                      Forward text, voice notes, PDFs, or photos directly to +91 98200 12345.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
                    2
                  </span>
                  <div>
                    <strong className="text-foreground block">Instant Zero-Knowledge Scan</strong>
                    <span className="text-muted-foreground">
                      Our gateway strips your phone number and contact names in real time.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
                    3
                  </span>
                  <div>
                    <strong className="text-foreground block">Get a Shareable Fact Card</strong>
                    <span className="text-muted-foreground">
                      Receive a clear verdict (🟢 🔴 🟡 🟠 ⚪) with tap-to-verify sources to post back into your group!
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated QR Code Card */}
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/10 p-6 sm:p-7 text-center">
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-bold block mb-2">
                Simulated WhatsApp Business API
              </span>
              <h3 className="text-base font-bold text-foreground mb-3">
                Scan to Save Bot Contact
              </h3>

              {/* Mock QR graphic */}
              <div className="mx-auto my-3 flex size-40 items-center justify-center rounded-2xl bg-white p-3 shadow-lg">
                <div className="size-full bg-[#111] rounded-xl flex flex-col items-center justify-center p-2 text-[10px] text-white font-mono text-center">
                  <QrCode className="size-20 text-white" />
                  <span className="mt-1 text-[8px] text-slate-300">DEMO BOT QR</span>
                </div>
              </div>

              <p className="font-mono text-xs text-foreground/80 font-medium">
                +91 98200 12345 • @IsThisForwardTrue
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                In this demo mode, you can test all scenarios using the phone simulator on the left.
              </p>
            </div>

            {/* Web Verification Alternative */}
            <div className="rounded-2xl border border-border bg-surface-2/40 p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-foreground font-semibold block">Prefer web verification?</span>
                <span className="text-[11px] text-muted-foreground">Upload files directly from desktop or tablet</span>
              </div>
              <Link
                href="/verify"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <span>Open Web App</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </PageShell>
    </div>
  )
}
