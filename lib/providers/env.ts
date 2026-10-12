import 'server-only'

function read(name: string): string | undefined {
  const value = process.env[name]?.trim()
  return value ? value : undefined
}

export const env = {
  get verificationMode(): 'demo' | 'live' {
    return read('VERIFICATION_MODE') === 'live' ? 'live' : 'demo'
  },
  llm: {
    get enabled() {
      return read('LLM_PROVIDER') === 'gateway'
    },
    get model() {
      return read('LLM_MODEL') ?? 'google/gemini-3-flash'
    },
    get visionModel() {
      return read('LLM_VISION_MODEL') ?? read('LLM_MODEL') ?? 'google/gemini-3-flash'
    },
  },
  ocr: {
    get googleVisionKey() {
      return read('GOOGLE_CLOUD_VISION_API_KEY')
    },
  },
  asr: {
    get url() {
      return read('WHISPER_API_URL')
    },
    get key() {
      return read('WHISPER_API_KEY')
    },
    get model() {
      return read('WHISPER_MODEL') ?? 'whisper-1'
    },
  },
  search: {
    get tavilyKey() {
      return read('TAVILY_API_KEY')
    },
    get braveKey() {
      return read('BRAVE_SEARCH_API_KEY')
    },
  },
  factCheck: {
    get key() {
      return read('GOOGLE_FACT_CHECK_API_KEY')
    },
  },
  embeddings: {
    get enabled() {
      return read('EMBEDDINGS_PROVIDER') === 'gateway'
    },
    get model() {
      return read('EMBEDDING_MODEL') ?? 'google/gemini-embedding-001'
    },
  },
  rerank: {
    get cohereKey() {
      return read('COHERE_API_KEY')
    },
    get model() {
      return read('COHERE_RERANK_MODEL') ?? 'rerank-v3.5'
    },
  },
  supabase: {
    get url() {
      return read('SUPABASE_URL')
    },
    get serviceRoleKey() {
      return read('SUPABASE_SERVICE_ROLE_KEY')
    },
  },
  whatsapp: {
    get verifyToken() {
      return read('WHATSAPP_VERIFY_TOKEN')
    },
    get appSecret() {
      return read('WHATSAPP_APP_SECRET')
    },
    get accessToken() {
      return read('WHATSAPP_ACCESS_TOKEN')
    },
    get phoneNumberId() {
      return read('WHATSAPP_PHONE_NUMBER_ID')
    },
  },
}

export interface IntegrationStatus {
  key: string
  label: string
  configured: boolean
  role: 'required-for-live' | 'optional'
}

export function getIntegrationStatus(): IntegrationStatus[] {
  return [
    { key: 'llm', label: 'LLM (claim extraction + adjudication)', configured: env.llm.enabled, role: 'required-for-live' },
    {
      key: 'retrieval',
      label: 'Web search or Google Fact Check Tools',
      configured: Boolean(env.search.tavilyKey || env.search.braveKey || env.factCheck.key),
      role: 'required-for-live',
    },
    { key: 'ocr', label: 'OCR (Google Cloud Vision)', configured: Boolean(env.ocr.googleVisionKey) || env.llm.enabled, role: 'optional' },
    { key: 'asr', label: 'Speech-to-text (Whisper-compatible)', configured: Boolean(env.asr.url && env.asr.key), role: 'optional' },
    { key: 'embeddings', label: 'Embeddings', configured: env.embeddings.enabled, role: 'optional' },
    {
      key: 'vector',
      label: 'Vector search (Supabase pgvector)',
      configured: env.embeddings.enabled && Boolean(env.supabase.url && env.supabase.serviceRoleKey),
      role: 'optional',
    },
    { key: 'rerank', label: 'Reranking (Cohere)', configured: Boolean(env.rerank.cohereKey), role: 'optional' },
    { key: 'supabase', label: 'Supabase persistence', configured: Boolean(env.supabase.url && env.supabase.serviceRoleKey), role: 'optional' },
  ]
}

export function isLiveReady(): boolean {
  if (env.verificationMode !== 'live') return false
  return getIntegrationStatus()
    .filter((s) => s.role === 'required-for-live')
    .every((s) => s.configured)
}
