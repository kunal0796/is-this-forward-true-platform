import { getSource } from '../sources'
import type {
  Claim,
  Evidence,
  EvidenceStance,
  Localized,
  MisinformationCategory,
  SummaryStep,
  Verdict,
} from '../types'

/**
 * Pre-authored, deterministic demo scenarios. Evidence here paraphrases publicly available
 * information for illustration only and is never presented as a live retrieval result.
 */
export interface DemoScenario {
  key: string
  keywords: string[]
  category: MisinformationCategory
  verdict: Verdict
  confidence: number
  sampleText: string
  sampleLabel: string
  headline: Localized
  summary: Localized
  claims: Claim[]
  evidence: Evidence[]
  steps: SummaryStep[]
}

function ev(
  id: string,
  sourceId: string,
  stance: EvidenceStance,
  data: { title: string; url: string; publishedAt: string; relevance: number; snippet: string; claimIds: string[] },
): Evidence {
  const source = getSource(sourceId)
  if (!source) throw new Error(`Unknown source ${sourceId}`)
  return {
    id,
    sourceId,
    sourceName: source.name,
    sourceType: source.type,
    authority: source.authorityScore,
    stance,
    ...data,
  }
}

const laptop: DemoScenario = {
  key: 'laptop',
  keywords: ['laptop', 'लैपटॉप', 'लॅपटॉप'],
  category: 'Government schemes',
  verdict: 'PARTLY_SUPPORTED',
  confidence: 86,
  sampleLabel: 'Free laptop scheme',
  sampleText:
    'GOOD NEWS for students! The Government is giving FREE LAPTOPS to EVERY college student under the PM Free Laptop Yojana 2026. Register before 31 October using the link below. Forward to every student group! Hi Rahul, call me on 9876543210 if the link does not open.',
  headline: {
    en: 'Real initiative, exaggerated eligibility',
    hi: 'असली पहल, लेकिन पात्रता बढ़ा-चढ़ाकर बताई गई',
    mr: 'खरी योजना, पण पात्रता अतिशयोक्त',
  },
  summary: {
    en: 'Parts of this message are based on a real initiative, but the claim that every college student is eligible is not supported by the available evidence.',
    hi: 'इस संदेश के कुछ हिस्से एक वास्तविक पहल पर आधारित हैं, लेकिन यह दावा कि हर कॉलेज छात्र पात्र है, उपलब्ध साक्ष्यों से समर्थित नहीं है।',
    mr: 'या संदेशातील काही भाग खऱ्या उपक्रमावर आधारित आहेत, परंतु प्रत्येक महाविद्यालयीन विद्यार्थी पात्र आहे हा दावा उपलब्ध पुराव्यांनी समर्थित नाही.',
  },
  claims: [
    {
      id: 'c1',
      text: 'A government programme provides free laptops to students.',
      kind: 'factual',
      verdict: 'VERIFIED',
      confidence: 81,
      rationale:
        'State-level laptop distribution schemes for students exist, typically tied to merit or income criteria.',
      subClaims: [
        { id: 'c1a', text: 'Laptop schemes for students exist in India', verdict: 'VERIFIED' },
        { id: 'c1b', text: 'The scheme is a central “PM Free Laptop Yojana 2026”', verdict: 'FALSE' },
      ],
      evidenceIds: ['e1', 'e3'],
    },
    {
      id: 'c2',
      text: 'Every college student is eligible.',
      kind: 'eligibility',
      verdict: 'FALSE',
      confidence: 90,
      rationale:
        'Published criteria restrict eligibility by marks, income, domicile or enrolment year. No universal entitlement was found.',
      subClaims: [
        { id: 'c2a', text: 'No merit criteria apply', verdict: 'FALSE' },
        { id: 'c2b', text: 'No income or domicile limits apply', verdict: 'FALSE' },
      ],
      evidenceIds: ['e2', 'e3', 'e4'],
    },
    {
      id: 'c3',
      text: 'Registration closes on 31 October via the forwarded link.',
      kind: 'temporal',
      verdict: 'CANNOT_CONFIRM',
      confidence: 64,
      rationale:
        'No official portal lists this deadline. Government schemes are registered through .gov.in portals, not shortened links.',
      subClaims: [],
      evidenceIds: ['e4'],
    },
  ],
  evidence: [
    ev('e1', 'maha-gov', 'supports', {
      title: 'Merit-based laptop assistance for higher-education students (illustrative state notification)',
      url: 'https://www.maharashtra.gov.in',
      publishedAt: '2026-06-14',
      relevance: 88,
      snippet:
        'Laptop assistance will be extended to eligible students enrolled in recognised institutions who meet the prescribed merit and family-income criteria.',
      claimIds: ['c1'],
    }),
    ev('e2', 'pib', 'contradicts', {
      title: 'PIB Fact Check: Claim of free laptops for all students under a central scheme is fake',
      url: 'https://x.com/PIBFactCheck',
      publishedAt: '2026-07-02',
      relevance: 94,
      snippet:
        'A message claiming the Government of India is providing free laptops to all students is fake. No such scheme is being run by the central government.',
      claimIds: ['c1', 'c2'],
    }),
    ev('e3', 'myscheme', 'contradicts', {
      title: 'Scheme search: student laptop schemes list merit and income conditions',
      url: 'https://www.myscheme.gov.in/search',
      publishedAt: '2026-08-20',
      relevance: 79,
      snippet:
        'Listed laptop schemes specify eligibility such as minimum marks in qualifying examinations, annual family income ceilings and state domicile.',
      claimIds: ['c2'],
    }),
    ev('e4', 'boomlive', 'contradicts', {
      title: 'Viral “free laptop” registration links lead to data-harvesting pages',
      url: 'https://www.boomlive.in/fact-check',
      publishedAt: '2026-05-11',
      relevance: 72,
      snippet:
        'Links circulating with free-laptop messages ask for phone numbers and personal details and are not affiliated with any government portal.',
      claimIds: ['c2', 'c3'],
    }),
  ],
  steps: [
    { key: 'claim_identified', title: 'Claim identified', detail: '3 checkable claims: scheme existence, eligibility, registration deadline.' },
    { key: 'evidence_retrieved', title: 'Evidence retrieved', detail: '4 documents from government portals and IFCN fact-checkers.' },
    { key: 'sources_compared', title: 'Sources compared', detail: 'Scheme existence supported; universal eligibility contradicted by 3 sources.' },
    { key: 'contradictions_checked', title: 'Contradictions checked', detail: 'PIB explicitly denies a central “free laptop for all” scheme.' },
    { key: 'dates_checked', title: 'Dates checked', detail: 'All evidence published within the last 6 months.' },
    { key: 'verdict_assigned', title: 'Verdict assigned', detail: 'Mixed claim outcomes resolve to Partly supported.' },
  ],
}

