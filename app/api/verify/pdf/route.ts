import { handleVerify, readUpload } from '@/lib/api/http'
import { verifyPdf } from '@/lib/verification/verificationService'

export async function POST(req: Request) {
  return handleVerify(async () => verifyPdf(await readUpload(req)))
}
