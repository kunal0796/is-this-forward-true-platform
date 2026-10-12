import type { Language } from './types'

export function hashString(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function shortHash(input: string): string {
  return hashString(input).toString(36).padStart(7, '0').slice(0, 7)
}

const MARATHI_MARKERS = ['आहे', 'नाही', 'आणि', 'च्या', 'होते', 'आहेत', 'करा', 'मध्ये', 'हे', 'साठी']
const HINDI_MARKERS = ['है', 'नहीं', 'और', 'के', 'में', 'हैं', 'करें', 'था', 'लिए', 'यह']

export function detectLanguage(text: string): { language: Language; confidence: number } {
  const letters = text.replace(/[\s\d\p{P}\p{S}]/gu, '')
  if (!letters.length) return { language: 'en', confidence: 0.5 }
  const devanagari = (letters.match(/[\u0900-\u097F]/g) ?? []).length
  const ratio = devanagari / letters.length
  if (ratio < 0.3) return { language: 'en', confidence: Math.min(0.99, 0.7 + (1 - ratio) * 0.29) }

  const tokens = text.split(/[\s,.!?।]+/)
  const mr = tokens.filter((t) => MARATHI_MARKERS.includes(t)).length
  const hi = tokens.filter((t) => HINDI_MARKERS.includes(t)).length
  const total = mr + hi || 1
  if (mr > hi) return { language: 'mr', confidence: Math.min(0.98, 0.6 + (mr / total) * 0.38) }
  return { language: 'hi', confidence: Math.min(0.98, 0.6 + (hi / total) * 0.38) }
}

export const LANGUAGE_NAME: Record<Language, string> = {
  en: 'English',
  hi: 'हिन्दी',
  mr: 'मराठी',
}

export const LANGUAGE_NAME_EN: Record<Language, string> = {
  en: 'English',
  hi: 'Hindi',
  mr: 'Marathi',
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}
