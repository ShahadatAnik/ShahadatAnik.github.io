import { ArrowLeft } from 'lucide-react'
import '@/styles/styles.css'
import '@/styles/readability.css'
import '@/styles/polish.css'
import '@/styles/paper.css'
import { PROFILE_DATA } from '@/data/content'
import { paperLinks } from '@/data/papers'
import { findPaper } from '@/data/seo'
import { langPrefix, type Lang } from '@/lib/lang'
import { formatDate } from '@/lib/format'
import { Arrow, Authors, CopyButton, Dual, ExternalLink, LangContext, TopicList } from '@/components/ui'
import { ToastProvider } from '@/hooks/useToast'
import { SITE_ORIGIN, localized, paperPath } from '@/data/i18n'
import { PaperHeader } from './PaperHeader'

type Bilingual = { en: string; ko: string }

const TYPE_LABELS: Record<string, Bilingual> = {
  conference: { en: 'Conference paper', ko: '학회 논문' },
  article: { en: 'Journal article', ko: '저널 논문' },
  thesis: { en: 'Master’s thesis', ko: '석사 학위논문' },
}

export function PaperPage({ id, lang }: { id: string; lang: Lang }) {
  return (
    <LangContext.Provider value={lang}>
      <ToastProvider>
        <PaperArticle id={id} lang={lang} />
      </ToastProvider>
    </LangContext.Provider>
  )
}

function PaperArticle({ id, lang }: { id: string; lang: Lang }) {
  const paper = findPaper(id)
  if (!paper) return null

  const doi = paper.doi
  const doiHref = doi ? (paper.url.includes(doi) ? paper.url : `https://doi.org/${doi}`) : undefined
  const topics = paper.topics
    .map((t) => PROFILE_DATA.research.find((r) => r.id === t)?.title)
    .filter((t): t is Bilingual => Boolean(t))
  const type = TYPE_LABELS[paper.type]
  const links = paperLinks(paper)
  const home = `${langPrefix(lang)}/`

  return (
    <>
      <a className="skip" href="#paper-main">
        Skip to content / 본문으로 건너뛰기
      </a>
      <PaperHeader id={id} lang={lang} />
      <main id="paper-main" className="paper-main page-width">
        <a className="paper-back" href={`${home}#publications`}>
          <ArrowLeft className="back-icon" aria-hidden="true" /> <Dual en="All publications" ko="전체 연구 성과" />
        </a>
        <article className="paper-article">
          <div className="paper-eyebrow">
            <span className="paper-year">{paper.year}</span>
            <div className="paper-venue-meta">
              <span className="paper-venue">{paper.venue}</span>
              <span className="paper-authorship authorship-label">
                <Dual en={paper.authorship.en} ko={paper.authorship.ko} />
              </span>
            </div>
          </div>
          <h1 className="paper-title">
            <Dual en={paper.title} ko={paper.koTitle} />
          </h1>
          <p className="paper-authors"><Authors paper={paper} /></p>
          {paper.correspondingAuthors.length > 0 && (
            <p className="author-legend">
              <span aria-hidden="true">*</span> <Dual en="Corresponding author" ko="교신저자" />
            </p>
          )}
          <TopicList className="paper-topics" topics={paper.topics} />
          <section className="paper-section">
            <h2>
              <Dual en="Research overview" ko="연구 개요" />
            </h2>
            <div className="paper-summary">
              <Dual en={paper.summary.en} ko={paper.summary.ko} />
            </div>
          </section>
          {paper.abstract && (
            <section className="paper-section">
              <h2>
                <Dual en="Abstract" ko="초록" />
              </h2>
              <p className="paper-abstract">
                <Dual en={paper.abstract.en} ko={paper.abstract.ko} />
              </p>
            </section>
          )}
          <section className="paper-section">
            <h2>
              <Dual en="Publication details" ko="출판 정보" />
            </h2>
            <dl className="paper-facts">
              <div>
                <dt>
                  <Dual en="Venue" ko="저널 / 학회" />
                </dt>
                <dd>{paper.venue}</dd>
              </div>
              <div>
                <dt>
                  <Dual en={paper.date ? 'Publication date' : 'Year'} ko={paper.date ? '출판일' : '연도'} />
                </dt>
                <dd>{paper.date ? formatDate(paper.date, lang) : paper.year}</dd>
              </div>
              {paper.publisher && (
                <div>
                  <dt>
                    <Dual en="Publisher" ko="출판사" />
                  </dt>
                  <dd>{paper.publisher}</dd>
                </div>
              )}
              {paper.volume && (
                <div>
                  <dt>
                    <Dual en="Volume" ko="권" />
                  </dt>
                  <dd>{paper.volume}</dd>
                </div>
              )}
              {paper.pages && (
                <div>
                  <dt>
                    <Dual en="Pages" ko="페이지" />
                  </dt>
                  <dd>{paper.pages}</dd>
                </div>
              )}
              {paper.citations ? (
                <div>
                  <dt>
                    <Dual en="Citations" ko="피인용" />
                  </dt>
                  <dd>
                    <Dual en={`Cited by ${paper.citations} (Google Scholar)`} ko={`${paper.citations}회 피인용 (Google Scholar)`} />
                  </dd>
                </div>
              ) : null}
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
                    <Dual en="Publication type" ko="성과 유형" />
                  </dt>
                  <dd>
                    <Dual en={type.en} ko={type.ko} />
                  </dd>
                </div>
              )}
            </dl>
            <div className="paper-links">
              {links.map((l, i) => (
                <ExternalLink key={l.url} className={i === 0 ? 'button primary' : 'button secondary'} href={l.url}>
                  <Dual en={l.label.en} ko={l.label.ko} />
                </ExternalLink>
              ))}
            </div>
          </section>
          <section className="paper-section">
            <div className="paper-cite-heading">
              <h2>
                <Dual en="Citation" ko="인용" />
              </h2>
              <CopyButton className="paper-copy" text={paper.bibtex} message={localized(lang, 'BibTeX copied', 'BibTeX를 복사했습니다')}>
                <Dual en="Copy BibTeX" ko="BibTeX 복사" />
              </CopyButton>
            </div>
            <pre className="paper-bibtex" id="paper-bibtex">
              {paper.bibtex}
            </pre>
          </section>
          <div className="paper-share-row">
            <CopyButton className="paper-copy" text={`${SITE_ORIGIN}${paperPath(lang, id)}`} message={localized(lang, 'Page link copied', '페이지 링크를 복사했습니다')}>
              <Dual en="Copy page link" ko="페이지 링크 복사" />
            </CopyButton>
            <a href={`${home}#contact`}>
              <Dual en={`Contact ${PROFILE_DATA.profile.shortName}`} ko={`${PROFILE_DATA.profile.shortName}에게 연락`} /><Arrow />
            </a>
          </div>
        </article>
      </main>
      <footer className="paper-footer page-width">
        <span>© {new Date().getFullYear()} {PROFILE_DATA.profile.nameEn}</span>
        <a href={home}>
          <Dual en="Academic homepage" ko="학술 홈페이지" /><Arrow />
        </a>
      </footer>
          </>
  )
}
