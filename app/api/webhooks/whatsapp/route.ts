import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { jsonError } from '@/lib/api/http'
import { env } from '@/lib/providers/env'
import { formatWhatsAppReply } from '@/lib/verification/formatter'
import { detectLanguage } from '@/lib/verification/text-utils'
import {
  VerificationInputError,
  verifyAudio,
  verifyImage,
  verifyText,
} from '@/lib/verification/verificationService'
import type { VerifyResponse } from '@/lib/verification/types'

const GRAPH = 'https://graph.facebook.com/v21.0'

/** Meta webhook verification handshake. */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams
  const token = env.whatsapp.verifyToken
  if (token && params.get('hub.mode') === 'subscribe' && params.get('hub.verify_token') === token) {
    return new Response(params.get('hub.challenge') ?? '', { status: 200 })
  }
  return jsonError('Verification failed', 403, 'forbidden')
}

function signatureValid(raw: string, header: string | null): boolean {
  const secret = env.whatsapp.appSecret
  if (!secret) return true
  if (!header?.startsWith('sha256=')) return false
  const expected = createHmac('sha256', secret).update(raw).digest('hex')
  const a = Buffer.from(header.slice(7))
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

interface WaMessage {
  from: string
  type: 'text' | 'image' | 'audio' | string
  text?: { body: string }
  image?: { id: string; mime_type: string }
  audio?: { id: string; mime_type: string }
}

async function downloadMedia(id: string, mime: string, name: string) {
  const token = env.whatsapp.accessToken
  if (!token) throw new VerificationInputError('Media handling requires WHATSAPP_ACCESS_TOKEN.')
  const meta = await fetch(`${GRAPH}/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json())
  const res = await fetch(meta.url, { headers: { Authorization: `Bearer ${token}` } })
  const bytes = new Uint8Array(await res.arrayBuffer())
  return { name, type: mime.split(';')[0], size: bytes.length, bytes }
}

async function processMessage(msg: WaMessage): Promise<VerifyResponse | null> {
  if (msg.type === 'text' && msg.text?.body) return verifyText(msg.text.body)
  if (msg.type === 'image' && msg.image) return verifyImage(await downloadMedia(msg.image.id, msg.image.mime_type, 'image'))
  if (msg.type === 'audio' && msg.audio) return verifyAudio(await downloadMedia(msg.audio.id, msg.audio.mime_type, 'voice-note'))
  return null
}

async function sendReply(to: string, body: string) {
  const { accessToken, phoneNumberId } = env.whatsapp
  if (!accessToken || !phoneNumberId) return false
  const res = await fetch(`${GRAPH}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body, preview_url: true } }),
  })
  return res.ok
}

/**
 * Accepts either a Meta Cloud API webhook payload or a simple simulator payload: { "from": string, "text": string }.
 * Without WhatsApp credentials, replies are returned in the response body instead of being sent.
 */
export async function POST(req: Request) {
  const raw = await req.text()
  if (!signatureValid(raw, req.headers.get('x-hub-signature-256'))) return jsonError('Invalid signature', 401, 'unauthorized')

  let payload: unknown
  try {
    payload = JSON.parse(raw)
  } catch {
    return jsonError('Invalid JSON', 400, 'invalid_input')
  }

  const origin = new URL(req.url).origin
  const messages: WaMessage[] = []
  const p = payload as {
    from?: string
    text?: string
    entry?: { changes?: { value?: { messages?: WaMessage[] } }[] }[]
  }
  if (typeof p.text === 'string') messages.push({ from: p.from ?? 'simulator', type: 'text', text: { body: p.text } })
  for (const entry of p.entry ?? []) for (const change of entry.changes ?? []) messages.push(...(change.value?.messages ?? []))

  const replies = []
  for (const msg of messages) {
    try {
      const res = await processMessage(msg)
      if (!res) continue
      const lang = detectLanguage(res.result.inputPreview).language
      const body = formatWhatsAppReply(res.result, lang, origin)
      const sent = await sendReply(msg.from, body)
      replies.push({ to: msg.from, resultId: res.result.id, mode: res.result.mode, sent, body })
    } catch (err) {
      const message = err instanceof VerificationInputError ? err.message : 'Could not process this message.'
      replies.push({ to: msg.from, error: message, sent: false })
    }
  }

  // Meta expects a fast 200 regardless of per-message outcome.
  return NextResponse.json({ received: messages.length, replies })
}
