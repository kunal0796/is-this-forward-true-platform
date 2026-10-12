import type { PiiEntity, PiiType, PrivacyScan } from './types'

interface Detector {
  type: PiiType
  pattern: RegExp
  group?: number
}

// Order matters: more specific patterns run first so overlapping spans resolve predictably.
const DETECTORS: Detector[] = [
  { type: 'EMAIL', pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+\b/g },
  { type: 'UPI', pattern: /\b[A-Za-z0-9._-]{2,}@(?:ok[a-z]+|ybl|ibl|axl|paytm|upi|apl|icici|sbi|hdfcbank)\b/gi },
  { type: 'CARD', pattern: /\b(?:\d{4}[\s-]?){3}\d{4}\b/g },
  { type: 'AADHAAR', pattern: /\b[2-9]\d{3}[\s-]?\d{4}[\s-]?\d{4}\b/g },
  { type: 'PAN', pattern: /\b[A-Z]{5}\d{4}[A-Z]\b/g },
  { type: 'PHONE', pattern: /(?:\+91[\s-]?)?\b[6-9]\d{4}[\s-]?\d{5}\b/g },
  {
    type: 'NAME',
    pattern:
      /\b(?:Hi|Hello|Hey|Dear|Namaste|Mr\.?|Mrs\.?|Ms\.?|Dr\.?|[Mm]y name is|[Tt]his is|[Cc]all|[Cc]ontact)\s+([A-Z][a-z]{2,}(?:\s[A-Z][a-z]{2,})?)/g,
    group: 1,
  },
]

const NAME_STOPWORDS = new Set([
  'All', 'Everyone', 'Friends', 'Sir', 'Madam', 'Team', 'Me', 'Us', 'The', 'This', 'Please',
  'Government', 'India', 'Urgent', 'Share', 'Forward', 'Now', 'Today',
])

export function detectPii(text: string): PiiEntity[] {
  const found: PiiEntity[] = []

  for (const detector of DETECTORS) {
    detector.pattern.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = detector.pattern.exec(text)) !== null) {
      const value = detector.group ? match[detector.group] : match[0]
      if (!value) continue
      if (detector.type === 'NAME' && NAME_STOPWORDS.has(value.split(' ')[0])) continue
      const start = detector.group ? match.index + match[0].lastIndexOf(value) : match.index
      const end = start + value.length
      const overlaps = found.some((e) => start < e.end && end > e.start)
      if (!overlaps) found.push({ type: detector.type, start, end, replacement: `[${detector.type}]` })
    }
  }

  return found.sort((a, b) => a.start - b.start)
}

export function redact(text: string, entities: PiiEntity[]): string {
  let out = ''
  let cursor = 0
  for (const e of entities) {
    out += text.slice(cursor, e.start) + e.replacement
    cursor = e.end
  }
  return out + text.slice(cursor)
}

export function scanPrivacy(text: string, opts: { hadRawMedia?: boolean } = {}): PrivacyScan {
  const entities = detectPii(text)
  const counts: Partial<Record<PiiType, number>> = {}
  for (const e of entities) counts[e.type] = (counts[e.type] ?? 0) + 1
  return {
    entities,
    redactedText: redact(text, entities),
    counts,
    totalProtected: entities.length,
    rawMediaDeleted: Boolean(opts.hadRawMedia),
    retention: opts.hadRawMedia
      ? 'Raw media discarded after extraction. Only redacted text and the verdict are kept.'
      : 'Only redacted text and the verdict are kept.',
  }
}

export const PII_LABEL: Record<PiiType, string> = {
  NAME: 'Person name',
  PHONE: 'Phone number',
  EMAIL: 'Email address',
  AADHAAR: 'Aadhaar number',
  PAN: 'PAN',
  UPI: 'UPI ID',
  CARD: 'Card number',
}
