import type { Lang } from '@/lib/lang'
import { siteConfig, type TopicId } from '@/site.config'
import { bi } from './content'

const topic = (id: TopicId) => bi(siteConfig.research.find((r) => r.id === id)!.title)

export interface Bilingual {
  en: string
  ko: string
}

/** Static UI strings of the homepage (formerly the `T` table in app.js). */
export const T = {
  navResearch: { en: 'Research', ko: '연구' },
  navPublications: { en: 'Publications', ko: '논문' },
  navJourney: { en: 'Journey', ko: '이력' },
  navExperience: { en: 'Experience', ko: '경력' },
  navGallery: { en: 'Gallery', ko: '갤러리' },
  navContact: { en: 'Contact', ko: '연락처' },
  heroEyebrow: bi(siteConfig.hero.eyebrow),
  jobStatus: bi(siteConfig.hero.status),
  bio: bi(siteConfig.hero.bio),
  exploreWork: { en: 'Explore my work', ko: '연구 보기' },
  getInTouch: { en: 'Get in touch', ko: '연락하기' },
  researchTitle: { en: 'A connected perspective.', ko: '연결된 시각' },
  researchIntro: {
    en: 'Connecting brain signals, multimodal deep learning and computer vision with real-world systems.',
    ko: '뇌 신호, 멀티모달 딥러닝, 컴퓨터 비전을 실제 시스템과 연결합니다.',
  },
  topicEEG: topic('eeg'),
  topicBrain: topic('brain'),
  topicNLP: topic('nlp'),
  topicMedical: topic('medical'),
  clickDirection: { en: 'Select a node to explore', ko: '노드를 선택해 탐색하세요' },
  researchFocus: { en: 'Research focus', ko: '연구 주제' },
  relatedWork: { en: 'Explore related work', ko: '관련 연구 보기' },
  publicationsTitle: { en: 'Ideas into research.', ko: '아이디어에서 연구로' },
  correspondingAuthor: { en: 'Corresponding author', ko: '교신저자' },
  scholarProfile: { en: 'Google Scholar profile', ko: 'Google Scholar 프로필' },
  year: { en: 'Year', ko: '연도' },
  resetFilters: { en: 'Reset filters', ko: '필터 초기화' },
  publicationNote: { en: 'Click a title to explore the work', ko: '제목을 클릭하면 연구 소개를 볼 수 있습니다' },
  noResults: { en: 'No matching publications.', ko: '일치하는 논문이 없습니다.' },
  noResultsHint: { en: 'Try a different keyword, topic, or year.', ko: '다른 키워드, 분야, 연도를 시도해 보세요.' },
  journeyTitle: { en: 'The path so far.', ko: '지금까지의 여정' },
  journeyIntro: { en: 'From computer science in Dhaka to brain-AI research in South Korea.', ko: '다카의 컴퓨터공학에서 한국의 뇌-AI 연구까지.' },
  educationTitle: { en: 'Education', ko: '학력' },
  honorsTitle: { en: 'Honors & recognition', ko: '수상 및 인정' },
  honorsFoot: { en: 'With gratitude for the people and institutions supporting this journey.', ko: '이 여정을 지지해 준 모든 분과 기관에 감사드립니다.' },
  experienceTitle: { en: 'Research and engineering.', ko: '연구와 개발' },
  galleryTitle: { en: 'Moments along the way.', ko: '함께한 순간들' },
  galleryIntro: { en: 'Awards, graduation day and conferences: the days behind the milestones.', ko: '시상식, 졸업식, 학회: 이정표 뒤의 순간들.' },
  sampleBadge: { en: 'Demo photo', ko: '예시 사진' },
  galleryOpen: { en: 'View photos', ko: '사진 보기' },
  galleryClose: { en: 'Close', ko: '닫기' },
  galleryPrev: { en: 'Previous photo', ko: '이전 사진' },
  galleryNext: { en: 'Next photo', ko: '다음 사진' },
  galleryOpenLink: { en: 'Open link', ko: '링크 열기' },
  experienceIntro: { en: 'Research, production software, and the projects in between.', ko: '연구, 실무 소프트웨어, 그리고 그 사이의 프로젝트들.' },
  toolbox: { en: 'Technical skills', ko: '기술 스택' },
  rolesTitle: { en: 'Roles and projects', ko: '경력 및 프로젝트' },
  writingTitle: { en: 'Making ideas accessible.', ko: '지식을 더 쉽게' },
  writingIntro: { en: 'Technology writing as Zicy · 200,000+ cumulative reads.', ko: '' },
  blog: { en: 'Personal blog', ko: '블로그' },
  techWriting: { en: 'Selected writing', ko: '기술 글' },
  contactTitle: { en: 'Let’s connect.', ko: '연락하기' },
  contactIntro: {
    en: 'Interested in brain–AI interfaces, computer vision or multimodal learning? I am open to research collaborations.',
    ko: '뇌-AI 인터페이스, 컴퓨터 비전, 멀티모달 학습에 관심이 있으신가요? 공동 연구를 환영합니다.',
  },
  backTop: { en: 'Back to top', ko: '맨 위로' },
  footerNote: { en: 'Built with curiosity.', ko: '호기심으로 만들었습니다.' },
  paperDetails: { en: 'Research overview', ko: '연구 개요' },
  // Strings that were inline in the original markup / scripts.
  present: { en: 'present', ko: '현재' },
  allWork: { en: 'All work', ko: '전체' },
  code: { en: 'Code', ko: '코드' },
  overview: { en: 'Overview', ko: '개요' },
  cite: { en: 'Cite', ko: '인용' },
  copied: { en: 'Copied', ko: '복사됨' },
  researchInBrief: { en: 'Research in brief', ko: '연구 요약' },
  copyBibtex: { en: 'Copy BibTeX', ko: 'BibTeX 복사' },
  copyLink: { en: 'Copy link', ko: '링크 복사' },
} as const satisfies Record<string, Bilingual>

export type TKey = keyof typeof T

export type { TopicId }
export type TopicFilter = TopicId | 'all'

export const TOPICS: { id: TopicFilter; label: Bilingual }[] = [
  { id: 'all', label: T.allWork },
  { id: 'eeg', label: T.topicEEG },
  { id: 'brain', label: T.topicBrain },
  { id: 'nlp', label: T.topicNLP },
  { id: 'medical', label: T.topicMedical },
]

export const topicLabel = (id: string): Bilingual => TOPICS.find((t) => t.id === id)?.label ?? { en: id, ko: id }

export const SITE_ORIGIN = siteConfig.site.url

export const langPrefix = (lang: Lang) => (lang === 'ko' ? '/kr' : '')
export const languagePath = (lang: Lang) => `${langPrefix(lang)}/`
export const paperPath = (lang: Lang, id: string) => `${languagePath(lang)}publications/${encodeURIComponent(id)}/`

/** Text for plain attributes (aria-label, placeholder, toast): language-specific, or "en / ko" in bilingual mode. */
export const localized = (lang: Lang, en: string, ko: string) => (lang === 'ko' ? ko : lang === 'en' ? en : `${en} / ${ko}`)

export const NAV_ITEMS = [
  { hash: 'research', label: T.navResearch },
  { hash: 'publications', label: T.navPublications },
  { hash: 'journey', label: T.navJourney },
  { hash: 'experience', label: T.navExperience },
  { hash: 'gallery', label: T.navGallery },
  { hash: 'contact', label: T.navContact },
] as const
