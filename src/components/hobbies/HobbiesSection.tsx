import { useInView } from 'framer-motion'
import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import type { CSSProperties, ErrorInfo, ReactNode } from 'react'
import { Dual } from '../Dual'
import type { HobbyContext, HobbyId } from './types'
import '../../styles/hobbies.css'

// Each experience is fetched only when it is opened. Every round lives in memory only.
const Cube = lazy(() => import('./cube/Cube'))
const Fitness = lazy(() => import('./fitness/Fitness'))
const Gallery = lazy(() => import('./gallery/Gallery'))
const Arena = lazy(() => import('./arena/Arena'))

const EXPERIENCES: Record<HobbyId, { title: [string, string]; kicker: string; Component: ComponentType<HobbyContext> }> = {
  cube: { title: ['Rubik’s Cube', '魔方'], kicker: '01 / A DIFFERENT PERSPECTIVE', Component: Cube },
  fitness: { title: ['Dumbbell rhythm', '箭头举铁'], kicker: '02 / FIND YOUR RHYTHM', Component: Fitness },
  gallery: { title: ['Through the lens', '光影作品廊'], kicker: '03 / MOMENTS IN ORBIT', Component: Gallery },
  arena: { title: ['Rift footwork', '峡谷走位挑战'], kicker: '04 / KEEP MOVING', Component: Arena },
}

function Loading() {
  return (
    <div className="hobby-loading" role="status">
      <span className="hobby-loading-orbit" aria-hidden="true" />
      <Dual en="A little break is loading…" zh="正在准备这一刻的小憩…" />
    </div>
  )
}

class ExperienceBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: unknown, info: ErrorInfo) { console.error('Could not open hobby', error, info.componentStack) }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="hobby-loading" role="alert">
        <Dual en="This experience could not load. Please close it and try again." zh="暂时无法加载，请关闭后重新打开。" />
      </div>
    )
  }
}

interface CardProps {
  id: HobbyId
  className: string
  heading: [string, string]
  level: [string, string]
  action: [string, string]
  label: string
  ready: boolean
  onOpen: (id: HobbyId, button: HTMLButtonElement) => void
  children: ReactNode
}

function HobbyCard({ id, className, heading, level, action, label, ready, onOpen, children }: CardProps) {
  return (
    <article className={`hobby-card ${className}`}>
      <div className="hobby-card-heading">
        <h3><Dual en={heading[0]} zh={heading[1]} /></h3>
        <p className="hobby-level"><Dual en={level[0]} zh={level[1]} /></p>
      </div>
      {children}
      <div className="hobby-card-bottom">
        <button className="hobby-open" type="button" aria-label={label} disabled={!ready} onClick={event => onOpen(id, event.currentTarget)}>
          <span><Dual en={action[0]} zh={action[1]} /></span><span aria-hidden="true">↗</span>
        </button>
      </div>
    </article>
  )
}

function RenderArt({ kind, src, width, height }: { kind: 'cube' | 'fitness' | 'arena'; src: string; width: number; height: number }) {
  return (
    <div className={`hobby-art hobby-art-${kind} hobby-art-render`} aria-hidden="true">
      <span className="hobby-art-orbit" /><span className="hobby-art-sparks" /><span className="hobby-art-shimmer" />
      <img className="hobby-art-image" src={src} alt="" width={width} height={height} loading="lazy" decoding="async" />
    </div>
  )
}

const ORBIT: { angle: number; name: string; width: number; height: number }[] = [
  { angle: -72, name: 'sunset', width: 520, height: 390 },
  { angle: 0, name: 'stained-glass', width: 520, height: 347 },
  { angle: 72, name: 'quiet-cat', width: 520, height: 390 },
  { angle: 144, name: 'seaside', width: 520, height: 390 },
  { angle: 216, name: 'coastal-portrait', width: 289, height: 520 },
]

