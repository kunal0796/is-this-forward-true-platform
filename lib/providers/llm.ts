import 'server-only'
import { generateText, Output } from 'ai'
import { z } from 'zod'
import { env } from './env'

const VERDICT = z.enum(['VERIFIED', 'FALSE', 'PARTLY_SUPPORTED', 'OUTDATED', 'CANNOT_CONFIRM'])
const CATEGORY = z.enum([
  'Government schemes',
  'Health',
  'Finance & banking',
  'Technology',
  'Science',
  'Civic & safety',
  'Other',
])

const claimExtractionSchema = z.object({
  category: CATEGORY,
  claims: z
    .array(
      z.object({
        text: z.string().describe('A single, self-contained, checkable factual claim in English'),
        kind: z.enum(['factual', 'numerical', 'temporal', 'eligibility', 'health', 'attribution']),
        searchQuery: z.string().describe('A concise web search query to find evidence for this claim'),
        subClaims: z.array(z.string()).max(3).describe('Atomic components of the claim, if it is compound'),
      }),
    )
    .min(1)
    .max(5),
})

export type ExtractedClaims = z.infer<typeof claimExtractionSchema>

const localized = z.object({ en: z.string(), hi: z.string(), mr: z.string() })

const adjudicationSchema = z.object({
  verdict: VERDICT,
  confidence: z.number().min(0).max(100),
  headline: localized.describe('Max 8 words'),
  summary: localized.describe('One or two plain-language sentences for a general audience'),
  claims: z.array(
    z.object({
      index: z.number().int(),
      verdict: VERDICT,
      confidence: z.number().min(0).max(100),
      rationale: z.string().describe('One sentence citing which evidence decided this'),
      subClaimVerdicts: z.array(VERDICT),
    }),
  ),
  evidenceStances: z.array(
    z.object({
      evidenceId: z.string(),
      stance: z.enum(['supports', 'contradicts', 'context']),
      claimIndexes: z.array(z.number().int()),
    }),
  ),
  steps: z.object({
    claim_identified: z.string(),
    evidence_retrieved: z.string(),
    sources_compared: z.string(),
    contradictions_checked: z.string(),
    dates_checked: z.string(),
    verdict_assigned: z.string(),
  }),
})

export type Adjudication = z.infer<typeof adjudicationSchema>

export function isLlmConfigured(): boolean {
  return env.llm.enabled
}

export async function extractClaims(redactedText: string): Promise<ExtractedClaims> {
  const { output } = await generateText({
    model: env.llm.model,
    output: Output.object({ schema: claimExtractionSchema }),
    system:
      'You extract checkable factual claims from forwarded messages (often WhatsApp, possibly Hindi or Marathi). ' +
      'Ignore opinions, greetings and calls to forward. Redaction tokens like [NAME] or [PHONE] are placeholders; never try to recover them. ' +
      'Decompose compound claims into atomic sub-claims.',
    prompt: redactedText,
  })
  return output
}

export interface AdjudicationEvidence {
  id: string
  source: string
  authority: number
  publishedAt: string
  title: string
  snippet: string
}

export async function adjudicate(
  claims: { text: string; subClaims: string[] }[],
  evidence: AdjudicationEvidence[],
  today: string,
): Promise<Adjudication> {
  const { output } = await generateText({
    model: env.llm.model,
    output: Output.object({ schema: adjudicationSchema }),
    system:
      'You are a careful fact-check adjudicator. Decide only from the provided evidence; never use outside knowledge to invent support. ' +
      'Prefer primary and higher-authority sources. A claim that was once true but is superseded by newer evidence is OUTDATED. ' +
      'Use CANNOT_CONFIRM when evidence is missing or inconclusive. ' +
      'Return short user-facing summaries only, not your internal reasoning. Translate headline and summary into Hindi (hi) and Marathi (mr).',
    prompt: JSON.stringify({ today, claims: claims.map((c, index) => ({ index, ...c })), evidence }),
  })
  return output
}

/** Fallback text extraction for images and PDFs using a multimodal model. */
export async function extractTextFromFile(data: Uint8Array, mediaType: string): Promise<string> {
  const { text } = await generateText({
    model: env.llm.visionModel,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Transcribe all readable text from this file verbatim. Output only the text, no commentary.',
          },
          { type: 'file', mediaType, data },
        ],
      },
    ],
  })
  return text.trim()
}
