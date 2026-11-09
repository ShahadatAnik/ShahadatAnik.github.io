import { Minus, Plus } from 'lucide-react'
import { B, Dual, ExternalLink, Glyph, Period, Reveal, SectionHeading, T } from '@/components/ui'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { PROFILE_DATA, bi } from '@/data/content'
import { siteConfig } from '@/site.config'
import { useMotion } from '@/hooks/useMotion'

const { experience } = PROFILE_DATA

type ExperienceEntry = (typeof experience)[number]

/**
 * Accordion row built on <details>. The parent decides which row is open (only one at a time);
 * this row animates its height whenever that changes and keeps `open` set until the close animation ends.
 */
function ExperienceItem({ entry, open, onToggle }: { entry: ExperienceEntry; open: boolean; onToggle: () => void }) {
  const { allowed } = useMotion()
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const animation = useRef<Animation | null>(null)
  const initiallyOpen = useRef(open)
  const mounted = useRef(false)
  useEffect(() => () => animation.current?.cancel(), [])

  useEffect(() => {
    // Skip the first run: the row starts in its initial state without animating.
    if (!mounted.current) {
      mounted.current = true
      return
    }
    const details = detailsRef.current
    const content = contentRef.current
    if (!details || !content) return
    const currentHeight = details.open ? content.getBoundingClientRect().height : 0
    animation.current?.cancel()
    details.open = true
    const targetHeight = open ? content.scrollHeight : 0
    if (!allowed) {
      details.open = open
      content.style.height = ''
      content.style.overflow = ''
      return
    }
    content.style.overflow = 'hidden'
    const run = content.animate(
      [{ height: `${currentHeight}px`, opacity: open ? 0.5 : 1 }, { height: `${targetHeight}px`, opacity: open ? 1 : 0 }],
      { duration: 240, easing: 'cubic-bezier(.2,.7,.2,1)' },
    )
    animation.current = run
    run.finished.then(() => {
      if (animation.current !== run) return
      details.open = open
      content.style.height = ''
      content.style.overflow = ''
      animation.current = null
    }).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <details ref={detailsRef} className="experience-item" open={initiallyOpen.current} data-expanded={String(open)}>
      <summary
        aria-expanded={open}
        onClick={(event: MouseEvent) => {
          event.preventDefault()
          onToggle()
        }}
      >
        <div>
          <span className="period"><Period text={entry.period} /></span>
          <span className="title"><B value={entry.title} /></span>
        </div>
        <Glyph className="expand-icon" icon={open ? Minus : Plus} strokeWidth={2.2} />
      </summary>
      <div ref={contentRef} className="experience-content">
        <div className="experience-detail">
          <B value={entry.detail} />
          {'url' in entry && entry.url ? (
            <ExternalLink className="experience-link" href={entry.url}>{entry.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</ExternalLink>
          ) : null}
        </div>
      </div>
    </details>
  )
}

function Skills() {
  return (
    <div id="skills-list" className="skill-groups">
      {siteConfig.skills.map((group) => (
        <div key={group.group.en} className="skill-group">
          <h4><Dual en={group.group.en} ko={bi(group.group).ko} /></h4>
          <div className="skill-row">
            {group.items.map((item) => <span key={item} className="skill-chip">{item}</span>)}
          </div>
        </div>
      ))}
    </div>
  )
}

export function Experience() {
  // One row open at a time; the current role starts open.
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  return (
    <section className="experience-section section" id="experience">
      <div className="page-width">
        <SectionHeading eyebrow="EXPERIENCE" title="experienceTitle" intro="experienceIntro" />
        <div className="experience-grid">
          <Reveal className="experience-aside">
            <div className="skills-block">
              <h3 className="subheading"><T k="toolbox" /></h3>
              <Skills />
            </div>
          </Reveal>
          <div className="experience-roles">
            <h3 className="subheading"><T k="rolesTitle" /></h3>
            <div id="experience-list" className="experience-list">
              {experience.map((entry, index) => (
                <ExperienceItem
                  key={`${entry.period}-${entry.title.en}`}
                  entry={entry}
                  open={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
