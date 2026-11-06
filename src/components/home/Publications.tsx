import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { PROFILE_DATA, type Publication } from '../../data/content'
import { TOPICS, localized, paperPath, topicLabel, type TopicFilter } from '../../data/i18n'
import { Dual } from '../Dual'
import { useActiveIndicator } from '../../hooks/useActiveIndicator'
import { useMotion } from '../../hooks/useMotion'
import { Authors } from './Authors'
import { CopyButton } from './CopyButton'
import { Highlight } from './Highlight'
import { PaperDialog } from './PaperDialog'
import { B, T, paperCodeUrl, paperLinks, useLang, venueLabel } from './shared'

const { publications, profile } = PROFILE_DATA

export interface PublicationFilters {
  topic: TopicFilter
  query: string
  year: string
}
export const DEFAULT_FILTERS: PublicationFilters = { topic: 'all', query: '', year: 'all' }

const YEARS = [...new Set(publications.map((paper) => String(paper.year)))].sort((a, b) => Number(b) - Number(a))

function matching(filters: PublicationFilters): Publication[] {
  const q = filters.query.trim().toLowerCase()
  return publications
    .filter((paper) => {
      if (filters.topic !== 'all' && !(paper.topics as string[]).includes(filters.topic)) return false
      if (filters.year !== 'all' && String(paper.year) !== filters.year) return false
      if (!q) return true
      const haystack = [paper.title, paper.zhTitle, paper.authors, paper.venue, String(paper.year), ...paper.topics.map((t) => `${topicLabel(t).en} ${topicLabel(t).zh}`)].join(' ').toLowerCase()
      return haystack.includes(q)
    })
    .sort((a, b) => b.year - a.year)
}

const plainClick = (event: MouseEvent<HTMLAnchorElement>) =>
  !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && (!event.currentTarget.target || event.currentTarget.target === '_self')

