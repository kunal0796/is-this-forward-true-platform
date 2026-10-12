'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  PieChart,
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  History,
  ShieldQuestionMark,
  TrendingUp,
  FileText,
  Image as ImageIcon,
  Mic,
  FileCheck,
  Link2,
  Filter,
  ArrowRight,
  ExternalLink,
  Flame,
  Globe,
  Clock,
  Layers,
} from 'lucide-react'
import { PageShell, DemoBadge, Meter } from '@/components/kit/primitives'
import { VerdictBadge } from '@/components/verdict/verdict-badge'
import { VERDICTS, VERDICT_ORDER } from '@/lib/verification/verdicts'
import { DEMO_SCENARIOS } from '@/lib/verification/demo/scenarios'
import type { Verdict, MisinformationCategory } from '@/lib/verification/types'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // Real aggregate demo stats
  const stats = {
    totalChecked: 148290,
    verified: 35590, // 24%
    falseClaims: 62280, // 42%
    partlySupported: 26690, // 18%
    outdated: 13350, // 9%
    cannotConfirm: 10380, // 7%
    privacyProtectedEntities: 394200,
    avgProcessingSec: 2.4,
  }

  const inputTypes = [
    { label: 'WhatsApp Text', count: '71,180 (48%)', pct: 48, icon: FileText, color: 'bg-primary' },
    { label: 'Screenshots / OCR', count: '45,970 (31%)', pct: 31, icon: ImageIcon, color: 'bg-sky-400' },
    { label: 'Voice Notes', count: '17,790 (12%)', pct: 12, icon: Mic, color: 'bg-emerald-400' },
    { label: 'Official PDFs', count: '7,410 (5%)', pct: 5, icon: FileCheck, color: 'bg-amber-400' },
    { label: 'URLs & Links', count: '5,940 (4%)', pct: 4, icon: Link2, color: 'bg-purple-400' },
  ]

  const languages = [
    { label: 'Hindi (हिंदी)', count: '44%', pct: 44, color: 'bg-orange-400' },
    { label: 'English', count: '32%', pct: 32, color: 'bg-primary' },
    { label: 'Marathi (मराठी)', count: '14%', pct: 14, color: 'bg-emerald-400' },
    { label: 'Bengali (বাংলা)', count: '6%', pct: 6, color: 'bg-yellow-400' },
    { label: 'Tamil & Telugu', count: '4%', pct: 4, color: 'bg-indigo-400' },
  ]

  const categories = [
    { name: 'Government schemes', count: 52140, pct: 35, trend: '+14% this month' },
    { name: 'Health & wellness', count: 37070, pct: 25, trend: '-3% this month' },
    { name: 'Finance & banking', count: 26690, pct: 18, trend: '+8% this month' },
    { name: 'Technology scams', count: 20760, pct: 14, trend: '+22% this month' },
    { name: 'Civic & safety', count: 11630, pct: 8, trend: 'Stable' },
  ]

  // Recent verified queries feed
  const recentAlerts = [
    {
      id: 'demo-text-laptop-001',
      title: 'PM Free Laptop Yojana 2026 registration link for college students',
      category: 'Government schemes',
      verdict: 'PARTLY_SUPPORTED' as Verdict,
      confidence: 86,
      time: '12 mins ago',
      inputType: 'Text Forward',
    },
    {
      id: 'demo-text-note2000-001',
      title: 'RBI ₹2000 notes invalid after September, will become scrap paper',
      category: 'Finance & banking',
      verdict: 'OUTDATED' as Verdict,
      confidence: 94,
      time: '34 mins ago',
      inputType: 'Voice Note (Marathi)',
    },
    {
      id: 'demo-text-hotwater-001',
      title: 'Drinking hot boiled water at 60°C cures coronavirus and flu infections',
      category: 'Health & wellness',
      verdict: 'FALSE' as Verdict,
      confidence: 96,
      time: '1 hour ago',
      inputType: 'Screenshot OCR',
    },
    {
      id: 'demo-text-ticks-001',
      title: 'WhatsApp rolling out 3 blue ticks to allow government message recording',
      category: 'Technology scams',
      verdict: 'FALSE' as Verdict,
      confidence: 99,
      time: '2 hours ago',
      inputType: 'Text Forward',
    },
    {
      id: 'demo-text-chandrayaan-001',
      title: 'Chandrayaan-3 successfully touched down on lunar south pole',
      category: 'Civic & safety',
      verdict: 'VERIFIED' as Verdict,
      confidence: 98,
      time: '3 hours ago',
      inputType: 'Official PDF',
    },
  ]

  const filteredAlerts = selectedCategory === 'All'
    ? recentAlerts
    : recentAlerts.filter((a) => a.category.toLowerCase().includes(selectedCategory.toLowerCase()))

  return (
    <div className="relative pb-24 pt-8 md:pt-12">
      <PageShell>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-border/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DemoBadge />
              <span className="font-mono text-xs text-muted-foreground">• Live Platform Telemetry</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Misinformation Intelligence Dashboard
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Aggregated statistics, viral forward distributions, and real-time verification trends across India.
            </p>
          </div>

          <Link
            href="/verify"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition-colors shrink-0"
          >
            <span>Verify a Forward</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
          <div className="col-span-2 sm:col-span-1 lg:col-span-1 rounded-2xl border border-border bg-surface p-4 flex flex-col justify-between">
            <span className="font-mono text-[10px] text-muted-foreground uppercase">Total Checked</span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-foreground mt-2">
              148.2k
            </span>
            <span className="text-[10px] text-emerald-400 mt-2 font-medium">↑ +18% this week</span>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-4 flex flex-col justify-between">
            <span className="font-mono text-[10px] text-emerald-400 uppercase">🟢 Verified</span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2">
              24%
            </span>
            <span className="text-[10px] text-muted-foreground mt-2">35,590 forwards</span>
          </div>

          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-4 flex flex-col justify-between">
            <span className="font-mono text-[10px] text-rose-400 uppercase">🔴 False</span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-rose-400 mt-2">
              42%
            </span>
            <span className="text-[10px] text-muted-foreground mt-2">62,280 forwards</span>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-4 flex flex-col justify-between">
            <span className="font-mono text-[10px] text-amber-400 uppercase">🟡 Partly True</span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-400 mt-2">
              18%
            </span>
            <span className="text-[10px] text-muted-foreground mt-2">26,690 forwards</span>
          </div>

          <div className="rounded-2xl border border-orange-500/30 bg-orange-950/10 p-4 flex flex-col justify-between">
            <span className="font-mono text-[10px] text-orange-400 uppercase">🟠 Outdated</span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-orange-400 mt-2">
              9%
            </span>
            <span className="text-[10px] text-muted-foreground mt-2">13,350 forwards</span>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-4 flex flex-col justify-between">
            <span className="font-mono text-[10px] text-slate-300 uppercase">⚪ Unconfirmed</span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-300 mt-2">
              7%
            </span>
            <span className="text-[10px] text-muted-foreground mt-2">10,380 forwards</span>
          </div>
        </div>

        {/* MIDDLE SECTION: DISTRIBUTION CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* Verdict Distribution Bar Breakdown */}
          <div className="lg:col-span-7 rounded-3xl border border-border bg-surface p-6 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/50">
              <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="size-5 text-primary" />
                Verdict Distribution Breakdown
              </h3>
              <span className="text-xs text-muted-foreground font-mono">148,290 samples</span>
            </div>

            {/* Visual stacked percentage bar */}
            <div className="h-6 w-full rounded-xl overflow-hidden flex shadow-inner mb-6">
              <div style={{ width: '24%' }} className="bg-emerald-500" title="Verified: 24%" />
              <div style={{ width: '42%' }} className="bg-rose-500" title="False: 42%" />
              <div style={{ width: '18%' }} className="bg-amber-500" title="Partly Supported: 18%" />
              <div style={{ width: '9%' }} className="bg-orange-500" title="Outdated: 9%" />
              <div style={{ width: '7%' }} className="bg-slate-500" title="Cannot Confirm: 7%" />
            </div>

            {/* Individual detailed meters */}
            <div className="space-y-3.5">
              {[
                { label: '🟢 Verified', pct: 24, count: '35,590', color: 'bg-emerald-400' },
                { label: '🔴 False (Debunked)', pct: 42, count: '62,280', color: 'bg-rose-400' },
                { label: '🟡 Partly Supported (Exaggerated)', pct: 18, count: '26,690', color: 'bg-amber-400' },
                { label: '🟠 Outdated (Expired notices)', pct: 9, count: '13,350', color: 'bg-orange-400' },
                { label: '⚪ Cannot Confirm (Unverifiable)', pct: 7, count: '10,380', color: 'bg-slate-400' },
              ].map((item) => (
                <div key={item.label} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-foreground/90">{item.label}</span>
                    <span className="font-mono text-muted-foreground">
                      <strong className="text-foreground">{item.pct}%</strong> ({item.count})
                    </span>
                  </div>
                  <Meter value={item.pct} color={item.color} label={item.label} />
                </div>
              ))}
            </div>
          </div>

          {/* Input Types Breakdown */}
          <div className="lg:col-span-5 rounded-3xl border border-border bg-surface p-6 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/50">
              <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <Layers className="size-5 text-sky-400" />
                Multimodal Input Modalities
              </h3>
              <span className="text-xs text-muted-foreground font-mono">5 Media Formats</span>
            </div>

            <div className="space-y-4 mt-2">
              {inputTypes.map((input) => {
                const Icon = input.icon
                return (
                  <div key={input.label} className="text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-medium text-foreground flex items-center gap-1.5">
                        <Icon className="size-3.5 text-primary" />
                        {input.label}
                      </span>
                      <span className="font-mono text-muted-foreground">{input.count}</span>
                    </div>
                    <Meter value={input.pct} color={input.color} label={input.label} />
                  </div>
                )
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-border/40 text-[11px] text-muted-foreground leading-relaxed">
              💡 <strong>Insight:</strong> WhatsApp screenshots and text forwards account for 79% of all viral misinformation in family groups.
            </div>
          </div>
        </div>

        {/* ROW 3: LANGUAGES & MISINFORMATION CATEGORIES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* Languages */}
          <div className="lg:col-span-5 rounded-3xl border border-border bg-surface p-6 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/50">
              <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <Globe className="size-5 text-emerald-400" />
                Language Distribution
              </h3>
              <span className="text-xs text-muted-foreground font-mono">Indic Scripts</span>
            </div>

            <div className="space-y-4">
              {languages.map((l) => (
                <div key={l.label} className="text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-medium text-foreground">{l.label}</span>
                    <span className="font-mono text-foreground font-bold">{l.count}</span>
                  </div>
                  <Meter value={l.pct} color={l.color} label={l.label} />
                </div>
              ))}
            </div>
          </div>

          {/* Misinformation Categories */}
          <div className="lg:col-span-7 rounded-3xl border border-border bg-surface p-6 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/50">
              <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <Flame className="size-5 text-amber-400" />
                Top Misinformation Domains
              </h3>
              <span className="text-xs text-muted-foreground font-mono">By Frequency</span>
            </div>

            <div className="space-y-3.5">
              {categories.map((c) => (
                <div key={c.name} className="flex items-center justify-between p-3 rounded-xl bg-surface-2/50 border border-border/40 text-xs">
                  <div>
                    <span className="font-semibold text-foreground text-sm block">{c.name}</span>
                    <span className="text-muted-foreground text-[11px]">{c.count.toLocaleString()} cases checked</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-primary text-sm block">{c.pct}%</span>
                    <span className={cn('text-[10px] font-mono', c.trend.includes('+') ? 'text-rose-400' : 'text-emerald-400')}>
                      {c.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 4: RECENT VERIFIED FORWARDS FEED */}
        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-border/50">
            <div>
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Clock className="size-5 text-primary" />
                Recent Verified Viral Forwards
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Browse recently adjudicated forwards and their authoritative conclusions.
              </p>
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {['All', 'Government', 'Finance', 'Health', 'Technology'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'rounded-lg px-3 py-1 text-xs font-medium transition-colors border',
                    selectedCategory === cat
                      ? 'border-primary bg-primary/20 text-primary'
                      : 'border-border/60 bg-surface-2 text-muted-foreground hover:text-foreground'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredAlerts.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/60 bg-surface-2/30 hover:bg-surface-2/70 hover:border-primary/40 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <VerdictBadge verdict={item.verdict} size="xs" />
                    <span className="rounded bg-surface px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      • {item.inputType}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="font-mono text-xs text-foreground font-bold">
                      {item.confidence}% Confidence
                    </span>
                    <span className="block text-[10px] text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                  <Link
                    href={`/result/${item.id}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-surface px-3 py-1.5 text-xs font-semibold text-foreground border border-border/80 hover:bg-primary hover:text-white transition-colors"
                  >
                    <span>View Report</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageShell>
    </div>
  )
}
