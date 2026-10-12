import { VERDICTS } from './verdicts'
import type { Language, VerificationResult } from './types'

export function formatWhatsAppReply(result: VerificationResult, lang: Language, baseUrl?: string): string {
  const meta = VERDICTS[result.verdict]
  const lines = [
    `${meta.emoji} *${meta.label[lang].toUpperCase()}*`,
    `Confidence: ${result.confidence}%`,
    '',
    result.summary[lang],
  ]
  const top = result.evidence.slice(0, 2)
  if (top.length) {
    lines.push('', '*Sources*')
    for (const e of top) lines.push(`• ${e.sourceName}: ${e.url}`)
  }
  if (baseUrl) lines.push('', `Full report: ${baseUrl}/result/${result.id}`)
  if (result.mode === 'demo') lines.push('', '_DEMO VERIFICATION: illustrative result, not a live check._')
  return lines.join('\n')
}
