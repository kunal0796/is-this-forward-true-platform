import { History, ShieldAlert, ShieldCheck, ShieldQuestionMark, ShieldX, type LucideIcon } from 'lucide-react'
import { VERDICTS } from '@/lib/verification/verdicts'
import type { Language, Verdict } from '@/lib/verification/types'
import { cn } from '@/lib/utils'

export const VERDICT_ICON: Record<Verdict, LucideIcon> = {
  VERIFIED: ShieldCheck,
  FALSE: ShieldX,
  PARTLY_SUPPORTED: ShieldAlert,
  OUTDATED: History,
  CANNOT_CONFIRM: ShieldQuestionMark,
}

export function VerdictBadge({
  verdict,
  lang = 'en',
  size = 'sm',
  className,
}: {
  verdict: Verdict
  lang?: Language
  size?: 'xs' | 'sm' | 'md'
  className?: string
}) {
  const meta = VERDICTS[verdict]
  const Icon = VERDICT_ICON[verdict]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border font-semibold uppercase',
        meta.bg,
        meta.border,
        meta.text,
        size === 'xs' && 'px-1.5 py-0.5 text-[10px] tracking-[0.08em]',
        size === 'sm' && 'px-2 py-1 text-[11px] tracking-[0.1em]',
        size === 'md' && 'px-3 py-1.5 text-xs tracking-[0.12em]',
        className,
      )}
    >
      <Icon className={size === 'md' ? 'size-4' : 'size-3.5'} aria-hidden="true" />
      {meta.label[lang]}
    </span>
  )
}

export function VerdictDot({ verdict, className }: { verdict: Verdict; className?: string }) {
  return <span aria-hidden="true" className={cn('inline-block size-2 shrink-0 rounded-full', VERDICTS[verdict].dot, className)} />
}
