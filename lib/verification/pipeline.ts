import 'server-only'
import { env } from '@/lib/providers/env'
import { adjudicate, extractClaims } from '@/lib/providers/llm'
import {
  isFactCheckConfigured,
  isSearchConfigured,
  isVectorConfigured,
  rerank,
  searchFactChecks,
  vectorSearch,
  webSearch,
  type Candidate,
} from '@/lib/providers/retrieval'
import { scanPrivacy } from './pii'
import { findSourceByHostname } from './sources'
import { detectLanguage, shortHash } from './text-utils'
import type {
  Claim,
  Evidence,
  ExtractedMedia,
  InputType,
  ProviderTrace,
  SummaryStep,
  SummaryStepKey,
  VerificationResult,
} from './types'

export interface ParsedInput {
  inputType: InputType
  text: string
  media: Partial<ExtractedMedia>
  hadRawMedia: boolean
  parsingProvider: string
}

const STEP_TITLES: Record<SummaryStepKey, string> = {
  claim_identified: 'Claim identified',
  evidence_retrieved: 'Evidence retrieved',
  sources_compared: 'Sources compared',
  contradictions_checked: 'Contradictions checked',
  dates_checked: 'Dates checked',
  verdict_assigned: 'Verdict assigned',
}

function toEvidenceCandidate(c: Candidate, score: number, idx: number): Omit<Evidence, 'stance' | 'claimIds'> | null {
  let host = ''
  try {
    host = new URL(c.url).hostname
  } catch {
    return null
  }
  const source = findSourceByHostname(host)
  // Fact-check API results from non-registry publishers are kept at a capped authority; other unknown domains are dropped.
  if (!source && c.origin !== 'factcheck') return null
  return {
    id: `e${idx + 1}`,
    sourceId: source?.id ?? 'external',
    sourceName: source?.name ?? c.publisher ?? host,
    sourceType: source?.type ?? 'fact_checker',
    authority: source?.authorityScore ?? 70,
    title: c.title,
    url: c.url,
    publishedAt: c.publishedAt ?? '',
    relevance: Math.round(Math.max(0, Math.min(1, score)) * 100),
    snippet: c.snippet.slice(0, 400),
  }
}

/** UI → API → verificationService → claim extraction → retrieval → reranking → adjudication → formatter */
export async function runLivePipeline(input: ParsedInput): Promise<VerificationResult> {
  const started = Date.now()
  const providers: ProviderTrace[] = [
    { stage: 'Multimodal parsing', provider: input.parsingProvider, mode: 'live' },
    { stage: 'PII scrubbing', provider: 'On-device regex scrubber', mode: 'live' },
    { stage: 'Language detection', provider: 'Script + lexicon detector', mode: 'live' },
  ]

  const privacy = scanPrivacy(input.text, { hadRawMedia: input.hadRawMedia })
  const lang = detectLanguage(input.text)

  // 1. Claim extraction + decomposition (LLM sees only redacted text)
  const extracted = await extractClaims(privacy.redactedText)
  providers.push({ stage: 'Claim extraction', provider: env.llm.model, mode: 'live' })

  // 2. Retrieval: fact-check DB + trusted-domain web search + vector store
  let searchProvider = 'none'
  const perClaim = await Promise.all(
    extracted.claims.map(async (claim) => {
      const [factChecks, search, vectors] = await Promise.all([
        searchFactChecks(claim.searchQuery).catch(() => []),
        webSearch(claim.searchQuery).catch(() => ({ results: [] as Candidate[], provider: 'error' })),
        vectorSearch(claim.searchQuery).catch(() => []),
      ])
      if (search.provider !== 'none') searchProvider = search.provider
      return [...factChecks, ...search.results, ...vectors]
    }),
  )
  providers.push(
    { stage: 'Fact-check lookup', provider: 'Google Fact Check Tools', mode: isFactCheckConfigured() ? 'live' : 'skipped' },
    { stage: 'Web retrieval', provider: searchProvider, mode: isSearchConfigured() ? 'live' : 'skipped' },
    { stage: 'Vector search', provider: 'Supabase pgvector', mode: isVectorConfigured() ? 'live' : 'skipped' },
  )

  // 3. Reranking + source ranking (dedupe by URL, trusted registry only)
  const seen = new Set<string>()
  const pool: Omit<Evidence, 'stance' | 'claimIds'>[] = []
  let rerankProvider = 'none'
  for (let i = 0; i < extracted.claims.length; i++) {
    const { ranked, provider } = await rerank(extracted.claims[i].text, perClaim[i], 4)
    rerankProvider = provider
    for (const { candidate, score } of ranked) {
      if (seen.has(candidate.url)) continue
      const ev = toEvidenceCandidate(candidate, score, pool.length)
      if (ev) {
        seen.add(candidate.url)
        pool.push(ev)
      }
    }
  }
  pool.sort((a, b) => b.authority * b.relevance - a.authority * a.relevance)
  providers.push({ stage: 'Reranking', provider: rerankProvider, mode: 'live' })

  // 4. Adjudication over retrieved evidence only
  const verdict = await adjudicate(
    extracted.claims.map((c) => ({ text: c.text, subClaims: c.subClaims })),
    pool.map((e) => ({
      id: e.id,
      source: e.sourceName,
      authority: e.authority,
      publishedAt: e.publishedAt,
      title: e.title,
      snippet: e.snippet,
    })),
    new Date().toISOString().slice(0, 10),
  )
  providers.push({ stage: 'Adjudication', provider: env.llm.model, mode: 'live' })

  // 5. Response formatting
  const stanceById = new Map(verdict.evidenceStances.map((s) => [s.evidenceId, s]))
  const evidence: Evidence[] = pool.map((e) => {
    const s = stanceById.get(e.id)
    return { ...e, stance: s?.stance ?? 'context', claimIds: (s?.claimIndexes ?? []).map((i) => `c${i + 1}`) }
  })

  const claims: Claim[] = extracted.claims.map((c, i) => {
    const adj = verdict.claims.find((x) => x.index === i)
    const id = `c${i + 1}`
    return {
      id,
      text: c.text,
      kind: c.kind,
      verdict: adj?.verdict ?? 'CANNOT_CONFIRM',
      confidence: Math.round(adj?.confidence ?? 50),
      rationale: adj?.rationale ?? 'No decisive evidence was retrieved.',
      subClaims: c.subClaims.map((text, j) => ({
        id: `${id}${String.fromCharCode(97 + j)}`,
        text,
        verdict: adj?.subClaimVerdicts[j] ?? 'CANNOT_CONFIRM',
      })),
      evidenceIds: evidence.filter((e) => e.claimIds.includes(id)).map((e) => e.id),
    }
  })

  const steps: SummaryStep[] = (Object.keys(STEP_TITLES) as SummaryStepKey[]).map((key) => ({
    key,
    title: STEP_TITLES[key],
    detail: verdict.steps[key],
  }))

  return {
    id: `live-${shortHash(privacy.redactedText + started)}${started.toString(36)}`,
    createdAt: new Date().toISOString(),
    mode: 'live',
    inputType: input.inputType,
    inputPreview: privacy.redactedText,
    media: {
      inputType: input.inputType,
      detectedLanguage: lang.language,
      languageConfidence: Math.round(lang.confidence * 100),
      ...input.media,
    },
    privacy,
    verdict: verdict.verdict,
    confidence: Math.round(verdict.confidence),
    headline: verdict.headline,
    summary: verdict.summary,
    claims,
    evidence,
    steps,
    category: extracted.category,
    providers,
    processingMs: Date.now() - started,
  }
}
