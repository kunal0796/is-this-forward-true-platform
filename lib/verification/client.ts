import type { ApiError, InputType, VerifyResponse } from './types'

export const CLIENT_LIMITS = {
  textMin: 10,
  textMax: 5000,
  uploadMaxBytes: 4 * 1024 * 1024,
  image: ['image/png', 'image/jpeg', 'image/webp'],
  audio: ['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/x-wav', 'audio/webm', 'audio/aac', 'audio/x-m4a', 'audio/opus'],
  pdf: ['application/pdf'],
}

export class VerifyRequestError extends Error {}

export type VerifyPayload =
  | { type: 'text'; text: string }
  | { type: 'url'; url: string }
  | { type: 'image' | 'audio' | 'pdf'; file: File }

const ENDPOINT: Record<InputType, string> = {
  text: '/api/verify',
  url: '/api/verify/url',
  image: '/api/verify/image',
  audio: '/api/verify/audio',
  pdf: '/api/verify/pdf',
}

export async function submitVerification(payload: VerifyPayload, signal?: AbortSignal): Promise<VerifyResponse> {
  let init: RequestInit
  if (payload.type === 'text' || payload.type === 'url') {
    const body = payload.type === 'text' ? { text: payload.text } : { url: payload.url }
    init = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  } else {
    const form = new FormData()
    form.append('file', payload.file)
    init = { method: 'POST', body: form }
  }

  let res: Response
  try {
    res = await fetch(ENDPOINT[payload.type], { ...init, signal })
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err
    throw new VerifyRequestError('Network error. Check your connection and try again.')
  }
  const data = (await res.json().catch(() => null)) as VerifyResponse | ApiError | null
  if (!res.ok || !data || 'error' in data) {
    throw new VerifyRequestError((data && 'error' in data && data.error) || `Request failed (${res.status}).`)
  }
  return data
}

/** Best-effort page count from raw PDF bytes, used for instant client-side feedback. */
export async function countPdfPagesClient(file: File): Promise<number> {
  const buf = await file.arrayBuffer()
  const text = new TextDecoder('iso-8859-1').decode(buf)
  const countMatch = [...text.matchAll(/\/Type\s*\/Pages\b[^>]*?\/Count\s+(\d+)/g)].map((m) => Number(m[1]))
  if (countMatch.length) return Math.max(...countMatch)
  return (text.match(/\/Type\s*\/Page\b(?!s)/g) ?? []).length
}

/** Peaks for a waveform, decoded with the Web Audio API. Returns null if the browser cannot decode the file. */
export async function computeWaveform(file: File, bars = 64): Promise<{ peaks: number[]; duration: number } | null> {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const audio = await ctx.decodeAudioData(await file.arrayBuffer())
    const data = audio.getChannelData(0)
    const block = Math.floor(data.length / bars)
    const peaks: number[] = []
    for (let i = 0; i < bars; i++) {
      let max = 0
      for (let j = 0; j < block; j += 32) max = Math.max(max, Math.abs(data[i * block + j] ?? 0))
      peaks.push(max)
    }
    const top = Math.max(...peaks, 0.01)
    void ctx.close()
    return { peaks: peaks.map((p) => p / top), duration: audio.duration }
  } catch {
    return null
  }
}
