import type { Lang } from '../lib/lang'

export interface Bilingual {
  en: string
  zh: string
}

/** Static UI strings of the homepage (formerly the `T` table in app.js). */
export const T = {
  navResearch: { en: 'Research', zh: '研究' },
  navPublications: { en: 'Publications', zh: '论文' },
  navJourney: { en: 'Journey', zh: '经历' },
  navContact: { en: 'Contact', zh: '联系' },
  heroEyebrow: { en: 'Ph.D. researcher · Brain & intelligence', zh: '博士研究生 · 大脑与智能' },
  jobStatus: { en: 'Open to work', zh: '求职中' },
  bio: {
    en: 'I am a Ph.D. student at Harbin Institute of Technology (SCIR). My research spans brain–computer interfaces, brain-inspired AI, language and cognition, and medical AI.',
    zh: '我是哈尔滨工业大学 SCIR 实验室博士生，研究脑机接口、类脑人工智能、语言与认知及医学人工智能。',
  },
  exploreWork: { en: 'Explore my work', zh: '探索研究' },
  emailLink: { en: 'Email ↗', zh: '邮箱 ↗' },
  portraitFoot: { en: 'Curiosity across disciplines.', zh: '保持好奇，跨越学科。' },
  hit: { en: 'Harbin Institute of Technology', zh: '哈尔滨工业大学' },
  hitDetail: { en: 'Ph.D. · SCIR · 2023–present', zh: '计算机科学与技术 · 博士' },
  ntu: { en: 'Nanyang Technological University', zh: '南洋理工大学' },
  ntuDetail: { en: 'CSC Visiting Ph.D. · 2026–2027', zh: '认知神经科学 · 联合培养' },
  researchTitle: { en: 'A connected perspective.', zh: '研究方向' },
  researchIntro: {
    en: 'Connecting biological intelligence and machine learning, from brain signals and cognition to medical applications.',
    zh: '在生物智能与机器学习的交汇处，探索信号、认知、语言与医学应用。',
  },
  topicEEG: { en: 'Brain–computer interfaces', zh: '脑机接口' },
  topicBrain: { en: 'Brain-inspired AI', zh: '类脑人工智能' },
  topicNLP: { en: 'Language & cognition', zh: '语言与认知' },
  topicMedical: { en: 'Medical AI', zh: '医学人工智能' },
  clickDirection: { en: 'Select a node to explore', zh: '点击节点探索研究' },
  researchFocus: { en: 'Research focus', zh: '研究主题' },
  relatedWork: { en: 'Explore related work', zh: '浏览相关成果' },
  publicationsTitle: { en: 'Ideas into research.', zh: '科研成果' },
  correspondingAuthor: { en: 'Corresponding author', zh: '通讯作者' },
  scholarProfile: { en: 'Google Scholar profile', zh: '谷歌学术' },
  year: { en: 'Year', zh: '年份' },
  resetFilters: { en: 'Reset filters', zh: '重置筛选' },
  publicationNote: { en: 'Click a title to explore the work', zh: '点击标题查看研究介绍' },
  noResults: { en: 'No matching publications.', zh: '暂无符合条件的论文。' },
  noResultsHint: { en: 'Try a different keyword, topic, or year.', zh: '试试其他关键词、方向或年份。' },
  journeyTitle: { en: 'The path so far.', zh: '教育与荣誉' },
  journeyIntro: { en: 'From computer science to cognitive neuroscience. Always learning.', zh: '从计算机科学到认知神经科学，在探索中不断学习。' },
  educationTitle: { en: 'Education', zh: '教育经历' },
  honorsTitle: { en: 'Honors & support', zh: '荣誉与资助' },
  honorsFoot: { en: 'With gratitude for the people and institutions supporting this journey.', zh: '感谢求学路上给予支持的人与机构。' },
  experienceTitle: { en: 'Research is only part of the story.', zh: '科研之外' },
  experienceIntro: { en: 'Teaching, reviewing, writing, and sharing what I learn along the way.', zh: '参与教学与审稿，写下思考，也分享所学。' },
  toolbox: { en: 'My toolbox', zh: '工具与技能' },
  writingTitle: { en: 'Making ideas accessible.', zh: '让知识被更多人看见' },
  writingIntro: { en: 'Technology writing as Zicy · 200,000+ cumulative reads.', zh: '笔名 Zicy · 技术文章累计阅读量 20 万+' },
  blog: { en: 'Personal blog', zh: '个人博客' },
  techWriting: { en: 'Selected writing', zh: '技术文章' },
  contactTitle: { en: 'Let’s connect.', zh: '聊聊研究与想法' },
  contactIntro: {
    en: 'Interested in brain–computer interfaces, brain-inspired AI, language and cognition, or medical AI? I would love to exchange ideas.',
    zh: '如果你也关注脑机接口、类脑人工智能、语言与认知或医学人工智能，欢迎交流。',
  },
  backTop: { en: 'Back to top ↑', zh: '返回顶部 ↑' },
  footerNote: { en: 'Built with curiosity.', zh: '保持好奇。' },
  paperDetails: { en: 'Research overview', zh: '研究介绍' },
  // Strings that were inline in the original markup / scripts.
  present: { en: 'present', zh: '至今' },
  allWork: { en: 'All work', zh: '全部' },
  code: { en: 'Code', zh: '代码' },
  overview: { en: 'Overview', zh: '研究介绍' },
  cite: { en: 'Cite', zh: '引用' },
  copied: { en: 'Copied', zh: '已复制' },
  researchInBrief: { en: 'Research in brief', zh: '研究简述' },
  copyBibtex: { en: 'Copy BibTeX', zh: '复制引用' },
  copyLink: { en: 'Copy link', zh: '复制链接' },
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

export const SITE_ORIGIN = 'https://zhangzihan-is-good.github.io'

export const langPrefix = (lang: Lang) => (lang === 'both' ? '' : `/${lang}`)
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
