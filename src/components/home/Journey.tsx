import { B, Dual, ExternalLink, Period, Reveal, SectionHeading, T } from '@/components/ui'
import { useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { PROFILE_DATA } from '@/data/content'

const { education, honors, publications, research, profile } = PROFILE_DATA
const totalCitations = publications.reduce((sum, paper) => sum + (paper.citations ?? 0), 0)

/** Numbers that come straight from the config, so they never go stale by hand. */
function Glance() {
  const stats = [
    { value: publications.length, label: { en: 'Publications', ko: '논문' } },
    { value: totalCitations, label: { en: 'Citations', ko: '피인용' } },
    { value: research.length, label: { en: 'Research areas', ko: '연구 분야' } },
  ]
  return (
    <Reveal className="glance-panel">
      <h3 className="subheading"><Dual en="At a glance" ko="한눈에 보기" /></h3>
      <dl className="glance-stats">
        {stats.map((stat) => (
          <div key={stat.label.en}>
            <dd>{stat.value}</dd>
            <dt><Dual en={stat.label.en} ko={stat.label.ko} /></dt>
          </div>
        ))}
      </dl>
      <ExternalLink className="glance-link" href={profile.scholar}>
        <Dual en="See all on Google Scholar" ko="Google Scholar에서 전체 보기" />
      </ExternalLink>
    </Reveal>
  )
}
const honorYears = [...new Set(honors.map((honor) => honor.year))]

/** One timeline entry; it is "reached" once it passes 72% of the viewport height. */
function EducationItem({ entry, current, onReach }: { entry: (typeof education)[number]; current: boolean; onReach: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const reached = useInView(ref, { once: true, margin: '0px 0px -28% 0px' })
  useEffect(() => {
    if (reached) onReach()
  }, [reached, onReach])
  return (
    <article ref={ref} className={['education-item', reached ? 'is-reached' : '', current ? 'is-current' : ''].filter(Boolean).join(' ')}>
      <p className="period"><Period text={entry.period} /></p>
      <h4>
        {entry.url ? (
          <ExternalLink href={entry.url} className="school-link"><B value={entry.school} /></ExternalLink>
        ) : (
          <B value={entry.school} />
        )}
      </h4>
      <p className="degree"><B value={entry.degree} /></p>
      <p className="detail"><B value={entry.detail} /></p>
    </article>
  )
}

export function Journey() {
  // The last entry reached (by scrolling order) is the current one.
  const [current, setCurrent] = useState(-1)

  return (
    <section className="journey-section section page-width" id="journey">
      <SectionHeading eyebrow="JOURNEY" title="journeyTitle" intro="journeyIntro" />
      <div className="journey-grid">
        <Reveal>
          <h3 className="subheading"><T k="educationTitle" /></h3>
          <div className="education-list" id="education-list">
            {education.map((entry, index) => (
              <EducationItem
                key={`${entry.period}-${entry.degree.en}`}
                entry={entry}
                current={index === current}
                onReach={() => setCurrent((previous) => Math.max(previous, index))}
              />
            ))}
          </div>
        </Reveal>
        <div className="journey-aside">
        <Reveal className="honors-panel">
          <h3 className="subheading"><T k="honorsTitle" /></h3>
          <div id="honors-list">
            {honorYears.map((year) => (
              <div key={year} className="honor-group">
                <div className="honor-year">{year}</div>
                <div className="honor-items">
                  {honors.filter((honor) => honor.year === year).map((honor) => (
                    <div key={honor.title.en} className="honor-item">
                      <div className="title"><B value={honor.title} /></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <Glance />
        </div>
      </div>
    </section>
  )
}
