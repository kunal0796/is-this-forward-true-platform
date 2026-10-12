import { handleVerify, readUpload } from '@/lib/api/http'
import { verifyImage } from '@/lib/verification/verificationService'

export async function POST(req: Request) {
  return handleVerify(async () => verifyImage(await readUpload(req)))
}
