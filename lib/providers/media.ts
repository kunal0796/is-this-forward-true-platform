import 'server-only'
import { env } from './env'
import { extractTextFromFile, isLlmConfigured } from './llm'

export interface ProviderOutcome<T> {
  value: T | null
  provider: string
}

/** OCR: Google Cloud Vision first, then multimodal LLM, otherwise null (caller falls back to demo). */
export async function runOcr(data: Uint8Array, mediaType: string): Promise<ProviderOutcome<string>> {
  const key = env.ocr.googleVisionKey
  if (key) {
    const res = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: { content: Buffer.from(data).toString('base64') },
            features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
            imageContext: { languageHints: ['en', 'hi', 'mr'] },
          },
        ],
      }),
    })
    if (res.ok) {
      const json = (await res.json()) as { responses?: { fullTextAnnotation?: { text?: string } }[] }
      const text = json.responses?.[0]?.fullTextAnnotation?.text?.trim()
      if (text) return { value: text, provider: 'Google Cloud Vision' }
    }
  }
  if (isLlmConfigured()) {
    const text = await extractTextFromFile(data, mediaType)
    if (text) return { value: text, provider: `${env.llm.visionModel} (vision)` }
  }
  return { value: null, provider: 'none' }
}

/**
 * ASR via any OpenAI-compatible transcription endpoint: OpenAI Whisper, Groq, or a self-hosted
 * faster-whisper server (e.g. https://your-host/v1/audio/transcriptions).
 */
export async function runAsr(
  data: Uint8Array,
  fileName: string,
  mediaType: string,
): Promise<ProviderOutcome<{ text: string; language?: string; durationSec?: number }>> {
  const { url, key, model } = env.asr
  if (!url || !key) return { value: null, provider: 'none' }
  const form = new FormData()
  form.append('file', new Blob([Buffer.from(data)], { type: mediaType }), fileName)
  form.append('model', model)
  form.append('response_format', 'verbose_json')
  const res = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${key}` }, body: form })
  if (!res.ok) throw new Error(`ASR ${res.status}`)
  const json = (await res.json()) as { text: string; language?: string; duration?: number }
  return {
    value: { text: json.text.trim(), language: json.language, durationSec: json.duration },
    provider: `Whisper-compatible (${model})`,
  }
}

/** PDF text: multimodal LLM reads the document directly. */
export async function runPdfExtraction(data: Uint8Array): Promise<ProviderOutcome<string>> {
  if (!isLlmConfigured()) return { value: null, provider: 'none' }
  const text = await extractTextFromFile(data, 'application/pdf')
  return { value: text || null, provider: `${env.llm.visionModel} (document)` }
}

const PRIVATE_HOST = /^(localhost|0\.0\.0\.0|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?|.*\.internal$|.*\.local$)/i

export function assertPublicUrl(raw: string): URL {
  const url = new URL(raw)
  if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('Only http(s) URLs are supported')
  if (PRIVATE_HOST.test(url.hostname)) throw new Error('Private or local addresses are not allowed')
  return url
}

/** Fetches a public page and returns readable text. Guards against SSRF and oversized pages. */
export async function fetchPage(raw: string): Promise<{ title: string; text: string }> {
  const url = assertPublicUrl(raw)
  const res = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(8000),
    headers: { 'User-Agent': 'IsThisForwardTrue/1.0 (+fact-check bot)', Accept: 'text/html' },
  })
  if (!res.ok) throw new Error(`Page returned ${res.status}`)
  const html = (await res.text()).slice(0, 500_000)
  const title = /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1]?.trim() ?? url.hostname
  const text = html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<nav[\s\S]*?<\/nav>|<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 6000)
  return { title, text }
}
