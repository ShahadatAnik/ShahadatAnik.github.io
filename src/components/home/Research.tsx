import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { PROFILE_DATA } from '../../data/content'
import { Dual } from '../Dual'
import type { TopicId } from '../../data/i18n'
import { useInView } from '../../hooks/useInView'
import { useMotion } from '../../hooks/useMotion'
import { B, Reveal, T } from './shared'

const { research, publications } = PROFILE_DATA

const ROUTES: Record<TopicId, string> = {
  eeg: 'M320 200C250 200 210 95 145 95',
  brain: 'M320 200C390 200 420 95 500 95',
  nlp: 'M320 200C250 200 210 305 145 305',
  medical: 'M320 200C390 200 420 305 500 305',
}
const NODES: { id: TopicId; className: string; label: Parameters<typeof T>[0]['k'] }[] = [
  { id: 'eeg', className: 'node-eeg', label: 'topicEEG' },
  { id: 'brain', className: 'node-brain', label: 'topicBrain' },
  { id: 'nlp', className: 'node-nlp', label: 'topicNLP' },
  { id: 'medical', className: 'node-medical', label: 'topicMedical' },
]

function BrainAiVisual() {
  return (
    <svg className="brain-ai-visual" viewBox="0 0 160 132" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle className="brain-ai-aura" cx="80" cy="65" r="50" />
      <path className="brain-ai-orbit" d="M24 68C24 31 129 23 141 61S38 113 24 76" />
      <path className="brain-ai-hemisphere" d="M76 30C68 20 53 23 49 35C35 30 23 40 25 52C12 59 14 74 25 80C22 94 35 105 48 100C57 114 75 106 77 94V39Q77 33 76 30Z" />
      <g className="brain-ai-folds">
        <path d="M49 35C47 43 53 47 60 46C69 45 74 51 72 59" />
        <path d="M25 52C36 47 43 53 42 62C41 70 48 75 57 71" />
        <path d="M25 80C34 83 42 79 43 73M48 100C46 89 52 84 61 85C69 86 75 81 76 75" />
        <path d="M30 92C34 90 36 86 35 82M58 29C58 34 62 38 67 38M55 54C60 58 60 63 57 67M59 97C65 99 69 96 69 91" />
      </g>
      <g className="brain-ai-circuit">
        <path d="M104 47V35H95M116 47V26M129 55H141V43M132 68H149M132 82H143V95M118 94V110M105 94V103H93" />
        <rect className="brain-ai-chip" x="86" y="47" width="46" height="47" rx="10" />
        <rect className="brain-ai-chip-inner" x="93" y="54" width="32" height="33" rx="5" />
      </g>
      <g className="brain-ai-bridges">
        <path d="M59 60H70L80 54H86M60 78H73L80 84H86M76 69H86" />
        <path className="brain-ai-transmission" d="M59 60H70L80 54H86M60 78H73L80 84H86" />
      </g>
      <text className="brain-ai-chip-label" x="109" y="77" textAnchor="middle">AI</text>
      <g className="brain-ai-neurons"><circle cx="59" cy="60" r="3" /><circle cx="60" cy="78" r="3" /><circle cx="42" cy="62" r="2.6" /><circle cx="61" cy="85" r="2.6" /></g>
      <g className="brain-ai-terminals"><circle cx="95" cy="35" r="2.5" /><circle cx="116" cy="26" r="2.5" /><circle cx="141" cy="43" r="2.5" /><circle cx="149" cy="68" r="2.5" /><circle cx="143" cy="95" r="2.5" /><circle cx="118" cy="110" r="2.5" /><circle cx="93" cy="103" r="2.5" /></g>
      <circle className="brain-ai-spark brain-ai-spark-one" cx="59" cy="60" r="5" />
      <circle className="brain-ai-spark brain-ai-spark-two" cx="116" cy="26" r="4" />
      <circle className="brain-ai-spark brain-ai-spark-three" cx="60" cy="78" r="4.5" />
    </svg>
  )
}

