import type { Language } from '@/lib/verification/types'

const en = {
  nav: {
    verify: 'Verify',
    how: 'How it works',
    sources: 'Sources',
    privacy: 'Privacy',
    whatsapp: 'WhatsApp demo',
    dashboard: 'Dashboard',
  },
  cta: 'Check a Forward',
  hero: {
    eyebrow: 'Multimodal fact-checking for India',
    title: 'Before you forward it, check it.',
    subtitle: 'AI-powered fact checking for the messages people actually receive.',
    secondary: 'Try it on WhatsApp',
  },
  modalities: { text: 'Text', image: 'Screenshots', audio: 'Voice notes', pdf: 'PDFs', url: 'Links' },
  verify: {
    title: 'Check a forward',
    subtitle: 'Paste a message or upload what you received. Personal details are scrubbed before any analysis.',
    tabs: { text: 'Text', image: 'Image', audio: 'Voice', pdf: 'PDF', url: 'URL' },
    submit: 'Verify now',
    checking: 'Checking…',
  },
  result: {
    confidence: 'Confidence',
    claims: 'Claim breakdown',
    supporting: 'Supporting evidence',
    contradicting: 'Contradicting evidence',
    why: 'Why did we decide this?',
    sources: 'Source trust scores',
    translated: 'Read this verdict in',
    checkAnother: 'Check another',
  },
  demo: 'DEMO VERIFICATION',
  language: 'Language',
}

export type Dictionary = typeof en

const hi: Dictionary = {
  nav: {
    verify: 'जाँचें',
    how: 'यह कैसे काम करता है',
    sources: 'स्रोत',
    privacy: 'गोपनीयता',
    whatsapp: 'व्हाट्सऐप डेमो',
    dashboard: 'डैशबोर्ड',
  },
  cta: 'फ़ॉरवर्ड जाँचें',
  hero: {
    eyebrow: 'भारत के लिए मल्टीमोडल फ़ैक्ट-चेकिंग',
    title: 'फ़ॉरवर्ड करने से पहले, जाँच लें।',
    subtitle: 'उन संदेशों के लिए AI फ़ैक्ट-चेकिंग जो लोगों को सच में मिलते हैं।',
    secondary: 'व्हाट्सऐप पर आज़माएँ',
  },
  modalities: { text: 'टेक्स्ट', image: 'स्क्रीनशॉट', audio: 'वॉइस नोट', pdf: 'PDF', url: 'लिंक' },
  verify: {
    title: 'फ़ॉरवर्ड जाँचें',
    subtitle: 'संदेश पेस्ट करें या जो मिला उसे अपलोड करें। विश्लेषण से पहले निजी जानकारी हटा दी जाती है।',
    tabs: { text: 'टेक्स्ट', image: 'इमेज', audio: 'वॉइस', pdf: 'PDF', url: 'URL' },
    submit: 'अभी जाँचें',
    checking: 'जाँच जारी…',
  },
  result: {
    confidence: 'विश्वास स्तर',
    claims: 'दावों का विवरण',
    supporting: 'समर्थन करने वाले साक्ष्य',
    contradicting: 'खंडन करने वाले साक्ष्य',
    why: 'हमने यह निर्णय क्यों लिया?',
    sources: 'स्रोत विश्वसनीयता',
    translated: 'यह निर्णय पढ़ें',
    checkAnother: 'दूसरा जाँचें',
  },
  demo: 'डेमो सत्यापन',
  language: 'भाषा',
}

const mr: Dictionary = {
  nav: {
    verify: 'तपासा',
    how: 'हे कसे काम करते',
    sources: 'स्रोत',
    privacy: 'गोपनीयता',
    whatsapp: 'व्हॉट्सॲप डेमो',
    dashboard: 'डॅशबोर्ड',
  },
  cta: 'फॉरवर्ड तपासा',
  hero: {
    eyebrow: 'भारतासाठी मल्टीमोडल फॅक्ट-चेकिंग',
    title: 'फॉरवर्ड करण्यापूर्वी, तपासा.',
    subtitle: 'लोकांना खरोखर येणाऱ्या संदेशांसाठी AI फॅक्ट-चेकिंग.',
    secondary: 'व्हॉट्सॲपवर वापरून पहा',
  },
  modalities: { text: 'मजकूर', image: 'स्क्रीनशॉट', audio: 'व्हॉइस नोट', pdf: 'PDF', url: 'लिंक' },
  verify: {
    title: 'फॉरवर्ड तपासा',
    subtitle: 'संदेश पेस्ट करा किंवा आलेले अपलोड करा. विश्लेषणापूर्वी वैयक्तिक माहिती काढून टाकली जाते.',
    tabs: { text: 'मजकूर', image: 'इमेज', audio: 'व्हॉइस', pdf: 'PDF', url: 'URL' },
    submit: 'आता तपासा',
    checking: 'तपासणी सुरू…',
  },
  result: {
    confidence: 'विश्वास पातळी',
    claims: 'दाव्यांचे विश्लेषण',
    supporting: 'समर्थन करणारे पुरावे',
    contradicting: 'खंडन करणारे पुरावे',
    why: 'आम्ही हा निर्णय का घेतला?',
    sources: 'स्रोत विश्वासार्हता',
    translated: 'हा निर्णय वाचा',
    checkAnother: 'दुसरे तपासा',
  },
  demo: 'डेमो सत्यापन',
  language: 'भाषा',
}

export const DICTIONARIES: Record<Language, Dictionary> = { en, hi, mr }

export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'EN' },
  { code: 'hi', label: 'हिन्दी', native: 'हि' },
  { code: 'mr', label: 'मराठी', native: 'म' },
]
