import 'server-only'
import { env } from './env'

/** Minimal PostgREST client using the service-role key. Server-only; never import from client code. */
export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabase.url && env.supabase.serviceRoleKey)
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const url = env.supabase.url
  const key = env.supabase.serviceRoleKey
  if (!url || !key) throw new Error('Supabase is not configured')
  const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`)
  const text = await res.text()
  return (text ? JSON.parse(text) : null) as T
}

export const supabase = {
  insert<T extends object>(table: string, row: T) {
    return request<null>(table, { method: 'POST', body: JSON.stringify(row), headers: { Prefer: 'return=minimal' } })
  },
  upsert<T extends object>(table: string, row: T) {
    return request<null>(table, {
      method: 'POST',
      body: JSON.stringify(row),
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    })
  },
  async selectOne<T>(table: string, column: string, value: string): Promise<T | null> {
    const rows = await request<T[]>(
      `${table}?${encodeURIComponent(column)}=eq.${encodeURIComponent(value)}&limit=1`,
      { method: 'GET' },
    )
    return rows?.[0] ?? null
  },
  rpc<T>(fn: string, args: Record<string, unknown>) {
    return request<T>(`rpc/${fn}`, { method: 'POST', body: JSON.stringify(args) })
  },
}
