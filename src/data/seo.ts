import { PROFILE_DATA, bi, type Publication } from './content'
import { siteConfig } from '@/site.config'
import { langFromPath, type Lang } from '@/lib/lang'

export { langFromPath }
export type { Lang }

export const PAPER_IDS: string[] = PROFILE_DATA.publications.map((p) => p.id)

export function findPaper(id: string): Publication | undefined {
  return PROFILE_DATA.publications.find((p) => p.id === id)
}

export const SITE = siteConfig.site.url
const SITE_NAME = siteConfig.profile.name
const PORTRAIT = `${SITE}/assets/portrait.jpg`
const imageFor = (lang: Lang) => `${SITE}${lang === 'ko' ? siteConfig.seo.image.ko : siteConfig.seo.image.en}`
const IMAGE_ALT = {
  en: `${siteConfig.profile.name}: MS+PhD researcher in Brain-AI & BCI at Kyung Hee University`,
  ko: `${siteConfig.profile.name}: 경희대학교 뇌-AI & BCI 연구자`,
} as const
const GOOGLE_VERIFICATION = siteConfig.site.googleVerification
const ANALYTICS_ID = siteConfig.site.analyticsId
const FONTS =
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&family=Noto+Sans+KR:wght@400;500;700&display=swap'

type Meta = { title: string } | { name: string; content: string } | { property: string; content: string }
type HeadLink = { rel: string; href: string; hrefLang?: string; crossOrigin?: 'anonymous' }
type Json = Record<string, unknown>
export type HeadResult = {
  meta: Meta[]
  links: HeadLink[]
  scripts: { type: string; children: string }[]
}

const name = (n: string, content: string): Meta => ({ name: n, content })
const prop = (p: string, content: string): Meta => ({ property: p, content })

const fontLinks = (): HeadLink[] => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  { rel: 'stylesheet', href: FONTS },
]

const pathFor = (lang: Lang, suffix: string) => `${SITE}${lang === 'ko' ? '/kr' : ''}${suffix}`

function alternates(suffix: string): HeadLink[] {
  return [
    { rel: 'alternate', href: pathFor('en', suffix), hrefLang: 'en' },
    { rel: 'alternate', href: pathFor('ko', suffix), hrefLang: 'ko' },
    { rel: 'alternate', href: pathFor('en', suffix), hrefLang: 'x-default' },
  ]
}

const inLanguage = (lang: Lang) => (lang === 'ko' ? 'ko' : 'en')

const PERSON: Json = {
  '@type': 'Person',
  '@id': `${SITE}/#person`,
  name: PROFILE_DATA.profile.nameEn,
  givenName: siteConfig.seo.firstName,
  familyName: siteConfig.seo.lastName,
  alternateName: [siteConfig.profile.shortName, 'Shahadat Anik'],
  url: `${SITE}/`,
  image: { '@type': 'ImageObject', url: PORTRAIT, width: 335, height: 447 },
  jobTitle: siteConfig.seo.jobTitle,
  description: siteConfig.seo.description.en,
  affiliation: { '@type': 'CollegeOrUniversity', name: siteConfig.seo.organization, url: 'https://www.khu.ac.kr/' },
  worksFor: { '@type': 'CollegeOrUniversity', name: siteConfig.seo.organization },
  alumniOf: siteConfig.education
    .filter((e) => /university/i.test(e.school.en))
    .map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school.en, ...(e.url ? { url: e.url } : {}) })),
  sameAs: [PROFILE_DATA.profile.github, PROFILE_DATA.profile.linkedin, PROFILE_DATA.profile.scholar].filter(Boolean),
  knowsAbout: siteConfig.seo.knowsAbout,
}

const script = (graph: Json[]) => ({
  type: 'application/ld+json',
  children: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
})

const socialMeta = (lang: Lang, title: string, description: string, url: string, type: string, locale: string): Meta[] => [
  name('description', description),
  name('author', SITE_NAME),
  name('keywords', siteConfig.seo.keywords.join(', ')),
  name('robots', 'index,follow,max-image-preview:large,max-snippet:-1'),
  prop('og:title', title),
  prop('og:description', description),
  prop('og:url', url),
  prop('og:type', type),
  prop('og:site_name', SITE_NAME),
  prop('og:locale', locale),
  prop('og:locale:alternate', locale === 'ko_KR' ? 'en_US' : 'ko_KR'),
  prop('og:image', imageFor(lang)),
  prop('og:image:secure_url', imageFor(lang)),
  prop('og:image:type', 'image/png'),
  prop('og:image:width', String(siteConfig.seo.image.width)),
  prop('og:image:height', String(siteConfig.seo.image.height)),
  prop('og:image:alt', IMAGE_ALT[lang]),
  name('twitter:card', 'summary_large_image'),
  name('twitter:title', title),
  name('twitter:description', description),
  name('twitter:image', imageFor(lang)),
  name('twitter:image:alt', IMAGE_ALT[lang]),
]

/* ------------------------------ Home pages ------------------------------ */

