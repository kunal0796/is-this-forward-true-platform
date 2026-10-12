import { NextResponse } from 'next/server'
import { z } from 'zod'
import { jsonError } from '@/lib/api/http'
import { saveFeedback } from '@/lib/verification/repository'

const schema = z.object({
  verificationId: z.string().regex(/^[a-z0-9-]{6,80}$/i),
  helpful: z.boolean(),
  reason: z.string().trim().max(500).optional(),
})

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError('Invalid feedback payload', 400, 'invalid_input')
  try {
    await saveFeedback(parsed.data)
  } catch (err) {
    console.error('[api/feedback] save failed:', err)
    return jsonError('Could not save feedback', 500, 'internal_error')
  }
  return NextResponse.json({ ok: true }, { status: 201 })
}