export function Publications({ filters, onFilters }: { filters: PublicationFilters; onFilters: (next: PublicationFilters) => void }) {
  const lang = useLang()
  const { allowed } = useMotion()
  const [open, setOpen] = useState<{ paper: Publication; trigger: HTMLElement | null } | null>(null)
  const [resetTick, setResetTick] = useState(0)
  const tabsRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const matches = useMemo(() => matching(filters), [filters])
  const query = filters.query.trim()
  const isDefault = filters.topic === 'all' && !query && filters.year === 'all'

  useActiveIndicator(tabsRef, 'button.active', 'filter', [filters.topic, lang, matches.length], { vertical: true })

  // Brief fade when the topic / year filters change (not while typing).
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (!allowed) return
    const animation = listRef.current?.animate([{ opacity: 0.55, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 200, easing: 'ease-out' })
    return () => animation?.cancel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.topic, filters.year, resetTick])

  const openPaper = (paper: Publication, trigger: HTMLElement | null) => {
    if (document.querySelector('dialog[open]')) return
    setOpen({ paper, trigger })
  }

  // "/" focuses the search field; Escape clears it.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null
      if (event.key === '/' && !event.defaultPrevented && !/INPUT|TEXTAREA|SELECT/.test(active?.tagName ?? '') && !active?.isContentEditable && !document.querySelector('dialog[open]')) {
        event.preventDefault()
        document.getElementById('publications')?.scrollIntoView()
        searchRef.current?.focus({ preventScroll: true })
      }
      if (event.key === 'Escape' && active === searchRef.current) {
        if (searchRef.current?.value) onFilters({ ...filtersRef.current, query: '' })
        else searchRef.current?.blur()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const filtersRef = useRef(filters)
  filtersRef.current = filters

  // Deep link: ?paper=<id> opens that overview.
  useEffect(() => {
    const id = new URL(location.href).searchParams.get('paper')
    const paper = publications.find((item) => item.id === id)
    if (!paper) return
    onFilters(DEFAULT_FILTERS)
    const frame = requestAnimationFrame(() => {
      const row = document.querySelector<HTMLElement>(`.pub-row[data-paper="${paper.id}"]`)
      row?.scrollIntoView({ block: 'center', behavior: 'instant' })
      openPaper(paper, row?.querySelector<HTMLElement>('[data-open]') ?? null)
    })
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const set = (patch: Partial<PublicationFilters>) => onFilters({ ...filters, ...patch })
  const reset = () => {
    onFilters(DEFAULT_FILTERS)
    setResetTick((tick) => tick + 1)
  }

  return (
    <section className="publications-section section" id="publications">
      <div className="page-width">
        <div className="section-heading">
          <div>
            <span className="eyebrow section-number">02 / PUBLICATIONS</span>
            <h2><T k="publicationsTitle" /></h2>
          </div>
          <a id="publication-scholar" className="text-button" target="_blank" rel="noopener" href={profile.scholar}>
            <span><T k="scholarProfile" /></span><span>↗</span>
          </a>
        </div>
        <div className="publication-toolbar">
          <div ref={tabsRef} id="topic-filters" className="filter-tabs" role="group" aria-label="Filter by research topic / 연구 분야별 필터">
            <span className="filter-active-indicator" aria-hidden="true" />
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                type="button"
                data-filter={topic.id}
                aria-pressed={filters.topic === topic.id}
                className={filters.topic === topic.id ? 'active' : undefined}
                onClick={() => set({ topic: topic.id })}
              >
                <B value={topic.label} />
              </button>
            ))}
          </div>
          <div className="publication-tools">
            <div className="search-field">
              <svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
              <input
                ref={searchRef}
                id="paper-search"
                type="search"
                value={filters.query}
                placeholder={localized(lang, 'Search papers', '논문 검색')}
                aria-label="Search publications / 논문 검색"
                onChange={(event) => set({ query: event.target.value })}
              />
              <kbd>/</kbd>
              <button
                id="clear-search"
                type="button"
                className="search-clear"
                hidden={!filters.query}
                aria-label={localized(lang, 'Clear search', '검색어 지우기')}
                onClick={() => {
                  set({ query: '' })
                  searchRef.current?.focus()
                }}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <label className="year-field">
              <span className="sr-only"><T k="year" /></span>
              <select id="year-filter" value={filters.year} aria-label="Filter by year / 연도별 필터" onChange={(event) => set({ year: event.target.value })}>
                <option value="all">{localized(lang, 'All years', '전체 연도')}</option>
                {YEARS.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
          </div>
        </div>
        <div id="active-filters" className="active-filters" aria-label="Active filters / 적용된 필터" hidden={filters.topic === 'all' && filters.year === 'all'}>
          {filters.topic !== 'all' && (
            <button type="button" className="filter-chip" data-clear-filter="topic" aria-label={localized(lang, 'Remove topic filter', '연구 분야 필터 해제')} onClick={() => set({ topic: 'all' })}>
              <B value={topicLabel(filters.topic)} /><span aria-hidden="true">×</span>
            </button>
          )}
          {filters.year !== 'all' && (
            <button type="button" className="filter-chip" data-clear-filter="year" aria-label={localized(lang, 'Remove year filter', '연도 필터 해제')} onClick={() => set({ year: 'all' })}>
              {filters.year}<span aria-hidden="true">×</span>
            </button>
          )}
        </div>
        <div className="result-summary">
          <span id="paper-count" aria-live="polite">
            <Dual en={`${matches.length} of ${publications.length} works`} zh={`${publications.length}건 중 ${matches.length}건`} />
          </span>
          <button id="reset-filters" type="button" className="text-button" hidden={isDefault} onClick={reset}><T k="resetFilters" /></button>
          <span className="publication-note"><T k="publicationNote" /></span>
          <span className="author-legend"><span aria-hidden="true">*</span> <span><T k="correspondingAuthor" /></span></span>
        </div>
        <div ref={listRef} id="publication-list" className="publication-list">
          {matches.map((paper) => {
            const codeUrl = paperCodeUrl(paper)
            return (
              <article key={paper.id} className="pub-row" data-paper={paper.id}>
                <div className="pub-meta">
                  <span className="pub-year">{paper.year}</span>
                  <span className="pub-venue"><Highlight text={venueLabel(paper)} query={query} /></span>
                  {paper.authorship && <span className="pub-authorship authorship-label"><B value={paper.authorship} /></span>}
                </div>
                <div className="pub-main">
                  <a
                    className="pub-title-button"
                    href={paperPath(lang, paper.id)}
                    data-open={paper.id}
                    aria-label={localized(lang, `Explore: ${paper.title}`, `보기: ${paper.zhTitle}`)}
                    onClick={(event) => {
                      if (!plainClick(event)) return
                      event.preventDefault()
                      openPaper(paper, event.currentTarget)
                    }}
                  >
                    <h3 className="en" lang="en"><Highlight text={paper.title} query={query} /></h3>
                    <p className="pub-title-zh zh" lang="ko"><Highlight text={paper.zhTitle} query={query} /></p>
                  </a>
                  <p className="pub-authors"><Authors paper={paper} query={query} /></p>
                  <p className="pub-citation"><Highlight text={paper.venue} query={query} /> · <Highlight text={paper.year} query={query} /></p>
                  <div className="pub-topics">
                    {paper.topics.map((topic) => <span key={topic}><B value={topicLabel(topic)} /></span>)}
                  </div>
                </div>
                <div className="pub-actions">
                  <div className="pub-primary-actions">
                    {paperLinks(paper).map((link) => (
                      <a key={link.url} href={link.url} target="_blank" rel="noopener">
                        <B value={link.label} /> <span className="action-arrow" aria-hidden="true">↗</span>
                      </a>
                    ))}
                    {codeUrl && (
                      <a href={codeUrl} target="_blank" rel="noopener">
                        <T k="code" /> <span className="action-arrow" aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                  <div className="pub-secondary-actions">
                    <button type="button" data-open={paper.id} onClick={(event) => openPaper(paper, event.currentTarget)}>
                      <T k="overview" /><span className="action-symbol" aria-hidden="true">+</span>
                    </button>
                    <CopyButton text={paper.bibtex} message={localized(lang, 'BibTeX copied', 'BibTeX를 복사했습니다')}>
                      <T k="cite" /><span className="action-symbol" aria-hidden="true">⧉</span>
                    </CopyButton>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        <div id="empty-papers" className="empty-state" hidden={matches.length > 0}>
          <h3><T k="noResults" /></h3>
          <p><T k="noResultsHint" /></p>
          <button id="empty-reset" type="button" className="button secondary" onClick={reset}><T k="resetFilters" /></button>
        </div>
      </div>
      <PaperDialog paper={open?.paper ?? null} trigger={open?.trigger ?? null} onClosed={() => setOpen(null)} />
    </section>
  )
}