const note2000: DemoScenario = {
  key: 'note2000',
  keywords: ['₹2000', 'rs 2000', 'rs. 2000', '2000 note', '2000 rupee', '₹२०००', '2000 च्या', '2000 के नोट'],
  category: 'Finance & banking',
  verdict: 'OUTDATED',
  confidence: 91,
  sampleLabel: '₹2000 note deadline',
  sampleText:
    'URGENT: RBI has announced that ₹2000 notes are being withdrawn. The LAST DATE to exchange them at your bank is 30 September 2023. After that the notes will become worthless paper! Share with family now.',
  headline: {
    en: 'Real announcement, expired deadline',
    hi: 'असली घोषणा, लेकिन समय-सीमा बीत चुकी है',
    mr: 'खरी घोषणा, पण मुदत संपली आहे',
  },
  summary: {
    en: 'RBI did announce the withdrawal of ₹2000 notes in May 2023, but the bank deadline in this message passed long ago and the notes were never declared worthless.',
    hi: 'RBI ने मई 2023 में ₹2000 के नोट वापस लेने की घोषणा की थी, लेकिन इस संदेश में दी गई बैंक की समय-सीमा बहुत पहले बीत चुकी है और नोटों को कभी बेकार घोषित नहीं किया गया।',
    mr: 'RBI ने मे 2023 मध्ये ₹2000 च्या नोटा मागे घेण्याची घोषणा केली होती, परंतु या संदेशातील बँकेची मुदत खूप आधीच संपली आहे आणि नोटा कधीही निरुपयोगी घोषित केल्या नाहीत.',
  },
  claims: [
    {
      id: 'c1',
      text: 'RBI announced the withdrawal of ₹2000 notes.',
      kind: 'attribution',
      verdict: 'VERIFIED',
      confidence: 98,
      rationale: 'RBI announced the withdrawal from circulation on 19 May 2023.',
      subClaims: [],
      evidenceIds: ['e1'],
    },
    {
      id: 'c2',
      text: 'The last date to exchange at banks is 30 September 2023.',
      kind: 'temporal',
      verdict: 'OUTDATED',
      confidence: 93,
      rationale:
        'The bank deadline was extended to 7 October 2023. Since then, exchange has only been possible at RBI Issue Offices.',
      subClaims: [
        { id: 'c2a', text: 'Original deadline was 30 September 2023', verdict: 'VERIFIED' },
        { id: 'c2b', text: 'Deadline is still current', verdict: 'OUTDATED' },
      ],
      evidenceIds: ['e1', 'e2'],
    },
    {
      id: 'c3',
      text: 'After the deadline, the notes become worthless.',
      kind: 'factual',
      verdict: 'FALSE',
      confidence: 92,
      rationale: 'RBI stated that ₹2000 banknotes continue to be legal tender.',
      subClaims: [],
      evidenceIds: ['e2', 'e3'],
    },
  ],
  evidence: [
    ev('e1', 'rbi', 'supports', {
      title: '₹2000 denomination banknotes – withdrawal from circulation; will continue as legal tender',
      url: 'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx',
      publishedAt: '2023-05-19',
      relevance: 96,
      snippet:
        'The ₹2000 denomination banknotes are being withdrawn from circulation. They will continue to be legal tender. Members of the public may deposit or exchange them at bank branches.',
      claimIds: ['c1', 'c2'],
    }),
    ev('e2', 'rbi', 'contradicts', {
      title: 'Withdrawal of ₹2000 banknotes – review of the special arrangement',
      url: 'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx',
      publishedAt: '2023-09-30',
      relevance: 92,
      snippet:
        'The special arrangement for deposit or exchange at bank branches is extended until 7 October 2023. Thereafter, exchange facility will be available at the 19 RBI Issue Offices.',
      claimIds: ['c2', 'c3'],
    }),
    ev('e3', 'pti', 'contradicts', {
      title: '₹2000 notes remain legal tender; exchange continues at RBI offices',
      url: 'https://www.ptinews.com',
      publishedAt: '2025-01-02',
      relevance: 78,
      snippet:
        'Notes of ₹2000 continue to be legal tender, and individuals can still exchange or deposit them through RBI Issue Offices or via India Post.',
      claimIds: ['c3'],
    }),
  ],
  steps: [
    { key: 'claim_identified', title: 'Claim identified', detail: '3 claims: announcement, deadline, legal-tender status.' },
    { key: 'evidence_retrieved', title: 'Evidence retrieved', detail: '2 RBI press releases and 1 news agency report.' },
    { key: 'sources_compared', title: 'Sources compared', detail: 'Primary regulator source outweighs secondary reports.' },
    { key: 'contradictions_checked', title: 'Contradictions checked', detail: '“Worthless” directly contradicts RBI’s legal-tender statement.' },
    { key: 'dates_checked', title: 'Dates checked', detail: 'Message deadline (30 Sep 2023) superseded by a later RBI notice.' },
    { key: 'verdict_assigned', title: 'Verdict assigned', detail: 'Core fact was true at the time but is now superseded: Outdated.' },
  ],
}

