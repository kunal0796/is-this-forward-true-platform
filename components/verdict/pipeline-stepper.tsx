'use client'

import { motion } from 'motion/react'
import { Check, Loader2, Circle, ShieldCheck, Database, Search, GitCompare, FileCheck, Globe, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PipelineStep {
  id: string
  label: string
  subtext?: string
  icon: React.ComponentType<{ className?: string }>
  status: 'completed' | 'active' | 'pending'
}

interface PipelineStepperProps {
  currentStageIndex: number
  redactedPreview?: string
  protectedCount?: number
  detectedLang?: string
}

export function PipelineStepper({
  currentStageIndex,
  redactedPreview,
  protectedCount = 0,
  detectedLang = 'English',
}: PipelineStepperProps) {
  const steps: PipelineStep[] = [
    {
      id: 'received',
      label: 'Content received & normalized',
      subtext: 'Multimodal input parsed into clean semantic tokens',
      icon: FileCheck,
      status: currentStageIndex > 0 ? 'completed' : currentStageIndex === 0 ? 'active' : 'pending',
    },
    {
      id: 'language',
      label: `Language detected (${detectedLang})`,
      subtext: 'Auto-script identification & localized ontology mapping',
      icon: Globe,
      status: currentStageIndex > 1 ? 'completed' : currentStageIndex === 1 ? 'active' : 'pending',
    },
    {
      id: 'privacy',
      label: `Zero-Knowledge Privacy Scan (${protectedCount} entities scrubbed)`,
      subtext: 'Phone numbers, emails, names redacted on-device before inference',
      icon: ShieldCheck,
      status: currentStageIndex > 2 ? 'completed' : currentStageIndex === 2 ? 'active' : 'pending',
    },
    {
      id: 'claims',
      label: 'Atomic Claims Extracted',
      subtext: 'Decomposed forward into independent verifiable propositions',
      icon: Sparkles,
      status: currentStageIndex > 3 ? 'completed' : currentStageIndex === 3 ? 'active' : 'pending',
    },
    {
      id: 'retrieval',
      label: 'Searching Trusted Sources Registry',
      subtext: 'Querying PIB, RBI, WHO, Reuters, and IFCN fact-check database',
      icon: Search,
      status: currentStageIndex > 4 ? 'completed' : currentStageIndex === 4 ? 'active' : 'pending',
    },
    {
      id: 'comparison',
      label: 'Comparing & Weighting Evidence',
      subtext: 'Cross-referencing claims against source authority & temporal timestamps',
      icon: GitCompare,
      status: currentStageIndex > 5 ? 'completed' : currentStageIndex === 5 ? 'active' : 'pending',
    },
    {
      id: 'verdict',
      label: 'Generating Calibrated Verdict',
      subtext: 'Final adjudication with confidence rating and plain-language summary',
      icon: Database,
      status: currentStageIndex >= 6 ? 'completed' : 'pending',
    },
  ]

  return (
    <div className="rounded-2xl border border-border/80 bg-surface/90 p-5 sm:p-7 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            Real-time Verification Pipeline
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Stage {Math.min(currentStageIndex + 1, 7)} of 7 • Privacy-first zero retention protocol
          </p>
        </div>
        <span className="font-mono text-xs text-primary font-medium px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
          {Math.round(((currentStageIndex + 1) / 7) * 100)}% Complete
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {steps.map((step, idx) => {
          const Icon = step.icon
          const isDone = step.status === 'completed'
          const isActive = step.status === 'active'

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                'flex items-start gap-3.5 rounded-xl p-3 transition-colors',
                isActive && 'bg-primary/10 border border-primary/30',
                isDone && 'bg-surface-2/40',
                !isDone && !isActive && 'opacity-50'
              )}
            >
              {/* Status indicator icon */}
              <div
                className={cn(
                  'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border font-mono text-xs transition-colors',
                  isDone && 'border-emerald-500/40 bg-emerald-500/20 text-emerald-400',
                  isActive && 'border-primary/50 bg-primary/20 text-primary',
                  !isDone && !isActive && 'border-border/60 bg-surface-2 text-muted-foreground'
                )}
              >
                {isDone ? (
                  <Check className="size-4 stroke-[3]" />
                ) : isActive ? (
                  <Loader2 className="size-4 animate-spin text-primary" />
                ) : (
                  <span className="text-[11px] font-bold">{idx + 1}</span>
                )}
              </div>

              {/* Text detail */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      'text-sm font-medium leading-none',
                      isDone && 'text-foreground',
                      isActive && 'text-primary font-semibold',
                      !isDone && !isActive && 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </p>
                  {isActive && (
                    <span className="inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary">
                      Processing
                    </span>
                  )}
                </div>
                {step.subtext && (
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {step.subtext}
                  </p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {redactedPreview && currentStageIndex >= 2 && (
        <div className="mt-6 rounded-xl border border-sky-500/30 bg-sky-950/20 p-3.5 text-xs">
          <div className="flex items-center justify-between text-sky-400 font-medium mb-1.5 font-mono text-[11px] uppercase tracking-wide">
            <span>Client Redacted Payload</span>
            <span>Raw media flushed</span>
          </div>
          <p className="font-mono text-foreground/80 break-words leading-relaxed">
            {redactedPreview}
          </p>
        </div>
      )}
    </div>
  )
}
