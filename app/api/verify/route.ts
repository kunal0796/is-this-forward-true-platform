import { z } from 'zod'
import { handleVerify, jsonError } from '@/lib/api/http'
import { verifyText } from '@/lib/verification/verificationService'

const bodySchema = z.object({ text: z.string() })

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError('Body must be JSON: { "text": string }', 400, 'invalid_input')
  return handleVerify(() => verifyText(parsed.data.text))
}