const hotwater: DemoScenario = {
  key: 'hotwater',
  keywords: ['lemon', 'नींबू', 'लिंबू', 'hot water', 'गर्म पानी', 'गरम पाणी'],
  category: 'Health',
  verdict: 'FALSE',
  confidence: 94,
  sampleLabel: 'Hot water cure (Hindi)',
  sampleText:
    'गर्म पानी में नींबू डालकर पीने से कोरोना वायरस और कैंसर दोनों खत्म हो जाते हैं। डॉक्टर यह बात नहीं बताएंगे। सभी को भेजें।',
  headline: {
    en: 'No evidence this cures COVID-19 or cancer',
    hi: 'इससे कोविड-19 या कैंसर ठीक होने का कोई प्रमाण नहीं',
    mr: 'यामुळे कोविड-19 किंवा कर्करोग बरा होतो याचा कोणताही पुरावा नाही',
  },
  summary: {
    en: 'Drinking hot water with lemon does not cure or prevent COVID-19 or cancer. Health authorities explicitly list this as a myth.',
    hi: 'गर्म पानी में नींबू पीने से कोविड-19 या कैंसर न तो ठीक होता है और न ही रुकता है। स्वास्थ्य प्राधिकरण इसे स्पष्ट रूप से एक मिथक बताते हैं।',
    mr: 'गरम पाण्यात लिंबू पिल्याने कोविड-19 किंवा कर्करोग बरा होत नाही किंवा टळत नाही. आरोग्य संस्था याला स्पष्टपणे गैरसमज म्हणतात.',
  },
  claims: [
    {
      id: 'c1',
      text: 'Hot water with lemon kills the coronavirus.',
      kind: 'health',
      verdict: 'FALSE',
      confidence: 95,
      rationale: 'WHO mythbusters state hot drinks and home remedies do not prevent or cure COVID-19.',
      subClaims: [],
      evidenceIds: ['e1', 'e3'],
    },
    {
      id: 'c2',
      text: 'Hot water with lemon cures cancer.',
      kind: 'health',
      verdict: 'FALSE',
      confidence: 93,
      rationale: 'Cancer treatment requires medical care. No authority recognises lemon water as a cure.',
      subClaims: [],
      evidenceIds: ['e2'],
    },
    {
      id: 'c3',
      text: 'Doctors are hiding this remedy.',
      kind: 'attribution',
      verdict: 'CANNOT_CONFIRM',
      confidence: 70,
      rationale: 'A conspiracy framing that cannot be tested, flagged as a common manipulation pattern.',
      subClaims: [],
      evidenceIds: [],
    },
  ],
  evidence: [
    ev('e1', 'who', 'contradicts', {
      title: 'Coronavirus disease (COVID-19) advice for the public: Mythbusters',
      url: 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public/myth-busters',
      publishedAt: '2022-01-19',
      relevance: 95,
      snippet:
        'There is no evidence that home remedies, hot drinks or specific foods protect against or cure COVID-19.',
      claimIds: ['c1'],
    }),
    ev('e2', 'who', 'contradicts', {
      title: 'Cancer fact sheet',
      url: 'https://www.who.int/news-room/fact-sheets/detail/cancer',
      publishedAt: '2025-02-03',
      relevance: 81,
      snippet:
        'Effective cancer treatment depends on accurate diagnosis and may include surgery, radiotherapy and systemic therapy.',
      claimIds: ['c2'],
    }),
    ev('e3', 'pib', 'contradicts', {
      title: 'PIB Fact Check: Hot lemon water does not cure coronavirus',
      url: 'https://x.com/PIBFactCheck',
      publishedAt: '2023-03-08',
      relevance: 90,
      snippet:
        'Claim: drinking hot water with lemon kills the virus. This claim is misleading. There is no scientific evidence for it.',
      claimIds: ['c1'],
    }),
  ],
  steps: [
    { key: 'claim_identified', title: 'Claim identified', detail: 'Hindi voice note transcribed; 3 claims extracted.' },
    { key: 'evidence_retrieved', title: 'Evidence retrieved', detail: '3 documents from WHO and PIB Fact Check.' },
    { key: 'sources_compared', title: 'Sources compared', detail: 'All authoritative sources contradict the cure claims.' },
    { key: 'contradictions_checked', title: 'Contradictions checked', detail: 'No supporting evidence found from any trusted source.' },
    { key: 'dates_checked', title: 'Dates checked', detail: 'Guidance remains current; no newer reversal found.' },
    { key: 'verdict_assigned', title: 'Verdict assigned', detail: 'Core health claims contradicted: False.' },
  ],
}