export function HobbiesSection() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { margin: '120px' })
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const previousOverflowRef = useRef<string | null>(null)
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState<HobbyId | null>(null)
  const [context, setContext] = useState<HobbyContext>({ language: 'both', reducedMotion: false })

  useEffect(() => { setReady(true) }, [])

  function open(id: HobbyId, button: HTMLButtonElement) {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!dialog.open && document.querySelector('dialog[open]')) return
    triggerRef.current = button
    const root = document.documentElement
    setContext({
      language: root.dataset.language || 'both',
      reducedMotion: root.dataset.motionPaused === 'true' || matchMedia('(prefers-reduced-motion: reduce)').matches,
    })
    setActive(id)
  }

  // Open the native modal when an experience is chosen; lock page scroll while it is open.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || active === null) return
    if (!dialog.open) {
      previousOverflowRef.current = document.body.style.overflow
      dialog.showModal()
      document.body.style.overflow = 'hidden'
    }
    dialog.scrollTop = 0
  }, [active])

  function finish() {
    setActive(null)
    if (previousOverflowRef.current !== null) {
      document.body.style.overflow = previousOverflowRef.current
      previousOverflowRef.current = null
    }
    if (document.visibilityState !== 'hidden') triggerRef.current?.focus({ preventScroll: true })
    triggerRef.current = null
  }

  useEffect(() => {
    const onPageHide = () => {
      const dialog = dialogRef.current
      if (dialog?.open) dialog.close()
      finish()
    }
    window.addEventListener('pagehide', onPageHide)
    return () => {
      window.removeEventListener('pagehide', onPageHide)
      if (previousOverflowRef.current !== null) { document.body.style.overflow = previousOverflowRef.current; previousOverflowRef.current = null }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const experience = active ? EXPERIENCES[active] : null
  const Active = experience?.Component

  return (
    <>
      <section ref={sectionRef} data-in-view={inView} className={`hobbies-section section page-width${ready ? ' hobbies-ready' : ''}`} id="hobbies" aria-labelledby="hobbies-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow section-number">05 / OFF THE CLOCK</span>
            <h2 id="hobbies-title"><Dual en="Outside the lab." zh="爱好" /></h2>
          </div>
        </div>
        <div className="hobby-grid">
          <HobbyCard id="cube" className="hobby-card-cube" heading={['Rubik’s Cube', '魔方']} level={['Advanced amateur', '业余高级']} action={['Let’s play', '开始玩']} label="Play Rubik’s Cube / 玩魔方" ready={ready} onOpen={open}>
            <RenderArt kind="cube" src="/assets/hobbies/cube-3d.webp" width={640} height={640} />
          </HobbyCard>
          <HobbyCard id="fitness" className="hobby-card-fitness" heading={['Fitness', '健身']} level={['Beginner', '小白']} action={['Let’s play', '开始玩']} label="Play rhythm lifting / 玩节奏举铁" ready={ready} onOpen={open}>
            <RenderArt kind="fitness" src="/assets/hobbies/fitness-3d.webp" width={640} height={640} />
          </HobbyCard>
          <HobbyCard id="gallery" className="hobby-card-gallery" heading={['Photography', '摄影']} level={['Beginner', '小白']} action={['View gallery', '浏览作品']} label="Explore the photography gallery / 浏览摄影作品廊" ready={ready} onOpen={open}>
            <div className="hobby-art hobby-art-gallery" aria-hidden="true">
              <div className="photo-cover-floor" />
              <div className="photo-orbit-cover photo-orbit-filled">
                {ORBIT.map(item => (
                  <i key={item.name} style={{ '--orbit-angle': `${item.angle}deg` } as CSSProperties}>
                    <img src={`/assets/photos/${item.name}-preview.webp`} alt="" width={item.width} height={item.height} loading="lazy" decoding="async" />
                  </i>
                ))}
              </div>
            </div>
          </HobbyCard>
          <HobbyCard id="arena" className="hobby-card-arena" heading={['League of Legends', '英雄联盟']} level={['Diamond', '钻石']} action={['Let’s play', '开始玩']} label="Play Rift footwork / 玩峡谷走位挑战" ready={ready} onOpen={open}>
            <RenderArt kind="arena" src="/assets/hobbies/league-icon.webp" width={610} height={640} />
          </HobbyCard>
        </div>
        <p className="hobby-js-note"><Dual en="Enable JavaScript to open the games and interactive gallery." zh="启用 JavaScript 后即可打开小游戏与交互作品廊。" /></p>
      </section>
      <dialog
        className="hobby-dialog"
        id="hobby-dialog"
        ref={dialogRef}
        aria-labelledby="hobby-dialog-title"
        onClose={finish}
        onClick={event => {
          const dialog = event.currentTarget
          if (event.target !== dialog) return
          const rect = dialog.getBoundingClientRect()
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close()
        }}
      >
        <header className="hobby-dialog-header">
          <div>
            <span className="eyebrow" id="hobby-dialog-kicker">{experience?.kicker}</span>
            <h2 id="hobby-dialog-title">{experience && <Dual en={experience.title[0]} zh={experience.title[1]} />}</h2>
          </div>
          <button id="hobby-dialog-close" type="button" aria-label="Close game or gallery / 关闭游戏或作品廊" onClick={() => dialogRef.current?.close()}>×</button>
        </header>
        <div className="hobby-dialog-content" id="hobby-dialog-content" data-experience={active ?? undefined}>
          {Active && (
            <ExperienceBoundary key={active}>
              <Suspense fallback={<Loading />}>
                <Active {...context} />
              </Suspense>
            </ExperienceBoundary>
          )}
        </div>
      </dialog>
    </>
  )
}
