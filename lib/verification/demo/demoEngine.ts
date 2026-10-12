import { scanPrivacy } from '../pii'
import { findSourceByHostname } from '../sources'
import { detectLanguage, hashString, shortHash } from '../text-utils'
import type {
  Claim,
  ExtractedMedia,
  InputType,
  ProviderTrace,
  SummaryStep,
  VerificationResult,
} from '../types'
import { DEMO_SCENARIOS, FALLBACK, MARATHI_SAMPLE, getScenario, matchScenario, type DemoScenario } from './scenarios'

export interface DemoInput {
  inputType: InputType
  text?: string
  fileName?: string
  fileSizeBytes?: number
  mimeType?: string
  fileFingerprint?: string
  pageCount?: number
  url?: string
}

const IMAGE_POOL = ['ticks', 'laptop', 'note2000', 'chandrayaan']
const URL_TITLES: Record<string, string> = {
  laptop: 'PM Free Laptop Yojana 2026 – Apply Online for Free Laptop',
  note2000: '₹2000 notes: last date to exchange, what happens next',
  hotwater: 'This kitchen remedy beats viruses and cancer, say experts',
  ticks: 'New WhatsApp rules: government will monitor all chats',
  chandrayaan: 'Chandrayaan-3: India makes history at the lunar south pole',
}

const DEMO_PROVIDERS: ProviderTrace[] = [
  { stage: 'Multimodal parsing', provider: 'Demo extractor', mode: 'demo' },
  { stage: 'PII scrubbing', provider: 'On-device regex scrubber', mode: 'live' },
  { stage: 'Language detection', provider: 'Script + lexicon detector', mode: 'live' },
  { stage: 'Claim extraction', provider: 'Demo scenario engine', mode: 'demo' },
  { stage: 'Evidence retrieval', provider: 'Pre-authored evidence set', mode: 'demo' },
  { stage: 'Reranking', provider: 'Authority × relevance heuristic', mode: 'demo' },
  { stage: 'Adjudication', provider: 'Demo scenario engine', mode: 'demo' },
]

function pickBy(pool: string[], seed: string): DemoScenario {
  return getScenario(pool[hashString(seed) % pool.length]) ?? DEMO_SCENARIOS[0]
}

function resolveSourceText(input: DemoInput): { text: string; media: Partial<ExtractedMedia>; forced?: DemoScenario } {
  const seed = `${input.fileName ?? ''}:${input.fileSizeBytes ?? 0}:${input.fileFingerprint ?? ''}`
  switch (input.inputType) {
    case 'image': {
      const s = pickBy(IMAGE_POOL, seed)
      return { text: s.sampleText, media: { ocrText: s.sampleText }, forced: s }
    }
    case 'audio': {
      const useMarathi = hashString(seed) % 2 === 1
      const s = getScenario(useMarathi ? 'note2000' : 'hotwater')!
      const transcript = useMarathi ? MARATHI_SAMPLE : s.sampleText
      const durationSec = 12 + (hashString(seed) % 40)
      return { text: transcript, media: { transcript, durationSec }, forced: s }
    }
    case 'pdf': {
      const s = getScenario('laptop')!
      return { text: s.sampleText, media: { pageCount: input.pageCount ?? 1 }, forced: s }
    }
    case 'url': {
      const raw = input.url ?? ''
      let domain = raw
      try {
        domain = new URL(raw).hostname.replace(/^www\./, '')
      } catch {}
      const s = matchScenario(decodeURIComponent(raw).replace(/[-_/]/g, ' ')) ?? pickBy(Object.keys(URL_TITLES), raw)
      return {
        text: s.sampleText,
        media: { url: raw, domain, pageTitle: URL_TITLES[s.key], domainTrusted: Boolean(findSourceByHostname(domain)) },
        forced: s,
      }
    }
    default:
      return { text: input.text ?? '', media: {} }
  }
}