const ticks: DemoScenario = {
  key: 'ticks',
  keywords: ['blue tick', 'red tick', 'calls will be recorded', 'messages will be recorded', 'ब्लू टिक', 'लाल टिक'],
  category: 'Technology',
  verdict: 'FALSE',
  confidence: 96,
  sampleLabel: 'WhatsApp “3 blue ticks”',
  sampleText:
    'New WhatsApp rules from tomorrow: all calls and messages will be recorded by the government. 3 blue ticks = government has noted your message. 2 blue + 1 red tick = action will be taken against you. Do not send political messages!',
  headline: {
    en: 'A recycled hoax about WhatsApp monitoring',
    hi: 'व्हाट्सऐप निगरानी के बारे में पुराना झूठा संदेश',
    mr: 'व्हॉट्सअ‍ॅप देखरेखीबद्दलचा जुना खोटा संदेश',
  },
  summary: {
    en: 'There are no new rules under which the government records all WhatsApp calls and messages, and the tick colours described do not exist.',
    hi: 'ऐसे कोई नए नियम नहीं हैं जिनके तहत सरकार सभी व्हाट्सऐप कॉल और संदेश रिकॉर्ड करती है, और बताए गए टिक के रंग मौजूद नहीं हैं।',
    mr: 'सरकार सर्व व्हॉट्सअ‍ॅप कॉल आणि संदेश रेकॉर्ड करते असे कोणतेही नवीन नियम नाहीत, आणि सांगितलेले टिकचे रंग अस्तित्वात नाहीत.',
  },
  claims: [
    {
      id: 'c1',
      text: 'New rules mean the government records all WhatsApp calls and messages.',
      kind: 'factual',
      verdict: 'FALSE',
      confidence: 96,
      rationale: 'PIB Fact Check has repeatedly called this message fake.',
      subClaims: [],
      evidenceIds: ['e1', 'e2'],
    },
    {
      id: 'c2',
      text: 'Three blue ticks or a red tick indicate government action.',
      kind: 'factual',
      verdict: 'FALSE',
      confidence: 97,
      rationale: 'WhatsApp shows at most two ticks; no red tick exists.',
      subClaims: [
        { id: 'c2a', text: 'A third blue tick exists', verdict: 'FALSE' },
        { id: 'c2b', text: 'A red tick exists', verdict: 'FALSE' },
      ],
      evidenceIds: ['e2', 'e3'],
    },
  ],
  evidence: [
    ev('e1', 'pib', 'contradicts', {
      title: 'PIB Fact Check: Message about new WhatsApp communication rules is fake',
      url: 'https://x.com/PIBFactCheck',
      publishedAt: '2022-11-10',
      relevance: 97,
      snippet:
        'A message claiming new communication rules where all calls are recorded and ticks indicate government action is fake. The Government has not made any such rules.',
      claimIds: ['c1'],
    }),
    ev('e2', 'reuters', 'contradicts', {
      title: 'Fact Check: Indian government is not monitoring WhatsApp messages via tick marks',
      url: 'https://www.reuters.com/fact-check/',
      publishedAt: '2021-04-15',
      relevance: 88,
      snippet:
        'Posts claiming that three blue ticks mean the government has seen a message are false. The hoax has circulated in several versions since 2019.',
      claimIds: ['c1', 'c2'],
    }),
    ev('e3', 'afp-factcheck', 'contradicts', {
      title: 'Hoax about red tick and three blue ticks resurfaces',
      url: 'https://factcheck.afp.com/',
      publishedAt: '2024-02-21',
      relevance: 84,
      snippet: 'WhatsApp has never introduced a third tick or a red tick. The message is a recycled hoax.',
      claimIds: ['c2'],
    }),
  ],
  steps: [
    { key: 'claim_identified', title: 'Claim identified', detail: 'Screenshot text extracted via OCR; 2 claims found.' },
    { key: 'evidence_retrieved', title: 'Evidence retrieved', detail: '3 fact-checks from PIB, Reuters and AFP.' },
    { key: 'sources_compared', title: 'Sources compared', detail: 'Government and international fact-checkers agree.' },
    { key: 'contradictions_checked', title: 'Contradictions checked', detail: 'No source supports any part of the message.' },
    { key: 'dates_checked', title: 'Dates checked', detail: 'Hoax recurring since 2019; latest debunk 2024.' },
    { key: 'verdict_assigned', title: 'Verdict assigned', detail: 'All claims contradicted: False.' },
  ],
}