function DirectionSketch() {
  return (
    <svg className="direction-sketch" viewBox="0 0 180 130" aria-hidden="true">
      <defs>
        <marker id="zz-sketch-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" /></marker>
      </defs>
      <g className="sketch-state sketch-eeg">
        <path className="sketch-edge" d="M12 37H21L25 30L30 48L36 23L42 43L47 37H71M12 63H25L30 56L36 73L42 49L48 68L53 63H71M12 89H21L26 81L32 100L38 76L44 94L49 89H71" />
        <path className="sketch-edge sketch-arrow" d="M76 63H107" />
        <path className="sketch-flow" pathLength="100" d="M12 63H25L30 56L36 73L42 49L48 68L53 63H71H107" />
        <rect className="sketch-box" x="116" y="39" width="51" height="47" rx="10" />
        <path className="sketch-edge" d="M128 53H154M128 63H151M128 73H143" />
        <circle className="sketch-point" cx="91" cy="63" r="3" />
      </g>
      <g className="sketch-state sketch-brain">
        <path className="sketch-edge" d="M22 31L68 22L65 64L24 95L22 31L65 64L108 35L152 63L112 98L65 64M68 22L108 35L112 98L24 95M22 31L24 95M108 35L152 63L112 98" />
        <path className="sketch-flow" pathLength="100" d="M22 31L65 64L108 35L152 63L112 98" />
        <g className="sketch-points"><circle cx="22" cy="31" r="6" /><circle cx="68" cy="22" r="6" /><circle cx="65" cy="64" r="8" /><circle cx="24" cy="95" r="6" /><circle cx="108" cy="35" r="6" /><circle cx="152" cy="63" r="7" /><circle cx="112" cy="98" r="6" /></g>
      </g>
      <g className="sketch-state sketch-nlp">
        <path className="sketch-edge sketch-arrow" d="M42 62L70 34M42 62L70 91M105 34L133 62M105 91L133 62" />
        <path className="sketch-flow" pathLength="100" d="M42 62L70 34M105 34L133 62M42 62L70 91M105 91L133 62" />
        <rect className="sketch-box" x="11" y="49" width="31" height="26" rx="6" /><rect className="sketch-box" x="72" y="20" width="31" height="26" rx="6" /><rect className="sketch-box" x="72" y="78" width="31" height="26" rx="6" /><rect className="sketch-box" x="136" y="49" width="31" height="26" rx="6" />
        <path className="sketch-writing" d="M19 58H33M19 65H29M80 29H95M80 36H91M80 87H95M80 94H91M144 58H159M144 65H155" />
      </g>
      <g className="sketch-state sketch-medical sketch-medical-health">
        <path className="sketch-box" d="M53 39C40 19 14 27 14 47C14 71 53 100 53 100S92 71 92 47C92 27 66 19 53 39Z" />
        <path className="sketch-edge" d="M24 59H36L42 47L50 76L59 43L67 59H81" />
        <path className="sketch-flow" pathLength="100" d="M24 59H36L42 47L50 76L59 43L67 59H81" />
        <path className="sketch-edge sketch-arrow" d="M96 63H110" />
        <rect className="sketch-box" x="117" y="39" width="43" height="48" rx="7" />
        <path className="sketch-edge" d="M126 32V39M138 32V39M150 32V39M126 87V94M138 87V94M150 87V94M110 49H117M110 62H117M110 75H117M160 49H167M160 62H167M160 75H167" />
        <text x="138.5" y="68" textAnchor="middle" fill="currentColor" stroke="none" fontSize="14" fontWeight="600">AI</text>
      </g>
    </svg>
  )
}

const STATIC_NOTES_CSS =
  '.research-explorer,.publication-toolbar,.result-summary,.pub-secondary-actions,#theme-toggle,#menu-toggle{display:none!important}.research-static-notes{display:grid;gap:24px}.research-static-notes p{margin-top:8px}.research-static-notes .ko{display:block;margin-top:6px}'

