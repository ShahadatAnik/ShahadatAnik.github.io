import type { Lang } from '../lib/lang'

export interface Bilingual {
  en: string
  zh: string
}

/** Static UI strings of the homepage (formerly the `T` table in app.js). */
export const T = {
  navResearch: { en: 'Research', zh: '연구' },
  navPublications: { en: 'Publications', zh: '논문' },
  navJourney: { en: 'Journey', zh: '이력' },
  navContact: { en: 'Contact', zh: '연락처' },
  heroEyebrow: { en: 'MS+PhD researcher · Brain-AI & BCI', zh: '석박통합과정 연구원 · 뇌-AI & BCI' },
  jobStatus: { en: 'Open to research collaboration', zh: '공동 연구 환영' },
  bio: {
    en: 'I am a combined M.S.+Ph.D. student and Research Assistant at the Industrial AI Lab (Big Data Analytics), Kyung Hee University. I work on brain–AI interfaces and a brainwave-language model for non-verbal communication, with a background in deep learning, computer vision and ERP software engineering.',
    zh: '경희대학교 산업AI연구실(빅데이터 분석) 연구조교이자 석박사 통합과정 학생입니다. 비언어 의사소통을 위한 뇌-AI 인터페이스와 뇌파-언어 모델을 연구하며, 딥러닝, 컴퓨터 비전, ERP 소프트웨어 엔지니어링 경험이 있습니다.',
  },
  exploreWork: { en: 'Explore my work', zh: '연구 보기' },
  emailLink: { en: 'Email ↗', zh: '이메일 ↗' },
  portraitFoot: { en: 'Curiosity across disciplines.', zh: '학문의 경계를 넘는 호기심.' },
  hit: { en: 'Kyung Hee University', zh: '경희대학교' },
  hitDetail: { en: 'M.S.+Ph.D. · Industrial AI Lab · 2026–present', zh: '석박통합과정 · 산업AI연구실 · 2026–현재' },
  ntu: { en: 'SynapTech', zh: 'SynapTech' },
  ntuDetail: { en: 'Software Engineer · 2023–present', zh: '소프트웨어 엔지니어 · 2023–현재' },
  researchTitle: { en: 'A connected perspective.', zh: '연결된 시각' },
  researchIntro: {
    en: 'Connecting brain signals, multimodal deep learning and computer vision with real-world systems.',
    zh: '뇌 신호, 멀티모달 딥러닝, 컴퓨터 비전을 실제 시스템과 연결합니다.',
  },
  topicEEG: { en: 'Brain-AI & BCI', zh: '뇌-AI & BCI' },
  topicBrain: { en: 'Multimodal learning', zh: '멀티모달 학습' },
  topicNLP: { en: 'Computer vision', zh: '컴퓨터 비전' },
  topicMedical: { en: 'Applied AI & systems', zh: '응용 AI & 시스템' },
  clickDirection: { en: 'Select a node to explore', zh: '노드를 선택해 탐색하세요' },
  researchFocus: { en: 'Research focus', zh: '연구 주제' },
  relatedWork: { en: 'Explore related work', zh: '관련 연구 보기' },
  publicationsTitle: { en: 'Ideas into research.', zh: '아이디어에서 연구로' },
  correspondingAuthor: { en: 'Corresponding author', zh: '교신저자' },
  scholarProfile: { en: 'Google Scholar profile', zh: 'Google Scholar 프로필' },
  year: { en: 'Year', zh: '연도' },
  resetFilters: { en: 'Reset filters', zh: '필터 초기화' },
  publicationNote: { en: 'Click a title to explore the work', zh: '제목을 클릭하면 연구 소개를 볼 수 있습니다' },
  noResults: { en: 'No matching publications.', zh: '일치하는 논문이 없습니다.' },
  noResultsHint: { en: 'Try a different keyword, topic, or year.', zh: '다른 키워드, 분야, 연도를 시도해 보세요.' },
  journeyTitle: { en: 'The path so far.', zh: '지금까지의 여정' },
  journeyIntro: { en: 'From computer science in Dhaka to brain-AI research in South Korea.', zh: '다카의 컴퓨터공학에서 한국의 뇌-AI 연구까지.' },
  educationTitle: { en: 'Education', zh: '학력' },
  honorsTitle: { en: 'Honors & recognition', zh: '수상 및 인정' },
  honorsFoot: { en: 'With gratitude for the people and institutions supporting this journey.', zh: '이 여정을 지지해 준 모든 분과 기관에 감사드립니다.' },
  experienceTitle: { en: 'Research and engineering.', zh: '연구와 개발' },
  experienceIntro: { en: 'Research, production software, and the projects in between.', zh: '연구, 실무 소프트웨어, 그리고 그 사이의 프로젝트들.' },
  toolbox: { en: 'Technical skills', zh: '기술 스택' },
  writingTitle: { en: 'Making ideas accessible.', zh: '지식을 더 쉽게' },
  writingIntro: { en: 'Technology writing as Zicy · 200,000+ cumulative reads.', zh: '' },
  blog: { en: 'Personal blog', zh: '블로그' },
  techWriting: { en: 'Selected writing', zh: '기술 글' },
  contactTitle: { en: 'Let’s connect.', zh: '연락하기' },
  contactIntro: {
    en: 'Interested in brain–AI interfaces, computer vision or multimodal learning? I am open to research collaborations.',
    zh: '뇌-AI 인터페이스, 컴퓨터 비전, 멀티모달 학습에 관심이 있으신가요? 공동 연구를 환영합니다.',
  },
  backTop: { en: 'Back to top ↑', zh: '맨 위로 ↑' },
  footerNote: { en: 'Built with curiosity.', zh: '호기심으로 만들었습니다.' },
  paperDetails: { en: 'Research overview', zh: '연구 개요' },
  // Strings that were inline in the original markup / scripts.
  present: { en: 'present', zh: '현재' },
  allWork: { en: 'All work', zh: '전체' },
  code: { en: 'Code', zh: '코드' },
  overview: { en: 'Overview', zh: '개요' },
  cite: { en: 'Cite', zh: '인용' },
  copied: { en: 'Copied', zh: '복사됨' },
  researchInBrief: { en: 'Research in brief', zh: '연구 요약' },
  copyBibtex: { en: 'Copy BibTeX', zh: 'BibTeX 복사' },
  copyLink: { en: 'Copy link', zh: '링크 복사' },
} as const satisfies Record<string, Bilingual>

