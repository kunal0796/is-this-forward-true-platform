import 'server-only'
import { isSupabaseConfigured, supabase } from '@/lib/providers/supabase'
import { rebuildDemoResult } from './demo/demoEngine'
import type { VerificationResult } from './types'

const globalStore = globalThis as unknown as { __verificationStore?: Map<string, VerificationResult> }
const memory = (globalStore.__verificationStore ??= new Map<string, VerificationResult>())
const MAX_MEMORY = 500

export async function saveResult(result: VerificationResult): Promise<void> {
  memory.set(result.id, result)
  if (memory.size > MAX_MEMORY) memory.delete(memory.keys().next().value as string)

  if (isSupabaseConfigured()) {
    // Only redacted content is persisted. Raw media never reaches this layer.
    await supabase
      .upsert('verifications', {
        id: result.id,
        created_at: result.createdAt,
        mode: result.mode,
        input_type: result.inputType,
        verdict: result.verdict,
        confidence: result.confidence,
        language: result.media.detectedLanguage,
        category: result.category,
        result,
      })
      .catch((err: unknown) => console.error('[verification] Supabase save failed:', err))
  }
}

export async function findResult(id: string): Promise<VerificationResult | null> {
  if (!/^[a-z0-9-]{6,80}$/i.test(id)) return null
  const cached = memory.get(id)
  if (cached) return cached

  if (isSupabaseConfigured()) {
    const row = await supabase
      .selectOne<{ result: VerificationResult }>('verifications', 'id', id)
      .catch(() => null)
    if (row?.result) return row.result
  }

  return rebuildDemoResult(id)
}

export async function saveFeedback(feedback: {
  verificationId: string
  helpful: boolean
  reason?: string
}): Promise<void> {
  if (isSupabaseConfigured()) {
    await supabase.insert('verification_feedback', {
      verification_id: feedback.verificationId,
      helpful: feedback.helpful,
      reason: feedback.reason ?? null,
    })
  }
}
