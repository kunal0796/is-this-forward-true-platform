import { NextResponse } from 'next/server'
import { jsonError } from '@/lib/api/http'
import { getVerification } from '@/lib/verification/verificationService'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getVerification(id)
  if (!result) return jsonError('Verification not found', 404, 'not_found')
  return NextResponse.json({ result })
}