const HOME_EN = { title: siteConfig.seo.title.en, description: siteConfig.seo.description.en, locale: 'en_US' }
const HOME_KO = {
  title: bi(siteConfig.seo.title).ko,
  description: bi(siteConfig.seo.description).ko,
  locale: 'ko_KR',
}
const HOME = { en: HOME_EN, ko: HOME_KO } as const

export function homeHead(lang: Lang): HeadResult {
  const h = HOME[lang]
  const url = pathFor(lang, '/')
  return {
    meta: [
      { title: h.title },
      ...(GOOGLE_VERIFICATION ? [name('google-site-verification', GOOGLE_VERIFICATION)] : []),
      ...socialMeta(lang, h.title, h.description, url, 'profile', h.locale),
      prop('profile:first_name', siteConfig.seo.firstName),
      prop('profile:last_name', siteConfig.seo.lastName),
    ],
    links: [...fontLinks(), { rel: 'canonical', href: url }, ...alternates('/')],
    scripts: [
      script([
        {
          '@type': 'WebSite',
          '@id': `${SITE}/#website`,
          url: `${SITE}/`,
          name: SITE_NAME,
          alternateName: siteConfig.profile.shortName,
          inLanguage: ['en', 'ko'],
        },
        PERSON,
        {
          '@type': 'ProfilePage',
          '@id': `${url}#profile`,
          url,
          name: h.title,
          description: h.description,
          inLanguage: inLanguage(lang),
          mainEntity: { '@id': `${SITE}/#person` },
          isPartOf: { '@id': `${SITE}/#website` },
        },
      ]),
    ],
  }
}

/* ------------------------------ Paper pages ----------------------------- */

export function paperHead(id: string, lang: Lang): HeadResult {
  const p = findPaper(id)
  if (!p) return { meta: [], links: fontLinks(), scripts: [] }
  const ko = lang === 'ko'
  const suffix = `/publications/${id}/`
  const url = pathFor(lang, suffix)
  const workUrl = pathFor('en', suffix)
  const heading = ko ? p.koTitle : p.title
  const alt = ko ? p.title : p.koTitle
  const siteName = PROFILE_DATA.profile.nameEn
  const title = `${heading} | ${siteName}`
  const description = ko ? p.summary.ko : p.summary.en
  const authors = p.authors.split(',').map((a) => a.trim())
  const isThesis = p.type === 'thesis'
  const doi = 'doi' in p ? p.doi : undefined

  const work: Json = {
    '@type': isThesis ? 'Thesis' : 'ScholarlyArticle',
    '@id': `${workUrl}#work`,
    headline: heading,
    alternativeHeadline: alt,
    url: workUrl,
    description,
    author: authors.map((a) =>
      a === PROFILE_DATA.profile.nameEn
        ? { '@type': 'Person', name: a, '@id': `${SITE}/#person` }
        : { '@type': 'Person', name: a },
    ),
    sameAs: p.url,
    inLanguage: inLanguage(lang),
    mainEntityOfPage: { '@id': `${url}#page` },
    ...(doi ? { identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: doi } } : {}),
    ...(isThesis
      ? {}
      : { isPartOf: { '@type': p.type === 'conference' ? 'CreativeWorkSeries' : 'Periodical', name: p.venue } }),
  }

  return {
    meta: [
      { title },
      ...socialMeta(lang, title, description, url, 'article', ko ? 'ko_KR' : 'en_US'),
      prop('article:author', `${SITE}/`),
      ...(p.date ? [prop('article:published_time', p.date)] : []),
      prop('article:section', 'Research'),
      name('citation_title', p.title),
      ...authors.map((a) => name('citation_author', a)),
      name('citation_publication_date', String(p.year)),
      name('citation_abstract_html_url', url),
      ...(doi ? [name('citation_doi', doi)] : []),
      ...(isThesis
        ? [name('DC.type', 'Thesis')]
        : [name(p.type === 'conference' ? 'citation_conference_title' : 'citation_journal_title', p.venue)]),
    ],
    links: [...fontLinks(), { rel: 'canonical', href: url }, ...alternates(suffix)],
    scripts: [
      script([
        PERSON,
        {
          '@type': 'WebPage',
          '@id': `${url}#page`,
          url,
          name: title,
          description,
          mainEntity: { '@id': `${workUrl}#work` },
          isPartOf: { '@id': `${SITE}/#website` },
        },
        work,
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: siteName, item: pathFor(lang, '/') },
            { '@type': 'ListItem', position: 2, name: heading, item: url },
          ],
        },
      ]),
    ],
  }
}

/* ------------------------------ Analytics ------------------------------- */

/**
 * Google Analytics 4 (gtag.js). Added to every page from the root route.
 * Only in the production build (so local development never pollutes the data) and only for a valid "G-..." ID.
 * Language switches are client-side navigations; GA4 records them through its built-in history-change measurement.
 */
export function analyticsScripts(): { children: string }[] {
  if (!import.meta.env.PROD || !/^G-[A-Z0-9]{4,}$/.test(ANALYTICS_ID)) return []
  // The loader is inline (it adds gtag.js asynchronously) because the router's head does not output external <script src> tags.
  return [
    {
      children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ANALYTICS_ID}');(function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}';document.head.appendChild(s)})();`,
    },
  ]
}