const chandrayaan: DemoScenario = {
  key: 'chandrayaan',
  keywords: ['chandrayaan', 'चंद्रयान', 'vikram', 'space day'],
  category: 'Science',
  verdict: 'VERIFIED',
  confidence: 97,
  sampleLabel: 'Chandrayaan-3 landing',
  sampleText:
    'Proud moment! ISRO’s Chandrayaan-3 Vikram lander touched down near the Moon’s south pole on 23 August 2023, making India the first country to land in that region. 23 August is now celebrated as National Space Day.',
  headline: {
    en: 'Accurate and consistent with ISRO records',
    hi: 'सही और इसरो के रिकॉर्ड के अनुरूप',
    mr: 'अचूक आणि इस्रोच्या नोंदींशी सुसंगत',
  },
  summary: {
    en: 'Chandrayaan-3 landed near the lunar south pole on 23 August 2023, and the date was declared National Space Day. The message is accurate.',
    hi: 'चंद्रयान-3 23 अगस्त 2023 को चंद्रमा के दक्षिणी ध्रुव के पास उतरा, और इस तारीख को राष्ट्रीय अंतरिक्ष दिवस घोषित किया गया। संदेश सही है।',
    mr: 'चंद्रयान-3 23 ऑगस्ट 2023 रोजी चंद्राच्या दक्षिण ध्रुवाजवळ उतरले आणि हा दिवस राष्ट्रीय अंतराळ दिन म्हणून घोषित करण्यात आला. संदेश अचूक आहे.',
  },
  claims: [
    {
      id: 'c1',
      text: 'Chandrayaan-3 landed near the lunar south pole on 23 August 2023.',
      kind: 'temporal',
      verdict: 'VERIFIED',
      confidence: 98,
      rationale: 'ISRO mission records confirm the date and landing region.',
      subClaims: [],
      evidenceIds: ['e1', 'e3'],
    },
    {
      id: 'c2',
      text: 'India was the first country to land in that region.',
      kind: 'factual',
      verdict: 'VERIFIED',
      confidence: 95,
      rationale: 'Independent reporting confirms it as the first soft landing near the lunar south pole.',
      subClaims: [],
      evidenceIds: ['e3'],
    },
    {
      id: 'c3',
      text: '23 August is National Space Day.',
      kind: 'attribution',
      verdict: 'VERIFIED',
      confidence: 96,
      rationale: 'Declared by the Government of India following the landing.',
      subClaims: [],
      evidenceIds: ['e2'],
    },
  ],
  evidence: [
    ev('e1', 'isro', 'supports', {
      title: 'Chandrayaan-3 mission: Vikram lander soft-landing',
      url: 'https://www.isro.gov.in/Chandrayaan3_Details.html',
      publishedAt: '2023-08-23',
      relevance: 97,
      snippet:
        'Chandrayaan-3 has successfully soft-landed on the Moon in the south polar region on 23 August 2023.',
      claimIds: ['c1'],
    }),
    ev('e2', 'pib', 'supports', {
      title: '23 August to be celebrated as National Space Day',
      url: 'https://pib.gov.in',
      publishedAt: '2023-08-26',
      relevance: 93,
      snippet: 'The day Chandrayaan-3 landed on the Moon, 23 August, will be celebrated as National Space Day.',
      claimIds: ['c3'],
    }),
    ev('e3', 'reuters', 'supports', {
      title: 'India lands spacecraft near Moon’s south pole, a first',
      url: 'https://www.reuters.com',
      publishedAt: '2023-08-23',
      relevance: 90,
      snippet: 'India became the first country to land a spacecraft near the Moon’s south pole.',
      claimIds: ['c1', 'c2'],
    }),
  ],
  steps: [
    { key: 'claim_identified', title: 'Claim identified', detail: '3 claims: landing date, first-ever, National Space Day.' },
    { key: 'evidence_retrieved', title: 'Evidence retrieved', detail: 'Primary source (ISRO) plus PIB and Reuters.' },
    { key: 'sources_compared', title: 'Sources compared', detail: 'All sources agree on dates and facts.' },
    { key: 'contradictions_checked', title: 'Contradictions checked', detail: 'No contradicting evidence found.' },
    { key: 'dates_checked', title: 'Dates checked', detail: '23 August 2023 matches the primary source.' },
    { key: 'verdict_assigned', title: 'Verdict assigned', detail: 'All claims supported: Verified.' },
  ],
}

