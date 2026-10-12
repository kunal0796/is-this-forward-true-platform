import 'server-only'
import { NextResponse } from 'next/server'
import { VerificationInputError, type UploadedFile } from '@/lib/verification/verificationService'
import type { VerifyResponse } from '@/lib/verification/types'

export function jsonError(error: string, status: number, code?: string) {
  return NextResponse.json({ error, code }, { status })
}

export async function readUpload(req: Request, field = 'file'): Promise<UploadedFile> {
  let form: FormData
  try {
    form = await req.formData()
  } catch {
    throw new VerificationInputError('Expected a multipart/form-data upload.')
  }
  const file = form.get(field)
  if (!(file instanceof File)) throw new VerificationInputError(`Missing "${field}" in the upload.`)
  return {
    name: file.name.slice(0, 200),
    type: file.type,
    size: file.size,
    bytes: new Uint8Array(await file.arrayBuffer()),
  }
}

export async function handleVerify(run: () => Promise<VerifyResponse>) {
  try {
    const data = await run()
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    if (err instanceof VerificationInputError) return jsonError(err.message, 400, 'invalid_input')
    console.error('[api/verify] Unexpected error:', err)
    return jsonError('Verification failed. Please try again.', 500, 'internal_error')
  }
}
