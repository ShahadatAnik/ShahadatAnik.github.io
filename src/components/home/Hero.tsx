import { Arrow, Dual, ExternalLink, Name, T } from '../ui'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Fragment, useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { PROFILE_DATA, bi } from '../../data/content'
import { siteConfig } from '../../site.config'
import { useHeadlineEntrance } from '../../hooks/useHeadlineEntrance'
import { useInView } from '../../hooks/useInView'
import { useMotion } from '../../hooks/useMotion'

const { profile } = PROFILE_DATA

// Decorative signal paths, not recorded EEG or measured brain activity.
function ellipsePath(angle: number) {
  const radians = (angle * Math.PI) / 180
  const dx = 191 * Math.cos(radians)
  const dy = 191 * Math.sin(radians)
  const start = `${(210 + dx).toFixed(2)} ${(200 + dy).toFixed(2)}`
  const end = `${(210 - dx).toFixed(2)} ${(200 - dy).toFixed(2)}`
  return `M ${start} A 191 125 ${angle} 1 0 ${end} A 191 125 ${angle} 1 0 ${start}`
}

const SOCIAL_ICONS = {
  scholar: 'M2 6.5 8 3l6 3.5L8 10 2 6.5ZM4 8v3.5c2 1.5 6 1.5 8 0V8M14 7v5',
  github: 'm5.5 4-4 4 4 4M10.5 4l4 4-4 4M9 2 7 14',
  email: 'M2 3.5h12v9H2v-9Zm0 1L8 9l6-4.5',
  linkedin: 'M3 6.5v6M3 3.5v.01M6.5 12.5v-6m0 3c0-1.7 1-3 2.5-3s2.5 1.2 2.5 3v3',
}

