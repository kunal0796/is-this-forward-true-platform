import Link from 'next/link'
import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative grid size-8 place-items-center rounded-lg border border-primary/40 bg-primary/10 font-mono text-sm font-bold text-primary',
        className,
      )}
    >
      ?
      <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-verified ring-2 ring-background" />
    </span>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2.5 rounded-md', className)} aria-label="Is This Forward True? Home">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-tight text-foreground">Is This Forward True?</span>
        <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Verify · Explain · Protect</span>
      </span>
    </Link>
  )
}
