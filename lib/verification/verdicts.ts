import type { Language, Verdict } from './types'

export interface VerdictMeta {
  emoji: string
  label: Record<Language, string>
  short: string
  description: string
  text: string
  bg: string
  border: string
  dot: string
  ring: string
  hex: string
}

export const VERDICTS: Record<Verdict, VerdictMeta> = {
  VERIFIED: {
    emoji: '🟢',
    label: { en: 'Verified', hi: 'सत्यापित', mr: 'सत्यापित' },
    short: 'Verified',
    description: 'Consistent with authoritative, current sources.',
    text: 'text-verified',
    bg: 'bg-verified/10',
    border: 'border-verified/30',
    dot: 'bg-verified',
    ring: 'ring-verified/30',
    hex: '#22c55e',
  },
  FALSE: {
    emoji: '🔴',
    label: { en: 'False', hi: 'गलत', mr: 'खोटे' },
    short: 'False',
    description: 'Contradicted by authoritative sources.',
    text: 'text-false',
    bg: 'bg-false/10',
    border: 'border-false/30',
    dot: 'bg-false',
    ring: 'ring-false/30',
    hex: '#f04438',
  },
  PARTLY_SUPPORTED: {
    emoji: '🟡',
    label: { en: 'Partly supported', hi: 'आंशिक रूप से सही', mr: 'अंशतः समर्थित' },
    short: 'Partly',
    description: 'Some parts hold up, others are exaggerated or unsupported.',
    text: 'text-partly',
    bg: 'bg-partly/10',
    border: 'border-partly/30',
    dot: 'bg-partly',
    ring: 'ring-partly/30',
    hex: '#f5b70a',
  },
  OUTDATED: {
    emoji: '🟠',
    label: { en: 'Outdated', hi: 'पुरानी जानकारी', mr: 'कालबाह्य' },
    short: 'Outdated',
    description: 'Was accurate once, but has been superseded.',
    text: 'text-outdated',
    bg: 'bg-outdated/10',
    border: 'border-outdated/30',
    dot: 'bg-outdated',
    ring: 'ring-outdated/30',
    hex: '#fb7a24',
  },
  CANNOT_CONFIRM: {
    emoji: '⚪',
    label: { en: 'Cannot be confirmed', hi: 'पुष्टि नहीं हो सकी', mr: 'पुष्टी करता आली नाही' },
    short: 'Unconfirmed',
    description: 'Not enough trustworthy evidence either way.',
    text: 'text-unconfirmed',
    bg: 'bg-unconfirmed/10',
    border: 'border-unconfirmed/30',
    dot: 'bg-unconfirmed',
    ring: 'ring-unconfirmed/30',
    hex: '#98a2b3',
  },
}

export const VERDICT_ORDER: Verdict[] = [
  'VERIFIED',
  'FALSE',
  'PARTLY_SUPPORTED',
  'OUTDATED',
  'CANNOT_CONFIRM',
]

export function confidenceLabel(confidence: number): string {
  if (confidence >= 85) return 'High confidence'
  if (confidence >= 65) return 'Moderate confidence'
  return 'Low confidence'
}
