import 'server-only'
import { cosineSimilarity, embed, embedMany } from 'ai'
import { TRUSTED_DOMAINS } from '@/lib/verification/sources'
import { env } from './env'
import { isSupabaseConfigured, supabase } from './supabase'

export interface Candidate {
  url: string
  title: string
  snippet: string
  publishedAt?: string
  publisher?: string
  origin: 'search' | 'factcheck' | 'vector'
  rating?: string
}

/* ---------- Web search (Tavily, then Brave) ---------- */

export function isSearchConfigured() {
  return Boolean(env.search.tavilyKey || env.search.braveKey)
}

export async function webSearch(query: string, max = 6): Promise<{ results: Candidate[]; provider: string }> {
  if (env.search.tavilyKey) {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.search.tavilyKey}` },
      body: JSON.stringify({ query, max_results: max, include_domains: TRUSTED_DOMAINS, search_depth: 'basic' }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) throw new Error(`Tavily ${res.status}`)
    const json = (await res.json()) as {
      results: { url: string; title: string; content: string; published_date?: string }[]
    }
    return {
      provider: 'Tavily',
      results: json.results.map((r) => ({
        url: r.url,
        title: r.title,
        snippet: r.content,
        publishedAt: r.published_date,
        origin: 'search',
      })),
    }
  }
  if (env.search.braveKey) {
    const res = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${max * 2}`,
      { headers: { Accept: 'application/json', 'X-Subscription-Token': env.search.braveKey }, signal: AbortSignal.timeout(10_000) },
    )
    if (!res.ok) throw new Error(`Brave ${res.status}`)
    const json = (await res.json()) as {
      web?: { results: { url: string; title: string; description: string; page_age?: string }[] }
    }
    return {
      provider: 'Brave Search',
      results: (json.web?.results ?? []).slice(0, max * 2).map((r) => ({
        url: r.url,
        title: r.title,
        snippet: r.description.replace(/<[^>]+>/g, ''),
        publishedAt: r.page_age,
        origin: 'search',
      })),
    }
  }
  return { results: [], provider: 'none' }
}

/* ---------- Google Fact Check Tools ---------- */

export function isFactCheckConfigured() {
  return Boolean(env.factCheck.key)
}

export async function searchFactChecks(query: string, languageCode?: string): Promise<Candidate[]> {
  const key = env.factCheck.key
  if (!key) return []
  const params = new URLSearchParams({ query, key, pageSize: '5' })
  if (languageCode) params.set('languageCode', languageCode)
  const res = await fetch(`https://factchecktools.googleapis.com/v1alpha1/claims:search?${params}`, {
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`Fact Check Tools ${res.status}`)
  const json = (await res.json()) as {
    claims?: {
      text: string
      claimReview?: { publisher?: { name?: string; site?: string }; url: string; title?: string; reviewDate?: string; textualRating?: string }[]
    }[]
  }
  return (json.claims ?? []).flatMap((c) =>
    (c.claimReview ?? []).map((r) => ({
      url: r.url,
      title: r.title ?? c.text,
      snippet: `Claim reviewed: “${c.text}”. Rating: ${r.textualRating ?? 'n/a'}.`,
      publishedAt: r.reviewDate,
      publisher: r.publisher?.name,
      rating: r.textualRating,
      origin: 'factcheck' as const,
    })),
  )
}

/* ---------- Embeddings ---------- */

export function isEmbeddingConfigured() {
  return env.embeddings.enabled
}

export async function embedTexts(values: string[]): Promise<number[][]> {
  const { embeddings } = await embedMany({ model: env.embeddings.model, values })
  return embeddings
}

/* ---------- Vector search (Supabase pgvector, see supabase/migrations) ---------- */

export function isVectorConfigured() {
  return isEmbeddingConfigured() && isSupabaseConfigured()
}

export async function vectorSearch(query: string, matchCount = 5): Promise<Candidate[]> {
  if (!isVectorConfigured()) return []
  const { embedding } = await embed({ model: env.embeddings.model, value: query })
  const rows = await supabase.rpc<
    { url: string; title: string; content: string; published_at: string | null; similarity: number }[]
  >('match_evidence', { query_embedding: embedding, match_count: matchCount, min_similarity: 0.72 })
  return (rows ?? []).map((r) => ({
    url: r.url,
    title: r.title,
    snippet: r.content,
    publishedAt: r.published_at ?? undefined,
    origin: 'vector',
  }))
}

/* ---------- Reranking (Cohere, then embeddings, then lexical) ---------- */

export async function rerank(
  query: string,
  docs: Candidate[],
  topN: number,
): Promise<{ ranked: { candidate: Candidate; score: number }[]; provider: string }> {
  if (!docs.length) return { ranked: [], provider: 'none' }
  const texts = docs.map((d) => `${d.title}\n${d.snippet}`)

  if (env.rerank.cohereKey) {
    const res = await fetch('https://api.cohere.com/v2/rerank', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.rerank.cohereKey}` },
      body: JSON.stringify({ model: env.rerank.model, query, documents: texts, top_n: topN }),
      signal: AbortSignal.timeout(8000),
    })
    if (res.ok) {
      const json = (await res.json()) as { results: { index: number; relevance_score: number }[] }
      return {
        provider: `Cohere ${env.rerank.model}`,
        ranked: json.results.map((r) => ({ candidate: docs[r.index], score: r.relevance_score })),
      }
    }
  }

  if (isEmbeddingConfigured()) {
    const [q, ...d] = await embedTexts([query, ...texts])
    return {
      provider: `Embedding similarity (${env.embeddings.model})`,
      ranked: d
        .map((vec, i) => ({ candidate: docs[i], score: cosineSimilarity(q, vec) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topN),
    }
  }

  const terms = new Set(query.toLowerCase().split(/\W+/).filter((t) => t.length > 3))
  return {
    provider: 'Lexical overlap',
    ranked: docs
      .map((doc, i) => {
        const words = texts[i].toLowerCase().split(/\W+/)
        const hits = words.filter((w) => terms.has(w)).length
        return { candidate: doc, score: Math.min(1, hits / Math.max(terms.size, 1)) }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, topN),
  }
}
