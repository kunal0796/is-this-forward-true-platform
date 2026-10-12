import { handleVerify, readUpload } from '@/lib/api/http'
import { verifyAudio } from '@/lib/verification/verificationService'

export async function POST(req: Request) {
  return handleVerify(async () => verifyAudio(await readUpload(req)))
}