function fallbackClaims(redacted: string): Claim[] {
  const sentences = redacted
    .split(/(?<=[.!?।])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 18)
    .slice(0, 2)
  const list = sentences.length ? sentences : [redacted.slice(0, 160)]
  return list.map((text, i) => ({
    id: `c${i + 1}`,
    text,
    kind: 'factual',
    verdict: 'CANNOT_CONFIRM',
    confidence: 55 + (hashString(text) % 12),
    rationale: 'No document in the trusted-source registry addresses this claim directly.',
    subClaims: [],
    evidenceIds: [],
  }))
}

const FALLBACK_STEPS: SummaryStep[] = [
  { key: 'claim_identified', title: 'Claim identified', detail: 'Checkable statements were isolated from the message.' },
  { key: 'evidence_retrieved', title: 'Evidence retrieved', detail: 'No matching documents in the trusted-source registry.' },
  { key: 'sources_compared', title: 'Sources compared', detail: 'Nothing to compare: zero qualifying sources.' },
  { key: 'contradictions_checked', title: 'Contradictions checked', detail: 'No contradicting evidence found either.' },
  { key: 'dates_checked', title: 'Dates checked', detail: 'No dated evidence available.' },
  { key: 'verdict_assigned', title: 'Verdict assigned', detail: 'Insufficient evidence: Cannot be confirmed.' },
]

export function runDemoVerification(input: DemoInput): VerificationResult {
  const { text, media, forced } = resolveSourceText(input)
  const hadRawMedia = input.inputType !== 'text' && input.inputType !== 'url'
  const privacy = scanPrivacy(text, { hadRawMedia })
  const lang = detectLanguage(text)
  const scenario = forced ?? matchScenario(text)
  const id = `demo-${input.inputType}-${scenario?.key ?? FALLBACK.key}-${shortHash(input.inputType + privacy.redactedText + (input.fileFingerprint ?? ''))}`

  const base = {
    id,
    createdAt: new Date().toISOString(),
    mode: 'demo' as const,
    inputType: input.inputType,
    inputPreview: privacy.redactedText,
    privacy,
    providers: DEMO_PROVIDERS,
    processingMs: 2400 + (hashString(id) % 1800),
    media: {
      inputType: input.inputType,
      fileName: input.fileName,
      fileSizeBytes: input.fileSizeBytes,
      mimeType: input.mimeType,
      detectedLanguage: lang.language,
      languageConfidence: Math.round(lang.confidence * 100),
      ...media,
    },
  }

  if (!scenario) {
    const claims = fallbackClaims(privacy.redactedText)
    return {
      ...base,
      verdict: 'CANNOT_CONFIRM',
      confidence: Math.round(claims.reduce((a, c) => a + c.confidence, 0) / claims.length),
      headline: FALLBACK.headline,
      summary: FALLBACK.summary,
      claims,
      evidence: [],
      steps: FALLBACK_STEPS,
      category: FALLBACK.category,
    }
  }

  return {
    ...base,
    verdict: scenario.verdict,
    confidence: scenario.confidence,
    headline: scenario.headline,
    summary: scenario.summary,
    claims: scenario.claims,
    evidence: scenario.evidence,
    steps: scenario.steps,
    category: scenario.category,
  }
}

/** Rebuilds a demo result from its deterministic ID when it is not in the store (e.g. cold start). */
export function rebuildDemoResult(id: string): VerificationResult | null {
  const match = /^demo-(text|image|audio|pdf|url)-([a-z0-9]+)-[a-z0-9]+$/.exec(id)
  if (!match) return null
  const [, inputType, key] = match
  const scenario = getScenario(key)
  const text = scenario?.sampleText ?? 'The original message was not retained after processing.'
  const result = runDemoVerification({ inputType: 'text', text })
  return {
    ...result,
    id,
    inputType: inputType as InputType,
    media: { ...result.media, inputType: inputType as InputType },
  }
}