function SocialIcon({ d }: { d: string }) {
  return (
    <svg className="social-icon" viewBox="0 0 16 16" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

function Fragments({ words }: { words: { text: string; em?: boolean }[] }) {
  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${word.text}-${index}`}>
          {index > 0 && ' '}
          <span className="headline-fragment">{word.em ? <em>{word.text}</em> : word.text}</span>
        </Fragment>
      ))}
    </>
  )
}

function HeroStatement() {
  const ref = useRef<HTMLHeadingElement>(null)
  useHeadlineEntrance(ref)
  const headline = siteConfig.hero.headline
  return (
    <h2 ref={ref} className="hero-statement">
      <span className="en" lang="en">
        {headline.en.map((line, index) => (
          <Fragment key={index}>
            {index > 0 && <br />}
            <Fragments words={line} />
          </Fragment>
        ))}
      </span>
      <span className="ko" lang="ko">
        {headline.ko.map((line, index) => (
          <Fragment key={index}>
            {index > 0 && <br className="ko-break" />}
            <span className="headline-fragment">{line}</span>
          </Fragment>
        ))}
      </span>
    </h2>
  )
}

export function Hero() {
  const { userPaused, reduced, running, toggle } = useMotion()
  const heroRef = useRef<HTMLDivElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const orbitRef = useRef<SVGSVGElement>(null)
  const heroVisible = useInView(heroRef)
  const active = running && heroVisible

  // SMIL particles follow the same pause rules as the CSS animations.
  useEffect(() => {
    const orbit = orbitRef.current
    if (!orbit || typeof orbit.pauseAnimations !== 'function') return
    if (active) orbit.unpauseAnimations()
    else orbit.pauseAnimations()
  }, [active])

  // Pointer parallax: motion values + springs drive transforms directly, with no React renders
  // and no CSS-variable invalidation across the large SVG.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 140, damping: 20, mass: 0.6 })
  const springY = useSpring(pointerY, { stiffness: 140, damping: 20, mass: 0.6 })
  const rotateX = useTransform(springY, (v) => -v * 3)
  const rotateY = useTransform(springX, (v) => v * 3)
  const artX = useTransform(springX, (v) => v * -7)
  const artY = useTransform(springY, (v) => v * -7)
  const bounds = useRef<DOMRect | null>(null)

  const resetDepth = () => {
    pointerX.set(0)
    pointerY.set(0)
  }
  useEffect(() => {
    if (!active) resetDepth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const onPointerEnter = () => {
    bounds.current = surfaceRef.current?.getBoundingClientRect() ?? null
  }
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = bounds.current
    if (!rect || !active || event.pointerType !== 'mouse') return
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const paused = userPaused || reduced
  const label = reduced
    ? { en: 'Motion off', ko: '애니메이션 꺼짐' }
    : userPaused
      ? { en: 'Play motion', ko: '애니메이션 재생' }
      : { en: 'Pause motion', ko: '애니메이션 일시정지' }

  return (
    <>
      <section className="hero page-width" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" /><span><T k="heroEyebrow" /></span></div>
          <h1><Name name={siteConfig.profile.name} /><span className="name-period">.</span></h1>
          <a className="job-status" href="#contact">
            <span className="job-status-indicator" aria-hidden="true" />
            <span><T k="jobStatus" /></span>
            <Arrow />
          </a>
          <HeroStatement />
          <div className="hero-bio"><T k="bio" /></div>
          <div className="hero-actions">
            <a className="button primary" href="#publications"><span><T k="exploreWork" /></span><Arrow /></a>
          </div>
          <div className="social-links">
            <ExternalLink id="hero-scholar" href={profile.scholar}><SocialIcon d={SOCIAL_ICONS.scholar} />Google Scholar</ExternalLink>
            <ExternalLink id="hero-github" href={profile.github}><SocialIcon d={SOCIAL_ICONS.github} />GitHub</ExternalLink>
            <ExternalLink id="hero-linkedin" href={profile.linkedin}><SocialIcon d={SOCIAL_ICONS.linkedin} />LinkedIn</ExternalLink>
            <a href={`mailto:${profile.email}`}><SocialIcon d={SOCIAL_ICONS.email} /><T k="emailLink" /></a>
          </div>
        </div>
        <div ref={heroRef} className="hero-visual">
          <div
            ref={surfaceRef}
            className={`portrait-surface signal-redesigned${active ? ' motion-active' : ''}`}
            onPointerEnter={onPointerEnter}
            onPointerMove={onPointerMove}
            onPointerLeave={resetDepth}
          >
            <svg className="signal-art" viewBox="0 0 460 456" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <radialGradient id="zz-signal-aura">
                  <stop stopColor="currentColor" stopOpacity=".19" />
                  <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>
              </defs>
              <motion.g className="signal-atmosphere" style={{ x: artX, y: artY }}>
                <circle className="signal-aura" cx="336" cy="142" r="172" />
                <g className="signal-ambient-lines">
                  <path d="M25 264C82 264 73 107 129 107M333 95C392 95 375 260 432 260" />
                  <path d="M17 158H46L52 149L61 177L70 132L79 169L87 158H112" />
                  <path d="M346 168L378 135L412 165L381 204L346 168L410 212M378 135L381 204M412 165L410 212" />
                  <path d="M38 310H74L94 290M375 293L398 317H429" />
                </g>
                <g className="signal-ambient-nodes">
                  <circle cx="378" cy="135" r="3" /><circle cx="412" cy="165" r="3" /><circle cx="381" cy="204" r="3" /><circle cx="410" cy="212" r="2" />
                  <circle cx="46" cy="158" r="3" /><circle cx="74" cy="310" r="3" /><circle cx="398" cy="317" r="3" />
                </g>
              </motion.g>
              <g className="signal-pipeline" transform="translate(16 0)">
                <path className="signal-track" d="M24 414H38L44 407L50 425L57 397L64 422L71 414H113C141 414 146 414 170 414M170 414L199 402L227 414L199 426L170 414M199 402L199 426M227 414H297M297 414H324" />
                <path className="signal-flow" pathLength="100" d="M24 414H38L44 407L50 425L57 397L64 422L71 414H113C141 414 146 414 170 414L199 402L227 414H297H324" />
                <g className="signal-pipeline-nodes"><circle cx="170" cy="414" r="4" /><circle cx="199" cy="402" r="4" /><circle cx="199" cy="426" r="4" /><circle cx="227" cy="414" r="4" /></g>
                <rect className="signal-language-token" x="324" y="400" width="80" height="28" rx="7" />
              </g>
            </svg>
            <div className="portrait-energy" aria-hidden="true">
              <span className="portrait-energy-glow portrait-energy-glow-violet" />
              <span className="portrait-energy-glow portrait-energy-glow-cyan" />
              <span className="portrait-energy-ring portrait-energy-ring-one"><i /></span>
              <span className="portrait-energy-ring portrait-energy-ring-two"><i /></span>
              <span className="portrait-energy-dust" />
            </div>
            <div className="portrait-topline"><span className="tiny-cross">+</span><span><Dual en="THE HUMAN BEHIND THE RESEARCH" ko="연구 뒤의 사람" /></span><span className="tiny-cross">+</span></div>
            <svg ref={orbitRef} className="portrait-orbits motion-orbits" viewBox="0 0 420 420" aria-hidden="true">
              <ellipse cx="210" cy="200" rx="191" ry="125" transform="rotate(-34 210 200)" />
              <ellipse cx="210" cy="200" rx="191" ry="125" transform="rotate(34 210 200)" />
              <circle cx="210" cy="200" r="174" />
              <circle className="orbit-dot" cx="365" cy="120" r="6" />
              <circle className="orbit-dot" cx="63" cy="286" r="5" />
              {[-34, 34].map((angle, index) => (
                <g key={angle} className={`motion-particle motion-particle-${index + 1}`}>
                  <circle r={index ? 5 : 6} className="motion-particle-core" />
                  <circle r={index ? 10 : 12} className="motion-particle-halo" />
                  <animateMotion path={ellipsePath(angle)} dur={index ? '14s' : '11s'} begin={index ? '-4s' : '-1s'} repeatCount="indefinite" calcMode="paced" />
                </g>
              ))}
            </svg>
            <motion.figure className="portrait" style={{ x: '-50%', rotate: -3, rotateX, rotateY }}>
              <img src="/assets/portrait.jpg" alt={siteConfig.profile.name} width={335} height={447} fetchPriority="high" />
              <figcaption><span className="portrait-name">{siteConfig.profile.name}</span><span><Dual en={siteConfig.hero.role.en} ko={bi(siteConfig.hero.role).ko} /></span></figcaption>
            </motion.figure>
            <span className="floating-label label-one"><Dual en="Human cognition" ko="인간의 인지" /></span>
            <span className="floating-label label-two"><Dual en="Artificial intelligence" ko="인공지능" /></span>
            <div className="signal-line">
              <svg viewBox="0 0 400 45" aria-hidden="true">
                <path d="M0 22h25l7-6 8 12 10-24 9 35 9-17h30l7-8 7 17 9-23 8 20 6-6h48l7-10 9 24 10-33 8 30 8-11h35l7-6 8 13 9-24 8 31 8-14h50" />
                <path className="motion-wave" pathLength="100" d="M0 22h25l7-6 8 12 10-24 9 35 9-17h30l7-8 7 17 9-23 8 20 6-6h48l7-10 9 24 10-33 8 30 8-11h35l7-6 8 13 9-24 8 31 8-14h50" />
              </svg>
              <span><Dual en="BRAIN → SIGNAL → INTELLIGENCE" ko="뇌 → 신호 → 지능" /></span>
            </div>
            <div className="signal-stage-legend" aria-hidden="true">
              <span>EEG</span>
              <span><Dual en="Representation" ko="표현" /></span>
              <span><Dual en="Language" ko="언어" /></span>
            </div>
            <span className="signal-word-label" aria-hidden="true"><Dual en="Hello." ko="안녕하세요." /></span>
          </div>
          <div className="portrait-foot"><span><T k="portraitFoot" /></span></div>
          <div className="motion-controls">
            <button
              type="button"
              className="motion-toggle"
              disabled={reduced}
              aria-pressed={paused}
              data-paused={String(paused)}
              aria-label={`${label.en} / ${label.ko}`}
              title={reduced ? 'Reduced motion preference is enabled / 시스템의 동작 줄이기 설정을 따릅니다' : ''}
              onClick={toggle}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path className="motion-pause-icon" d="M7 5v10M13 5v10" />
                <path className="motion-play-icon" d="m7 5 8 5-8 5Z" />
              </svg>
              <span className="motion-toggle-label"><Dual en={label.en} ko={label.ko} /></span>
            </button>
          </div>
        </div>
      </section>
      <div className="affiliation-strip page-width">
        {siteConfig.affiliations.map((item, index) => (
          <Fragment key={item.mark}>
            {index > 0 && <span className="affiliation-connector">↔</span>}
            <div className="affiliation">
              <span className={index > 0 ? 'institution-mark ntu' : 'institution-mark'}>{item.mark}<span>{item.markSub}</span></span>
              <div>
                <strong>
                  {'url' in item && item.url ? (
                    <ExternalLink className="affiliation-link" href={item.url}><Dual en={item.name.en} ko={bi(item.name).ko} /></ExternalLink>
                  ) : (
                    <Dual en={item.name.en} ko={bi(item.name).ko} />
                  )}
                </strong>
                <span><Dual en={item.detail.en} ko={bi(item.detail).ko} /></span>
              </div>
            </div>
          </Fragment>
        ))}
        <div className="research-keywords">{siteConfig.hero.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
      </div>
    </>
  )
}
