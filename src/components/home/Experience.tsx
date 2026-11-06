import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { PROFILE_DATA, bi } from '../../data/content'
import { siteConfig } from '../../site.config'
import { Dual } from '../Dual'
import { useMotion } from '../../hooks/useMotion'
import { motion } from 'framer-motion'
import { useReveal } from '../../hooks/useReveal'
import { B, Period, Reveal, T } from './shared'

const { experience } = PROFILE_DATA

type ExperienceEntry = (typeof experience)[number]

/** Accordion row built on <details>; the height animation keeps `open` set until the close animation ends. */
function ExperienceItem({ entry, defaultOpen = false }: { entry: ExperienceEntry; defaultOpen?: boolean }) {
  const { allowed } = useMotion()
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const animation = useRef<Animation | null>(null)
  const [expanded, setExpanded] = useState(defaultOpen)
  const reveal = useReveal()
  useEffect(() => () => animation.current?.cancel(), [])

  const toggle = (event: MouseEvent) => {
    event.preventDefault()
    const details = detailsRef.current
    const content = contentRef.current
    if (!details || !content) return
    const opening = !expanded
    setExpanded(opening)
    const currentHeight = details.open ? content.getBoundingClientRect().height : 0
    animation.current?.cancel()
    details.open = true
    const targetHeight = opening ? content.scrollHeight : 0
    if (!allowed) {
      details.open = opening
      content.style.height = ''
      content.style.overflow = ''
      return
    }
    content.style.overflow = 'hidden'
    const run = content.animate(
      [{ height: `${currentHeight}px`, opacity: opening ? 0.5 : 1 }, { height: `${targetHeight}px`, opacity: opening ? 1 : 0 }],
      { duration: 240, easing: 'cubic-bezier(.2,.7,.2,1)' },
    )
    animation.current = run
    run.finished.then(() => {
      if (animation.current !== run) return
      details.open = opening
      content.style.height = ''
      content.style.overflow = ''
      animation.current = null
    }).catch(() => {})
  }

  return (
    <motion.details ref={detailsRef} className="experience-item" open={defaultOpen} {...reveal} data-expanded={String(expanded)}>
      <summary aria-expanded={expanded} onClick={toggle}>
        <div>
          <span className="period"><Period text={entry.period} /></span>
          <span className="title"><B value={entry.title} /></span>
        </div>
        <span className="expand-icon" aria-hidden="true">{expanded ? '−' : '+'}</span>
      </summary>
      <div ref={contentRef} className="experience-content">
        <div className="experience-detail">
          <B value={entry.detail} />
          {'url' in entry && entry.url ? (
            <a className="experience-link" href={entry.url} target="_blank" rel="noopener">{entry.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</a>
          ) : null}
        </div>
      </div>
    </motion.details>
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
  return (
    <section className="experience-section section page-width" id="experience">
      <div className="experience-grid">
        <Reveal className="experience-heading">
          <span className="eyebrow section-number">BEYOND RESEARCH</span>
          <h2><T k="experienceTitle" /></h2>
          <p><T k="experienceIntro" /></p>
          <div className="skills-block">
            <span className="eyebrow"><T k="toolbox" /></span>
            <Skills />
          </div>
        </Reveal>
        <div id="experience-list" className="experience-list">
          {experience.map((entry, index) => (
            <ExperienceItem key={`${entry.period}-${entry.title.en}`} entry={entry} defaultOpen={index === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
