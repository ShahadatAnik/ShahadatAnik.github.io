import '../../styles/styles.css'
import '../../styles/readability.css'
import '../../styles/polish.css'
import '../../styles/paper.css'
import { Fragment } from 'react'
import { Dual } from '../Dual'
import { PROFILE_DATA, type Publication } from '../../data/content'
import { findPaper } from '../../data/seo'
import type { Lang } from '../../lib/lang'
import { CopyButton } from './CopyButton'
import { PaperHeader } from './PaperHeader'
import { useTheme, useToast } from './hooks'

type Bilingual = { en: string; zh: string }

const TYPE_LABELS: Record<string, Bilingual> = {
  conference: { en: 'Conference paper', zh: '会议论文' },
  article: { en: 'Journal article', zh: '期刊论文' },
  thesis: { en: 'Master’s thesis', zh: '硕士学位论文' },
}

const CORRESPONDING = 'Corresponding author / 通讯作者'

function Arrow() {
  return (
    <>
      {' '}
      <span className="action-arrow" aria-hidden="true">
        ↗
      </span>
    </>
  )
}

function Authors({ paper }: { paper: Publication }) {
  const corresponding: readonly string[] = paper.correspondingAuthors
  const names = paper.authors.split(',').map((a) => a.trim())
  return (
    <p className="paper-authors">
      {names.map((author, i) => (
        <Fragment key={author}>
          {i > 0 && ', '}
          <span className="publication-author">
            {author === PROFILE_DATA.profile.nameEn ? <strong>{author}</strong> : author}
            {corresponding.includes(author) && (
              <sup className="author-mark" title={CORRESPONDING} aria-label={CORRESPONDING}>
                *
              </sup>
            )}
          </span>
        </Fragment>
      ))}
    </p>
  )
}

function paperLinks(paper: Publication) {
  const custom = 'links' in paper ? paper.links : undefined
  const links: { url: string; label: Bilingual }[] = custom
    ? [...custom]
    : [{ url: paper.url, label: paper.linkLabel ?? { en: 'Paper', zh: '论文' } }]
  if ('codeUrl' in paper && paper.codeUrl) links.push({ url: paper.codeUrl, label: { en: 'Code', zh: '代码' } })
  return links
}

export function PaperPage({ id, lang }: { id: string; lang: Lang }) {
  const paper = findPaper(id)
  const { theme, toggle } = useTheme()
  const toast = useToast()
  if (!paper) return null

  const doi = 'doi' in paper ? paper.doi : undefined
  const doiHref = doi ? (paper.url.includes(doi) ? paper.url : `https://doi.org/${doi}`) : undefined
  const topics = paper.topics
    .map((t) => PROFILE_DATA.research.find((r) => r.id === t)?.title)
    .filter((t): t is Bilingual => Boolean(t))
  const type = TYPE_LABELS[paper.type]
  const links = paperLinks(paper)
  const home = lang === 'both' ? '/' : `/${lang}/`

  return (
    <>
      <a className="skip" href="#paper-main">
        Skip to content / 跳转正文
      </a>
      <PaperHeader id={id} lang={lang} theme={theme} onToggleTheme={toggle} />
      <main id="paper-main" className="paper-main page-width">
        <a className="paper-back" href={`${home}#publications`}>
          ← <Dual en="All publications" zh="全部科研成果" />
        </a>
        <article className="paper-article">
          <div className="paper-eyebrow">
            <span className="paper-year">{paper.year}</span>
            <div className="paper-venue-meta">
              <span className="paper-venue">{paper.venue}</span>
              <span className="paper-authorship authorship-label">
                <Dual en={paper.authorship.en} zh={paper.authorship.zh} />
              </span>
            </div>
          </div>
          <h1 className="paper-title">
            <Dual en={paper.title} zh={paper.zhTitle} />
          </h1>
          <Authors paper={paper} />
          {paper.correspondingAuthors.length > 0 && (
            <p className="author-legend">
              <span aria-hidden="true">*</span> <Dual en="Corresponding author" zh="通讯作者" />
            </p>
          )}
          <div className="paper-topics">
            {topics.map((t) => (
              <span key={t.en}>
                <Dual en={t.en} zh={t.zh} />
              </span>
            ))}
          </div>
          <section className="paper-section">
            <h2>
              <Dual en="Research overview" zh="研究介绍" />
            </h2>
            <div className="paper-summary">
              <Dual en={paper.summary.en} zh={paper.summary.zh} />
            </div>
          </section>
          <section className="paper-section">
            <h2>
              <Dual en="Publication details" zh="发表信息" />
            </h2>
            <dl className="paper-facts">
              <div>
                <dt>
                  <Dual en="Venue" zh="期刊／会议" />
                </dt>
                <dd>{paper.venue}</dd>
              </div>
              <div>
                <dt>
                  <Dual en="Year" zh="年份" />
                </dt>
                <dd>{paper.year}</dd>
              </div>
              {doi && doiHref && (
                <div>
                  <dt>DOI</dt>
                  <dd>
                    <a href={doiHref}>{doi}</a>
                  </dd>
                </div>
              )}
              {type && (
                <div>
                  <dt>
                    <Dual en="Publication type" zh="成果类型" />
                  </dt>
                  <dd>
                    <Dual en={type.en} zh={type.zh} />
                  </dd>
                </div>
              )}
            </dl>
            <div className="paper-links">
              {links.map((l, i) => (
                <a
                  key={l.url}
                  className={i === 0 ? 'button primary' : 'button secondary'}
                  href={l.url}
                  target="_blank"
                  rel="noopener"
                >
                  <Dual en={l.label.en} zh={l.label.zh} />
                  <Arrow />
                </a>
              ))}
            </div>
          </section>
          <section className="paper-section">
            <div className="paper-cite-heading">
              <h2>
                <Dual en="Citation" zh="引用" />
              </h2>
              <CopyButton lang={lang} getText={() => paper.bibtex} onResult={toast.show}>
                <Dual en="Copy BibTeX" zh="复制引用" />
              </CopyButton>
            </div>
            <pre className="paper-bibtex" id="paper-bibtex">
              {paper.bibtex}
            </pre>
          </section>
          <div className="paper-share-row">
            <CopyButton
              lang={lang}
              getText={() => document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href || location.href}
              onResult={toast.show}
            >
              <Dual en="Copy page link" zh="复制本页链接" />
            </CopyButton>
            <a href={`${home}#contact`}>
              <Dual en="Contact Zihan Zhang" zh="联系张梓寒" /> ↗
            </a>
          </div>
        </article>
      </main>
      <footer className="paper-footer page-width">
        <span>© 2026 Zihan Zhang · 张梓寒</span>
        <a href={home}>
          <Dual en="Academic homepage" zh="个人学术主页" /> ↗
        </a>
      </footer>
      <div className={toast.visible ? 'toast show' : 'toast'} id="paper-toast" role="status" aria-live="polite">
        {toast.message}
      </div>
    </>
  )
}
