import { cva, type VariantProps } from 'class-variance-authority'
import { FlaskConical } from 'lucide-react'
import { cn } from '@/lib/utils'

export const buttonClass = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-[0_0_0_1px_rgb(59_130_255/0.4),0_8px_24px_-8px_rgb(59_130_255/0.6)] hover:bg-[#5a96ff]',
        secondary: 'border border-border bg-surface-2 text-foreground hover:border-primary/40 hover:bg-accent',
        ghost: 'text-muted-foreground hover:bg-accent hover:text-foreground',
        outline: 'border border-input bg-transparent text-foreground hover:bg-accent',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
        icon: 'size-9',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export type ButtonVariantProps = VariantProps<typeof buttonClass>

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-2xl border border-border bg-surface', className)} {...props} />
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-primary', className)}>{children}</p>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  as: Tag = 'h2',
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
  as?: 'h1' | 'h2'
}) {
  return (
    <div className={cn('max-w-2xl', className)}>
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <Tag
        className={cn(
          'text-balance font-semibold tracking-tight text-foreground',
          Tag === 'h1' ? 'text-3xl md:text-5xl' : 'text-2xl md:text-4xl',
        )}
      >
        {title}
      </Tag>
      {description && <p className="mt-3 text-pretty leading-relaxed text-muted-foreground md:text-lg">{description}</p>}
    </div>
  )
}

export function DemoBadge({ className, label = 'DEMO VERIFICATION' }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-partly/40 bg-partly/10 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-partly',
        className,
      )}
    >
      <FlaskConical className="size-3" aria-hidden="true" />
      {label}
    </span>
  )
}

export function Meter({ value, className, color = 'bg-primary', label }: { value: number; className?: string; color?: string; label: string }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]', className)}
    >
      <div className={cn('h-full rounded-full transition-[width] duration-700', color)} style={{ width: `${v}%` }} />
    </div>
  )
}

export function PageShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 md:px-6', className)}>{children}</div>
}
