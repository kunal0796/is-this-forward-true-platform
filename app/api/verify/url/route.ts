import { z } from 'zod'
import { handleVerify, jsonError } from '@/lib/api/http'
import { verifyUrl } from '@/lib/verification/verificationService'

const bodySchema = z.object({ url: z.string().max(2048) })

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError('Body must be JSON: { "url": string }', 400, 'invalid_input')
  return handleVerify(() => verifyUrl(parsed.data.url))
}
