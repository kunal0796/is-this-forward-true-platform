import 'server-only'
import { isLiveReady } from '@/lib/providers/env'
import { fetchPage, runAsr, runOcr, runPdfExtraction } from '@/lib/providers/media'
import { runDemoVerification, type DemoInput } from './demo/demoEngine'
import { runLivePipeline, type ParsedInput } from './pipeline'
import { findResult, saveResult } from './repository'
import { findSourceByHostname } from './sources'
import { hashString } from './text-utils'
import type { InputType, VerificationJob, VerificationResult, VerifyResponse } from './types'

export interface UploadedFile {
  name: string
  type: string
  size: number
  bytes: Uint8Array
}

export class VerificationInputError extends Error {}

export const LIMITS = {
  textMin: 10,
  textMax: 5000,
  fileMaxBytes: 4 * 1024 * 1024,
}

function fingerprint(bytes: Uint8Array): string {
  // Sample the buffer so large files hash quickly and deterministically.
  let sample = ''
  const step = Math.max(1, Math.floor(bytes.length / 2048))
  for (let i = 0; i < bytes.length; i += step) sample += String.fromCharCode(bytes[i])
  return hashString(sample).toString(36)
}

export function countPdfPages(bytes: Uint8Array): number {
  const text = Buffer.from(bytes).toString('latin1')
  const matches = text.match(/\/Type\s*\/Page(?!s)/g)
  return Math.max(1, matches?.length ?? 1)
}

function toJob(result: VerificationResult): VerificationJob {
  return {
    id: `job_${result.id}`,
    status: 'completed',
    stage: 'verdict',
    inputType: result.inputType,
    createdAt: result.createdAt,
    resultId: result.id,
  }
}

/**
 * Runs the live pipeline when every required provider is configured. Any missing integration,
 * empty extraction or provider failure falls back to the deterministic demo engine, which marks
 * the result `mode: 'demo'` so the UI can label it DEMO VERIFICATION.
 */
async function execute(demoInput: DemoInput, parseLive: () => Promise<ParsedInput | null>): Promise<VerifyResponse> {
  let result: VerificationResult | null = null
  if (isLiveReady()) {
    try {
      const parsed = await parseLive()
      if (parsed?.text.trim()) result = await runLivePipeline(parsed)
    } catch (err) {
      console.error('[verification] Live pipeline failed, falling back to demo:', err)
    }
  }
  result ??= runDemoVerification(demoInput)
  await saveResult(result)
  return { job: toJob(result), result }
}

function validateFile(file: UploadedFile, accept: RegExp, label: string) {
  if (!file.size) throw new VerificationInputError(`The ${label} is empty.`)
  if (file.size > LIMITS.fileMaxBytes) throw new VerificationInputError(`The ${label} is larger than 4 MB.`)
  if (!accept.test(file.type)) throw new VerificationInputError(`Unsupported ${label} format (${file.type || 'unknown'}).`)
}

export async function verifyText(text: string): Promise<VerifyResponse> {
  const clean = text.trim()
  if (clean.length < LIMITS.textMin) throw new VerificationInputError('Please paste a longer message (at least 10 characters).')
  if (clean.length > LIMITS.textMax) throw new VerificationInputError('Messages are limited to 5,000 characters.')
  return execute({ inputType: 'text', text: clean }, async () => ({
    inputType: 'text',
    text: clean,
    media: {},
    hadRawMedia: false,
    parsingProvider: 'Plain text',
  }))
}

export async function verifyImage(file: UploadedFile): Promise<VerifyResponse> {
  validateFile(file, /^image\/(png|jpe?g|webp|gif|heic)$/, 'image')
  return execute(
    { inputType: 'image', fileName: file.name, fileSizeBytes: file.size, mimeType: file.type, fileFingerprint: fingerprint(file.bytes) },
    async () => {
      const ocr = await runOcr(file.bytes, file.type)
      if (!ocr.value) return null
      return {
        inputType: 'image',
        text: ocr.value,
        media: { fileName: file.name, fileSizeBytes: file.size, mimeType: file.type, ocrText: ocr.value },
        hadRawMedia: true,
        parsingProvider: ocr.provider,
      }
    },
  )
}

export async function verifyAudio(file: UploadedFile): Promise<VerifyResponse> {
  validateFile(file, /^audio\/|^video\/(mp4|webm|ogg)$/, 'audio file')
  return execute(
    { inputType: 'audio', fileName: file.name, fileSizeBytes: file.size, mimeType: file.type, fileFingerprint: fingerprint(file.bytes) },
    async () => {
      const asr = await runAsr(file.bytes, file.name, file.type)
      if (!asr.value) return null
      return {
        inputType: 'audio',
        text: asr.value.text,
        media: {
          fileName: file.name,
          fileSizeBytes: file.size,
          mimeType: file.type,
          transcript: asr.value.text,
          durationSec: asr.value.durationSec,
        },
        hadRawMedia: true,
        parsingProvider: asr.provider,
      }
    },
  )
}

export async function verifyPdf(file: UploadedFile): Promise<VerifyResponse> {
  validateFile(file, /^application\/pdf$/, 'PDF')
  const pageCount = countPdfPages(file.bytes)
  return execute(
    { inputType: 'pdf', fileName: file.name, fileSizeBytes: file.size, mimeType: file.type, fileFingerprint: fingerprint(file.bytes), pageCount },
    async () => {
      const pdf = await runPdfExtraction(file.bytes)
      if (!pdf.value) return null
      return {
        inputType: 'pdf',
        text: pdf.value,
        media: { fileName: file.name, fileSizeBytes: file.size, mimeType: file.type, pageCount },
        hadRawMedia: true,
        parsingProvider: pdf.provider,
      }
    },
  )
}

export async function verifyUrl(rawUrl: string): Promise<VerifyResponse> {
  let url: URL
  try {
    url = new URL(rawUrl.trim())
  } catch {
    throw new VerificationInputError('That does not look like a valid URL.')
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new VerificationInputError('Only http and https links are supported.')
  const domain = url.hostname.replace(/^www\./, '')
  return execute({ inputType: 'url', url: url.toString() }, async () => {
    const page = await fetchPage(url.toString())
    return {
      inputType: 'url',
      text: `${page.title}. ${page.text}`,
      media: { url: url.toString(), domain, pageTitle: page.title, domainTrusted: Boolean(findSourceByHostname(domain)) },
      hadRawMedia: false,
      parsingProvider: 'Server-side page fetch',
    }
  })
}

export async function getVerification(id: string): Promise<VerificationResult | null> {
  return findResult(id)
}

export const verificationService = {
  verifyText,
  verifyImage,
  verifyAudio,
  verifyPdf,
  verifyUrl,
  getVerification,
}

export type { InputType }
