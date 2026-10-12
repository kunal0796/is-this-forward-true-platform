'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Image as ImageIcon,
  Mic,
  FileCheck,
  Link2,
  Upload,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  FileUp,
  Volume2,
  CheckCircle2,
  RefreshCw,
  Search,
} from 'lucide-react'
import { PageShell, DemoBadge } from '@/components/kit/primitives'
import { PipelineStepper } from '@/components/verdict/pipeline-stepper'
import { DEMO_SCENARIOS } from '@/lib/verification/demo/scenarios'
import { detectPii } from '@/lib/verification/pii'
import { cn } from '@/lib/utils'

type TabType = 'text' | 'image' | 'voice' | 'pdf' | 'url'

export default function VerifyPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('text')

  // Inputs
  const [textInput, setTextInput] = useState('')
  const [imageFile, setImageFile] = useState<{ name: string; preview: string; ocr: string } | null>(null)
  const [audioFile, setAudioFile] = useState<{ name: string; transcript: string; lang: string } | null>(null)
  const [pdfFile, setPdfFile] = useState<{ name: string; pages: number; claims: string[] } | null>(null)
  const [urlInput, setUrlInput] = useState('')

  // Submission pipeline state
  const [isVerifying, setIsVerifying] = useState(false)
  const [currentPipelineStage, setCurrentPipelineStage] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load a demo scenario into text tab
  const handleLoadPreset = (key: string) => {
    const s = DEMO_SCENARIOS.find((item) => item.key === key)
    if (s) {
      setTextInput(s.sampleText)
      setError(null)
    }
  }

  // Pre-configured multimodal mock assets
  const handleSelectMockImage = (scenarioKey: string) => {
    const s = DEMO_SCENARIOS.find((item) => item.key === scenarioKey) || DEMO_SCENARIOS[0]
    setImageFile({
      name: `${s.key}-whatsapp-screenshot.png`,
      preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
      ocr: s.sampleText,
    })
    setError(null)
  }

  const handleSelectMockAudio = (scenarioKey: string) => {
    const s = DEMO_SCENARIOS.find((item) => item.key === scenarioKey) || DEMO_SCENARIOS[1]
    setAudioFile({
      name: `${s.key}-voice-note.m4a`,
      transcript: s.sampleText,
      lang: s.key === 'note2000' ? 'Marathi (मराठी)' : 'Hindi (हिंदी)',
    })
    setError(null)
  }

  const handleSelectMockPdf = (scenarioKey: string) => {
    const s = DEMO_SCENARIOS.find((item) => item.key === scenarioKey) || DEMO_SCENARIOS[0]
    setPdfFile({
      name: `circular-${s.key}-official-gazette.pdf`,
      pages: 4,
      claims: s.claims.map((c) => c.text),
    })
    setError(null)
  }

  // Trigger submission and animated pipeline
  const handleSubmit = async () => {
    let targetScenarioKey = 'laptop'
    let inputTypeKey = activeTab

    if (activeTab === 'text') {
      if (!textInput.trim() || textInput.trim().length < 8) {
        setError('Please paste or enter a WhatsApp message (at least 8 characters).')
        return
      }
      const lower = textInput.toLowerCase()
      const found = DEMO_SCENARIOS.find((s) => s.keywords.some((k) => lower.includes(k.toLowerCase())))
      if (found) targetScenarioKey = found.key
    } else if (activeTab === 'image') {
      if (!imageFile) {
        setError('Please select or upload a screenshot.')
        return
      }
      targetScenarioKey = imageFile.name.includes('ticks') ? 'ticks' : 'laptop'
    } else if (activeTab === 'voice') {
      if (!audioFile) {
        setError('Please select or record a voice note.')
        return
      }
      targetScenarioKey = audioFile.name.includes('note2000') ? 'note2000' : 'hotwater'
    } else if (activeTab === 'pdf') {
      if (!pdfFile) {
        setError('Please select or upload an official PDF.')
        return
      }
      targetScenarioKey = 'laptop'
    } else if (activeTab === 'url') {
      if (!urlInput.trim()) {
        setError('Please enter a website link or portal URL.')
        return
      }
      targetScenarioKey = 'laptop'
    }

    setError(null)
    setIsVerifying(true)
    setCurrentPipelineStage(0)

    // Animated progression through 7 pipeline stages
    const stages = [0, 1, 2, 3, 4, 5, 6]
    for (const st of stages) {
      setCurrentPipelineStage(st)
      await new Promise((resolve) => setTimeout(resolve, 380))
    }

    // Transition to the result page
    const resultId = `demo-${inputTypeKey}-${targetScenarioKey}-001`
    router.push(`/result/${resultId}`)
  }

  return (
    <div className="relative pb-24 pt-8 md:pt-12">
      <PageShell>
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 mb-2">
            <DemoBadge />
            <span className="font-mono text-xs text-muted-foreground">• Multimodal Verification Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Check a WhatsApp Forward
          </h1>
          <p className="mt-2 text-base text-muted-foreground leading-relaxed">
            Submit text forwards, screenshots, voice notes, PDFs, or links. All personal information like phone numbers and names are scrubbed before verification.
          </p>
        </div>

        {/* If currently in pipeline mode, show animated pipeline */}
        {isVerifying ? (
          <div className="max-w-2xl mx-auto my-12 animate-in fade-in duration-300">
            <PipelineStepper
              currentStageIndex={currentPipelineStage}
              detectedLang={activeTab === 'voice' ? 'Hindi / Marathi' : 'English / Hindi'}
              protectedCount={3}
              redactedPreview={
                textInput
                  ? textInput.slice(0, 120) + '...'
                  : 'Zero-Knowledge Client Scrubber sanitized all entities.'
              }
            />
          </div>
        ) : (
          /* Main Input Tabs */
          <div className="rounded-3xl border border-border/80 bg-surface p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            {/* Tab navigation */}
            <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-4 mb-6">
              {[
                { id: 'text', label: 'TEXT', icon: FileText, desc: 'WhatsApp Message' },
                { id: 'image', label: 'IMAGE', icon: ImageIcon, desc: 'Screenshot / Photo' },
                { id: 'voice', label: 'VOICE', icon: Mic, desc: 'Audio Note' },
                { id: 'pdf', label: 'PDF', icon: FileCheck, desc: 'Circular / Gazette' },
                { id: 'url', label: 'URL', icon: Link2, desc: 'Website Link' },
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id as TabType)
                      setError(null)
                    }}
                    className={cn(
                      'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all',
                      isActive
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'bg-surface-2 text-muted-foreground hover:text-foreground hover:bg-surface-2/80'
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Error banner if any */}
            {error && (
              <div className="mb-6 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 text-xs text-rose-300">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* TAB 1: TEXT */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor="text-input" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Paste WhatsApp Message Forward
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-muted-foreground mr-1">Load Demo:</span>
                    {DEMO_SCENARIOS.map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => handleLoadPreset(s.key)}
                        className="rounded-md border border-border/70 bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-foreground hover:border-primary/50"
                      >
                        {s.sampleLabel}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  id="text-input"
                  rows={6}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste the message exactly as received in WhatsApp (e.g. 'GOOD NEWS for students! The Government is giving FREE LAPTOPS under PM Free Laptop Yojana...')"
                  className="w-full rounded-2xl border border-border/80 bg-black/40 p-4 text-sm font-sans text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                />

                <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="size-3.5" />
                    Automatic PII filter active (names, numbers, emails)
                  </span>
                  <span>{textInput.length} characters</span>
                </div>
              </div>
            )}

            {/* TAB 2: IMAGE */}
            {activeTab === 'image' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Screenshot / Image OCR Scanner
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground mr-1">Try Demo Screenshot:</span>
                    <button
                      type="button"
                      onClick={() => handleSelectMockImage('laptop')}
                      className="rounded-md border border-border/70 bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-foreground hover:border-primary/50"
                    >
                      Laptop Yojana Forward
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectMockImage('ticks')}
                      className="rounded-md border border-border/70 bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-foreground hover:border-primary/50"
                    >
                      3 Blue Ticks Claim
                    </button>
                  </div>
                </div>

                {/* Upload drag drop zone */}
                <div
                  onClick={() => handleSelectMockImage('laptop')}
                  className="cursor-pointer rounded-2xl border-2 border-dashed border-border/80 bg-surface-2/30 p-8 text-center hover:border-primary/50 hover:bg-surface-2/50 transition-all"
                >
                  <FileUp className="size-10 text-primary mx-auto mb-3" />
                  <p className="text-sm font-semibold text-foreground">
                    Click to browse or drop WhatsApp screenshot here
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports PNG, JPG, WebP (up to 4MB). Privacy filter deletes raw image immediately after OCR.
                  </p>
                </div>

                {imageFile && (
                  <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-4 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sky-400 font-mono text-[11px] uppercase">
                        ✓ OCR Text Extracted Successfully
                      </span>
                      <span className="text-muted-foreground font-mono">{imageFile.name}</span>
                    </div>
                    <p className="font-mono text-foreground/90 italic leading-relaxed">
                      “{imageFile.ocr}”
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: VOICE */}
            {activeTab === 'voice' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Voice Note Audio Transcriber
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground mr-1">Try Demo Audio:</span>
                    <button
                      type="button"
                      onClick={() => handleSelectMockAudio('note2000')}
                      className="rounded-md border border-border/70 bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-foreground hover:border-primary/50"
                    >
                      Marathi ₹2000 Note Note
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectMockAudio('hotwater')}
                      className="rounded-md border border-border/70 bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-foreground hover:border-primary/50"
                    >
                      Hot Water Cure Note
                    </button>
                  </div>
                </div>

                <div
                  onClick={() => handleSelectMockAudio('note2000')}
                  className="cursor-pointer rounded-2xl border-2 border-dashed border-border/80 bg-surface-2/30 p-8 text-center hover:border-primary/50 hover:bg-surface-2/50 transition-all"
                >
                  <Mic className="size-10 text-emerald-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-foreground">
                    Upload forwarded WhatsApp voice note (.opus, .m4a, .mp3)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Automatic multi-accent transcription for Indian languages (Hindi, Marathi, English).
                  </p>
                </div>

                {audioFile && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 font-mono text-[11px] uppercase flex items-center gap-1.5">
                        <Volume2 className="size-3.5" />
                        Whisper Audio Transcription ({audioFile.lang})
                      </span>
                      <span className="text-muted-foreground font-mono">{audioFile.name}</span>
                    </div>
                    {/* Simulated Waveform bars */}
                    <div className="flex items-center gap-1 h-8 px-2 py-1 bg-black/40 rounded-lg">
                      {[40, 70, 25, 90, 60, 30, 85, 45, 95, 65, 35, 80, 50, 70, 30, 60, 85, 40, 75, 55].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-emerald-500/60 rounded-full"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                    <p className="font-mono text-foreground/90 leading-relaxed italic">
                      “{audioFile.transcript}”
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: PDF */}
            {activeTab === 'pdf' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Official Gazette / Circular PDF Verifier
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground mr-1">Try Demo PDF:</span>
                    <button
                      type="button"
                      onClick={() => handleSelectMockPdf('laptop')}
                      className="rounded-md border border-border/70 bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-foreground hover:border-primary/50"
                    >
                      Gazette Circular (4 pages)
                    </button>
                  </div>
                </div>

                <div
                  onClick={() => handleSelectMockPdf('laptop')}
                  className="cursor-pointer rounded-2xl border-2 border-dashed border-border/80 bg-surface-2/30 p-8 text-center hover:border-primary/50 hover:bg-surface-2/50 transition-all"
                >
                  <FileCheck className="size-10 text-primary mx-auto mb-3" />
                  <p className="text-sm font-semibold text-foreground">
                    Drop downloaded PDF notice or circular here
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Detects spoofed letterheads, forged signatures, and verifies against official gazettes.
                  </p>
                </div>

                {pdfFile && (
                  <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-primary font-mono text-[11px] uppercase">
                        ✓ Extracted {pdfFile.pages} Pages from {pdfFile.name}
                      </span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-foreground/80 font-mono">
                      {pdfFile.claims.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: URL */}
            {activeTab === 'url' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Link / Portal Domain Authenticity Check
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground mr-1">Try Demo Links:</span>
                    <button
                      type="button"
                      onClick={() => setUrlInput('https://pm-free-laptop-yojana2026.online')}
                      className="rounded-md border border-border/70 bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-foreground hover:border-primary/50"
                    >
                      Phishing Portal
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrlInput('https://pib.gov.in/PressReleasePage.aspx')}
                      className="rounded-md border border-border/70 bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-foreground hover:border-primary/50"
                    >
                      PIB Press Release
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Link2 className="size-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/forwarded-link"
                    className="w-full rounded-2xl border border-border/80 bg-black/40 pl-11 pr-4 py-3.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  We check DNS registration age, domain typosquatting (.online vs .gov.in), and malware reputation against trusted registries.
                </p>
              </div>
            )}

            {/* Bottom Submit Action */}
            <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span>Deterministic Demo Verification Engine • No API Key required</span>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-primary/25 hover:bg-blue-600 transition-all active:scale-[0.98]"
              >
                <span>Verify Now</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </PageShell>
    </div>
  )
}
