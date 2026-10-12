'use client'

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { VERDICTS, confidenceLabel } from '@/lib/verification/verdicts'
import type { Verdict } from '@/lib/verification/types'

/** Semi-circular gauge with the confidence band segments (low / moderate / high) marked. */
export function ConfidenceGauge({ value, verdict, label = 'Confidence', size = 220 }: { value: number; verdict: Verdict; label?: string; size?: number }) {
  const reduce = useReducedMotion()
  const color = VERDICTS[verdict].hex
  const stroke = 14
  const r = (size - stroke) / 2
  const cx = size / 2
  const cy = size / 2
  const arcLength = Math.PI * r
  const progress = useMotionValue(reduce ? value : 0)
  const dash = useTransform(progress, (v) => `${(v / 100) * arcLength} ${arcLength}`)
  const display = useTransform(progress, (v) => `${Math.round(v)}`)

  useEffect(() => {
    if (reduce) {
      progress.set(value)
      return
    }
    const controls = animate(progress, value, { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.25 })
    return () => controls.stop()
  }, [value, reduce, progress])

  const arc = `M ${stroke / 2} ${cy} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${cy}`
  const tick = (pct: number) => {
    const angle = Math.PI * (1 - pct / 100)
    const inner = r - stroke
    const outer = r + stroke / 2 + 2
    return {
      x1: cx + inner * Math.cos(angle),
      y1: cy - inner * Math.sin(angle),
      x2: cx + outer * Math.cos(angle),
      y2: cy - outer * Math.sin(angle),
    }
  }

  return (
    <div className="relative flex flex-col items-center" role="meter" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-valuetext={`${value}% – ${confidenceLabel(value)}`}>
      <svg width={size} height={size / 2 + stroke} viewBox={`0 0 ${size} ${size / 2 + stroke}`} aria-hidden="true" className="max-w-full">
        <defs>
          <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={arc} fill="none" stroke="rgb(148 170 210 / 0.1)" strokeWidth={stroke} strokeLinecap="round" />
        <motion.path d={arc} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" style={{ strokeDasharray: dash }} filter="url(#gauge-glow)" />
        {[65, 85].map((p) => {
          const t = tick(p)
          return <line key={p} {...t} stroke="rgb(244 247 251 / 0.35)" strokeWidth={1.5} />
        })}
      </svg>
      <div className="absolute inset-x-0 bottom-1 flex flex-col items-center">
        <p className="font-mono text-5xl font-semibold tabular-nums tracking-tight text-foreground">
          <motion.span>{display}</motion.span>
          <span className="text-2xl text-muted-foreground">%</span>
        </p>
      </div>
    </div>
  )
}