export function Research({ onExplore }: { onExplore: (topic: TopicId) => void }) {
  const { running } = useMotion()
  const [direction, setDirection] = useState<TopicId>('eeg')
  const [signaling, setSignaling] = useState<TopicId | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const routeRefs = useRef<Partial<Record<TopicId, SVGPathElement | null>>>({})
  const mapVisible = useInView(mapRef)
  const active = running && mapVisible

  const current = research.find((item) => item.id === direction) ?? research[0]
  const index = research.indexOf(current)
  const relatedCount = publications.filter((paper) => current.topics.some((topic) => (paper.topics as string[]).includes(topic))).length

  // Pause / resume running route pulses with the rest of the decorative motion.
  useEffect(() => {
    for (const route of Object.values(routeRefs.current)) {
      route?.getAnimations().forEach((animation) => {
        if (active) {
          if (animation.playState === 'paused') animation.play()
        } else if (animation.playState === 'running') animation.pause()
      })
    }
  }, [active])
  useEffect(() => {
    const routes = routeRefs.current
    return () => {
      for (const route of Object.values(routes)) route?.getAnimations().forEach((animation) => animation.cancel())
    }
  }, [])

  const select = (id: TopicId) => {
    setDirection(id)
    if (!active) return
    setSignaling(id)
    const route = routeRefs.current[id]
    if (route) {
      // Restart a short, local pulse.
      route.getAnimations().forEach((animation) => animation.cancel())
      route.animate(
        [
          { strokeDashoffset: '110', opacity: 0 },
          { strokeDashoffset: '100', opacity: 1, offset: 0.12 },
          { strokeDashoffset: '-10', opacity: 1, offset: 0.88 },
          { strokeDashoffset: '-20', opacity: 0 },
        ],
        { duration: 1400, easing: 'linear', iterations: 2 },
      )
    }
    panelRef.current?.animate([{ opacity: 0.65, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 260, easing: 'ease-out' })
  }

  const spot = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!active || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const node = event.currentTarget
    const bounds = node.getBoundingClientRect()
    node.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`)
    node.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`)
  }

  return (
    <section className="research-section section page-width" id="research">
      <Reveal className="section-heading">
        <div>
          <span className="eyebrow section-number">RESEARCH</span>
          <h2><T k="researchTitle" /></h2>
        </div>
        <p className="section-intro"><T k="researchIntro" /></p>
      </Reveal>
      <Reveal className="research-explorer">
        <div ref={mapRef} className={`research-map${active ? ' motion-active' : ''}`} data-visual-mode={direction} aria-label="Interactive research directions / 연구 분야 탐색">
          <div className="map-grid" aria-hidden="true" />
          <svg className="map-links" viewBox="0 0 640 400" preserveAspectRatio="none" aria-hidden="true">
            <path d="M320 200C250 200 210 95 145 95M320 200C390 200 420 95 500 95M320 200C250 200 210 305 145 305M320 200C390 200 420 305 500 305" />
            <circle cx="320" cy="200" r="86" />
            <circle cx="320" cy="200" r="111" />
            {NODES.map((node) => (
              <path
                key={`motion-${node.id}`}
                ref={(element) => { routeRefs.current[node.id] = element }}
                d={ROUTES[node.id]}
                className={`motion-route${signaling === node.id ? ' is-signaling' : ''}`}
                pathLength="100"
              />
            ))}
            {NODES.map((node) => (
              <path key={`visual-${node.id}`} d={ROUTES[node.id]} className={`visual-route visual-route-${node.id}${direction === node.id ? ' is-current' : ''}`} pathLength="100" />
            ))}
          </svg>
          <div className="map-center has-direction-sketch" aria-hidden="true">
            <BrainAiVisual />
            <DirectionSketch />
            <span>{direction === 'medical' ? 'MEDICAL × AI' : 'BRAIN × AI'}</span>
          </div>
          {NODES.map((node, i) => (
            <button
              key={node.id}
              type="button"
              className={`map-node ${node.className}${direction === node.id ? ' active' : ''}`}
              data-direction={node.id}
              aria-pressed={direction === node.id}
              onClick={() => select(node.id)}
              onPointerMove={spot}
            >
              <span><T k={node.label} /></span>
            </button>
          ))}
          <div className="map-caption"><span className="status-dot" /><span><T k="clickDirection" /></span></div>
        </div>
        <div ref={panelRef} className="direction-panel" aria-live="polite">
          <div className="direction-kicker"><span id="direction-index" hidden /><span><T k="researchFocus" /></span></div>
          <h3 id="direction-title"><B value={current.title} /></h3>
          <p id="direction-detail"><B value={current.detail} /></p>
          <div className="direction-papers" id="direction-papers">
            {relatedCount > 0 ? (
              <Dual en={`${relatedCount} related ${relatedCount === 1 ? 'paper' : 'papers'}`} ko={`관련 논문 ${relatedCount}편`} />
            ) : (
              <Dual en="No papers on this topic yet" ko="아직 이 주제의 논문이 없습니다" />
            )}
          </div>
          {relatedCount > 0 && (
            <button id="explore-direction" type="button" className="text-button" onClick={() => onExplore(direction)}>
              <span><T k="relatedWork" /></span>
            </button>
          )}
        </div>
      </Reveal>
      <noscript>
        <style>{STATIC_NOTES_CSS}</style>
        <div className="research-static-notes">
          {research.map((item) => (
            <article key={item.id}>
              <h3><B value={item.title} /></h3>
              <p><B value={item.detail} /></p>
            </article>
          ))}
        </div>
      </noscript>
    </section>
  )
}