export type TKey = keyof typeof T

export type TopicId = 'eeg' | 'brain' | 'nlp' | 'medical'
export type TopicFilter = TopicId | 'all'

export const TOPICS: { id: TopicFilter; label: Bilingual }[] = [
  { id: 'all', label: T.allWork },
  { id: 'eeg', label: T.topicEEG },
  { id: 'brain', label: T.topicBrain },
  { id: 'nlp', label: T.topicNLP },
  { id: 'medical', label: T.topicMedical },
]

export const topicLabel = (id: string): Bilingual => TOPICS.find((t) => t.id === id)?.label ?? { en: id, zh: id }

export const SITE_ORIGIN = 'https://shahadatanik.github.io'

export const langPrefix = (lang: Lang) => (lang === 'zh' ? '/kr' : '')
export const languagePath = (lang: Lang) => `${langPrefix(lang)}/`
export const paperPath = (lang: Lang, id: string) => `${languagePath(lang)}publications/${encodeURIComponent(id)}/`

/** Text for plain attributes (aria-label, placeholder, toast): language-specific, or "en / zh" in bilingual mode. */
export const localized = (lang: Lang, en: string, zh: string) => (lang === 'zh' ? zh : lang === 'en' ? en : `${en} / ${zh}`)

export const NAV_ITEMS = [
  { hash: 'research', label: T.navResearch },
  { hash: 'publications', label: T.navPublications },
  { hash: 'journey', label: T.navJourney },
  { hash: 'contact', label: T.navContact },
] as const
