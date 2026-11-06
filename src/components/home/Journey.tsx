import { useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { PROFILE_DATA } from '../../data/content'
import { B, Period, Reveal, T } from './shared'

const { education, honors } = PROFILE_DATA
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
          <a href={entry.url} target="_blank" rel="noopener" className="school-link"><B value={entry.school} /> <span aria-hidden="true">↗</span></a>
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
      <Reveal className="section-heading">
        <div>
          <span className="eyebrow section-number">JOURNEY</span>
          <h2><T k="journeyTitle" /></h2>
        </div>
        <p className="section-intro"><T k="journeyIntro" /></p>
      </Reveal>
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
      </div>
    </section>
  )
}
