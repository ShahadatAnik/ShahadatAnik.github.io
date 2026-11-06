import { PROFILE_DATA, bi, type Publication } from './content'
import { siteConfig } from '../site.config'
import { langFromPath, type Lang } from '../lib/lang'

export { langFromPath }
export type { Lang }

export const PAPER_IDS: string[] = PROFILE_DATA.publications.map((p) => p.id)

export function findPaper(id: string): Publication | undefined {
  return PROFILE_DATA.publications.find((p) => p.id === id)
}

export const SITE = siteConfig.site.url
const SITE_NAME = siteConfig.profile.name
const IMAGE = `${SITE}/assets/portrait.jpg`
const GOOGLE_VERIFICATION = siteConfig.site.googleVerification
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
  alternateName: PROFILE_DATA.profile.nameZh,
  url: `${SITE}/`,
  image: IMAGE,
  jobTitle: siteConfig.seo.jobTitle,
  affiliation: {
    '@type': 'CollegeOrUniversity',
    name: siteConfig.seo.organization,
  },
  sameAs: [PROFILE_DATA.profile.github, PROFILE_DATA.profile.scholar, PROFILE_DATA.profile.blog],
  knowsAbout: siteConfig.seo.knowsAbout,
}

const script = (graph: Json[]) => ({
  type: 'application/ld+json',
  children: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
})

const socialMeta = (title: string, description: string, url: string, type: string, locale: string): Meta[] => [
  name('description', description),
  prop('og:title', title),
  prop('og:description', description),
  prop('og:url', url),
  prop('og:type', type),
  prop('og:site_name', SITE_NAME),
  prop('og:locale', locale),
  prop('og:image', IMAGE),
  prop('og:image:alt', siteConfig.profile.name),
  name('twitter:card', 'summary'),
  name('twitter:title', title),
  name('twitter:description', description),
  name('twitter:image', IMAGE),
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
      ...socialMeta(h.title, h.description, url, 'website', h.locale),
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
  const siteName = ko ? PROFILE_DATA.profile.nameZh : PROFILE_DATA.profile.nameEn
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
      ...socialMeta(title, description, url, 'article', ko ? 'ko_KR' : 'en_US'),
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