export const DEMO_SCENARIOS: DemoScenario[] = [laptop, note2000, hotwater, ticks, chandrayaan]

export const MARATHI_SAMPLE =
  'RBI ने ₹2000 च्या नोटा बंद केल्या आहेत. 30 सप्टेंबर ही शेवटची तारीख आहे, त्यानंतर नोटा रद्दी होतील. सर्वांना पाठवा.'

export const FALLBACK = {
  key: 'unmatched',
  category: 'Other' as MisinformationCategory,
  headline: {
    en: 'Not enough trustworthy evidence',
    hi: 'पर्याप्त विश्वसनीय साक्ष्य नहीं',
    mr: 'पुरेसे विश्वासार्ह पुरावे नाहीत',
  },
  summary: {
    en: 'We could not find trusted sources that confirm or contradict this message. Treat it with caution and avoid forwarding until an official source confirms it.',
    hi: 'हमें ऐसे विश्वसनीय स्रोत नहीं मिले जो इस संदेश की पुष्टि या खंडन करें। सावधानी बरतें और किसी आधिकारिक स्रोत की पुष्टि तक इसे आगे न भेजें।',
    mr: 'या संदेशाची पुष्टी किंवा खंडन करणारे विश्वासार्ह स्रोत आम्हाला सापडले नाहीत. सावध राहा आणि अधिकृत स्रोताने पुष्टी करेपर्यंत तो पुढे पाठवू नका.',
  },
}

export function getScenario(key: string): DemoScenario | undefined {
  return DEMO_SCENARIOS.find((s) => s.key === key)
}

export function matchScenario(text: string): DemoScenario | undefined {
  const lower = text.toLowerCase()
  return DEMO_SCENARIOS.find((s) => s.keywords.some((k) => lower.includes(k)))
}
