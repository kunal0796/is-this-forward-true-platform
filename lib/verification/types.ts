export type Verdict =
  | 'VERIFIED'
  | 'FALSE'
  | 'PARTLY_SUPPORTED'
  | 'OUTDATED'
  | 'CANNOT_CONFIRM'

export type InputType = 'text' | 'image' | 'audio' | 'pdf' | 'url'

export type Language = 'en' | 'hi' | 'mr'

export type Localized = Record<Language, string>

export type VerificationMode = 'demo' | 'live'

export type SourceType =
  | 'government'
  | 'regulator'
  | 'international_org'
  | 'news_agency'
  | 'fact_checker'
  | 'research'

export type SourceStatus = 'active' | 'monitored' | 'paused'

export interface Source {
  id: string
  name: string
  shortName: string
  type: SourceType
  domain: string
  url: string
  authorityScore: number
  status: SourceStatus
  region: string
  description: string
  ifcnSignatory?: boolean
}

export type EvidenceStance = 'supports' | 'contradicts' | 'context'

export interface Evidence {
  id: string
  sourceId: string
  sourceName: string
  sourceType: SourceType
  title: string
  url: string
  publishedAt: string
  relevance: number
  authority: number
  stance: EvidenceStance
  snippet: string
  claimIds: string[]
}

export interface SubClaim {
  id: string
  text: string
  verdict: Verdict
}

export interface Claim {
  id: string
  text: string
  kind: 'factual' | 'numerical' | 'temporal' | 'eligibility' | 'health' | 'attribution'
  verdict: Verdict
  confidence: number
  rationale: string
  subClaims: SubClaim[]
  evidenceIds: string[]
}

export type PiiType = 'NAME' | 'PHONE' | 'EMAIL' | 'AADHAAR' | 'PAN' | 'UPI' | 'CARD'

export interface PiiEntity {
  type: PiiType
  start: number
  end: number
  replacement: string
}

export interface PrivacyScan {
  entities: PiiEntity[]
  redactedText: string
  counts: Partial<Record<PiiType, number>>
  totalProtected: number
  rawMediaDeleted: boolean
  retention: string
}

export interface ExtractedMedia {
  inputType: InputType
  fileName?: string
  fileSizeBytes?: number
  mimeType?: string
  ocrText?: string
  transcript?: string
  durationSec?: number
  pageCount?: number
  pageTitle?: string
  domain?: string
  url?: string
  domainTrusted?: boolean
  detectedLanguage: Language
  languageConfidence: number
}

export type SummaryStepKey =
  | 'claim_identified'
  | 'evidence_retrieved'
  | 'sources_compared'
  | 'contradictions_checked'
  | 'dates_checked'
  | 'verdict_assigned'

export interface SummaryStep {
  key: SummaryStepKey
  title: string
  detail: string
}

export type ProviderMode = 'demo' | 'live' | 'skipped'

export interface ProviderTrace {
  stage: string
  provider: string
  mode: ProviderMode
}

export type MisinformationCategory =
  | 'Government schemes'
  | 'Health'
  | 'Finance & banking'
  | 'Technology'
  | 'Science'
  | 'Civic & safety'
  | 'Other'

export interface VerificationResult {
  id: string
  createdAt: string
  mode: VerificationMode
  inputType: InputType
  inputPreview: string
  media: ExtractedMedia
  privacy: PrivacyScan
  verdict: Verdict
  confidence: number
  headline: Localized
  summary: Localized
  claims: Claim[]
  evidence: Evidence[]
  steps: SummaryStep[]
  category: MisinformationCategory
  providers: ProviderTrace[]
  processingMs: number
}

export type JobStage =
  | 'received'
  | 'language'
  | 'privacy'
  | 'claims'
  | 'retrieval'
  | 'comparison'
  | 'verdict'

export interface VerificationJob {
  id: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  stage: JobStage
  inputType: InputType
  createdAt: string
  resultId?: string
  error?: string
}

export interface VerifyResponse {
  job: VerificationJob
  result: VerificationResult
}

export interface ApiError {
  error: string
  code?: string
}
