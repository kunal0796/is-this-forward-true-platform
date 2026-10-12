'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Search,
  Sparkles,
  ArrowLeft,
  Share2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Info,
  RotateCcw,
} from 'lucide-react'
import { DEMO_SCENARIOS, type DemoScenario } from '@/lib/verification/demo/scenarios'
import { VERDICTS } from '@/lib/verification/verdicts'
import { VerdictBadge } from '@/components/verdict/verdict-badge'
import { cn } from '@/lib/utils'

export function WhatsAppSimulator() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('laptop')
  const [chatStage, setChatStage] = useState<'idle' | 'checking' | 'answered'>('answered')
  const [activeModal, setActiveModal] = useState<'why' | 'evidence' | null>(null)

  const scenario: DemoScenario = DEMO_SCENARIOS.find((s) => s.key === selectedScenarioKey) || DEMO_SCENARIOS[0]
  const verdictMeta = VERDICTS[scenario.verdict]

  // When changing scenario, trigger simulated typing effect
  const handleSelectScenario = (key: string) => {
    setSelectedScenarioKey(key)
    setChatStage('checking')
    setActiveModal(null)
    setTimeout(() => {
      setChatStage('answered')
    }, 1200)
  }

  return (
    <div className="flex flex-col items-center">
      {/* Quick Scenario Selector Pills */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-muted-foreground mr-1 font-mono uppercase tracking-wider">Test Forwards:</span>
        {DEMO_SCENARIOS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => handleSelectScenario(s.key)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-medium transition-all border',
              selectedScenarioKey === s.key
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-sm'
                : 'border-border/60 bg-surface-2 text-muted-foreground hover:text-foreground hover:border-slate-600'
            )}
          >
            {s.sampleLabel}
          </button>
        ))}
      </div>

      {/* Realistic Smartphone Frame */}
      <div className="relative w-full max-w-[390px] rounded-[44px] border-[6px] border-slate-800 bg-[#0c1317] p-3 shadow-2xl ring-1 ring-white/10">
        {/* Dynamic Island / Speaker notch */}
        <div className="absolute left-1/2 top-4 -translate-x-1/2 h-4 w-28 rounded-full bg-slate-900 flex items-center justify-center">
          <div className="size-2 rounded-full bg-slate-800 mr-2" />
          <div className="h-1.5 w-10 rounded-full bg-slate-800" />
        </div>

        {/* Inner Phone Screen */}
        <div className="relative flex flex-col h-[650px] rounded-[36px] overflow-hidden bg-[#0b141a] text-slate-100 select-none">
          {/* WhatsApp Header */}
          <div className="flex items-center justify-between bg-[#1f2c34] px-3.5 py-2.5 pt-8 text-white border-b border-[#2a3942]">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm shadow-md">
                ✓
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-white">Is This Forward True?</span>
                  <ShieldCheck className="size-3.5 text-emerald-400" />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Official Fact-Check Bot
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <Video className="size-4 opacity-75" />
              <Phone className="size-3.5 opacity-75" />
              <MoreVertical className="size-4 opacity-75" />
            </div>
          </div>

          {/* WhatsApp Wallpaper & Chat Feed */}
          <div
            className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(20, 30, 38, 0.4) 0%, rgba(11, 20, 26, 0.9) 100%)',
            }}
          >
            {/* Timestamp pill */}
            <div className="flex justify-center">
              <span className="rounded-md bg-[#182229] px-2.5 py-1 text-[10px] text-slate-400 shadow-sm uppercase tracking-wider">
                Today
              </span>
            </div>

            {/* End-to-end encryption note */}
            <div className="rounded-lg bg-[#182229]/80 p-2 text-center text-[10px] text-[#8696a0] leading-snug border border-[#222e35]">
              🔒 Messages are protected by zero-knowledge PII scrubbing before any verification.
            </div>

            {/* User message (Forwarded bubble on right) */}
            <div className="flex justify-end">
              <div className="relative max-w-[85%] rounded-2xl rounded-tr-none bg-[#005c4b] p-3 text-white shadow">
                {/* Forwarded label */}
                <div className="flex items-center gap-1 text-[10px] italic text-emerald-200/80 mb-1">
                  <span>↗ Forwarded</span>
                </div>
                <p className="text-[12px] leading-relaxed break-words font-sans">
                  {scenario.sampleText}
                </p>
                <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-emerald-200/70">
                  <span>10:42 AM</span>
                  <CheckCheck className="size-3.5 text-[#53bdeb]" />
                </div>
              </div>
            </div>

            {/* Bot response */}
            {chatStage === 'checking' && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-none bg-[#202c33] p-3 text-slate-200 shadow flex items-center gap-2">
                  <Search className="size-3.5 text-emerald-400 animate-spin" />
                  <span className="text-[12px] font-medium text-emerald-400">
                    🔍 Checking your forward against trusted sources...
                  </span>
                </div>
              </div>
            )}

            {chatStage === 'answered' && (
              <div className="flex justify-start">
                <div className="w-[92%] rounded-2xl rounded-tl-none bg-[#202c33] p-3 text-slate-200 shadow border border-[#2a3942]/60">
                  {/* Verdict Badge */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2a3942]">
                    <span className="text-base font-bold flex items-center gap-1.5">
                      <span>{verdictMeta.emoji}</span>
                      <span className={verdictMeta.text}>{verdictMeta.label.en.toUpperCase()}</span>
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 bg-[#111b21] px-1.5 py-0.5 rounded">
                      Confidence: {scenario.confidence}%
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-[12px] leading-relaxed text-slate-100 font-sans mb-3">
                    “{scenario.summary.en}”
                  </p>

                  {/* Claims quick recap */}
                  <div className="mb-3 space-y-1 bg-[#111b21]/70 p-2 rounded-lg border border-[#2a3942]/40 text-[11px]">
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold block uppercase">
                      Claim Decomposition:
                    </span>
                    {scenario.claims.slice(0, 2).map((c, i) => (
                      <div key={c.id} className="flex items-start gap-1.5 text-slate-300">
                        <span>•</span>
                        <span>{c.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Action Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveModal('why')}
                      className="rounded-lg bg-[#2a3942] hover:bg-[#32444f] px-2.5 py-2 text-center text-[11px] font-medium text-white transition-colors"
                    >
                      Why?
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveModal('evidence')}
                      className="rounded-lg bg-[#2a3942] hover:bg-[#32444f] px-2.5 py-2 text-center text-[11px] font-medium text-white transition-colors"
                    >
                      View Evidence
                    </button>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#2a3942]/60 flex items-center justify-between text-[10px] text-slate-400">
                    <button
                      type="button"
                      onClick={() => {
                        const next = DEMO_SCENARIOS[(DEMO_SCENARIOS.findIndex(s => s.key === selectedScenarioKey) + 1) % DEMO_SCENARIOS.length].key
                        handleSelectScenario(next)
                      }}
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <RotateCcw className="size-3" />
                      Check Another
                    </button>
                    <Link
                      href={`/result/demo-text-${scenario.key}-001`}
                      className="text-sky-400 hover:underline flex items-center gap-0.5"
                    >
                      Full Web Report →
                    </Link>
                  </div>

                  <div className="mt-1 flex items-center justify-end text-[9px] text-[#8696a0]">
                    <span>10:42 AM</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Overlay inside phone frame when user clicks "Why?" or "View Evidence" */}
          {activeModal && (
            <div className="absolute inset-x-0 bottom-0 top-16 bg-[#111b21]/95 backdrop-blur-md p-4 text-xs z-20 flex flex-col border-t border-[#2a3942] animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-[#2a3942] mb-3">
                <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                  <Info className="size-3.5 text-emerald-400" />
                  {activeModal === 'why' ? 'Verification Rationale' : 'Authoritative Evidence Sources'}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded px-2 py-0.5 text-xs text-slate-400 hover:text-white bg-[#202c33]"
                >
                  ✕ Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-[11px]">
                {activeModal === 'why' ? (
                  scenario.steps.map((st) => (
                    <div key={st.key} className="bg-[#202c33] p-2.5 rounded-lg border border-[#2a3942]/50">
                      <span className="font-bold text-emerald-400 block">{st.title}</span>
                      <span className="text-slate-300 mt-0.5 block leading-relaxed">{st.detail}</span>
                    </div>
                  ))
                ) : (
                  scenario.evidence.map((ev) => (
                    <div key={ev.id} className="bg-[#202c33] p-2.5 rounded-lg border border-[#2a3942]/50">
                      <div className="flex items-center justify-between text-[10px] text-emerald-400 mb-1">
                        <span className="font-bold">{ev.sourceName}</span>
                        <span className="font-mono text-slate-400">Auth: {ev.authority}/100</span>
                      </div>
                      <p className="font-medium text-white mb-1">{ev.title}</p>
                      <p className="text-slate-300 italic text-[10px]">“{ev.snippet}”</p>
                    </div>
                  ))
                )}
              </div>

              <Link
                href={`/result/demo-text-${scenario.key}-001`}
                className="mt-3 block w-full rounded-lg bg-emerald-600 py-2 text-center text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
              >
                Open Full Research Dossier
              </Link>
            </div>
          )}

          {/* WhatsApp Input Bar */}
          <div className="flex items-center gap-2 bg-[#202c33] px-3 py-2 text-slate-400 border-t border-[#2a3942]/60">
            <div className="flex-1 rounded-full bg-[#2a3942] px-3.5 py-1.5 text-xs text-slate-400 flex items-center justify-between">
              <span>Paste suspicious message...</span>
              <Share2 className="size-3.5 text-slate-400" />
            </div>
            <div className="flex size-8 items-center justify-center rounded-full bg-emerald-600 text-white">
              <span className="text-xs">➤</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
