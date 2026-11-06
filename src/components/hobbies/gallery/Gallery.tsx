import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { Dual } from '../../Dual'
import type { HobbyContext } from '../types'
import { frontIndex, photoRatio } from './logic'
import { photographs } from './photos'
import type { Bilingual } from './photos'
import './gallery.css'

const photos = photographs.map(p => ({ ...p, ratio: photoRatio(p.width, p.height) }))
const frameCount = photos.length
const step = 360 / frameCount

interface Layout { radius: number; sizes: { width: number; height: number }[] }

export default function Gallery({ language, reducedMotion: reducedProp }: HobbyContext) {
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const lightboxRef = useRef<HTMLDialogElement>(null)

  const [rotation, setRotationState] = useState(0)
  const [layout, setLayout] = useState<Layout>({ radius: 250, sizes: photos.map(() => ({ width: 164, height: 218 })) })
  const [dragging, setDragging] = useState(false)
  const [live, setLive] = useState<'polite' | 'off'>('off')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const rotationRef = useRef(0)
  const velocityRef = useRef(0)
  const targetRef = useRef<number | null>(null)
  const draggingRef = useRef(false)
  const pointerIdRef = useRef<number | null>(null)
  const pointerXRef = useRef(0)
  const pointerStartXRef = useRef(0)
  const pointerTimeRef = useRef(0)
  const movedRef = useRef(false)
  const hoverRef = useRef(false)
  const lastInputRef = useRef(0)
  const frameRef = useRef(0)
  const previousTimeRef = useRef(0)
  const lightboxOpenRef = useRef(false)
  const lastFocusRef = useRef<HTMLElement | null>(null)
  const reducedRef = useRef(reducedProp)
  const destroyedRef = useRef(false)
  const lastIndexRef = useRef(-1)

  const setRotation = (value: number) => { rotationRef.current = value; setRotationState(value) }
  const chosen = (value: Bilingual) => language === 'zh' ? value.zh : language === 'en' ? value.en : [value.en, value.zh].filter(Boolean).join(' / ')

  function animate(time: number) {
    frameRef.current = 0
    if (destroyedRef.current || document.hidden || lightboxOpenRef.current) { previousTimeRef.current = 0; return }
    const elapsed = Math.min(40, Math.max(0, previousTimeRef.current ? time - previousTimeRef.current : 16))
    previousTimeRef.current = time
    const reduced = reducedRef.current
    let rot = rotationRef.current, changed = false
    const target = targetRef.current
    if (!draggingRef.current && target !== null) {
      const gap = target - rot
      if (Math.abs(gap) < .02 || reduced) { rot = target; targetRef.current = null }
      else rot += gap * (1 - Math.exp(-elapsed / 95))
      changed = true
    } else if (!draggingRef.current && Math.abs(velocityRef.current) > .001 && !reduced) {
      rot += velocityRef.current * elapsed
      velocityRef.current *= Math.exp(-elapsed / 190)
      changed = true
    } else if (!draggingRef.current && !hoverRef.current && !reduced && frameCount > 1 && time - lastInputRef.current > 4500 && !rootRef.current?.contains(document.activeElement)) {
      rot -= elapsed * .0035
      changed = true
    }
    if (changed) setRotation(rot)
    if (!reduced || targetRef.current !== null) frameRef.current = requestAnimationFrame(animate)
  }
  function tick() {
    if (!destroyedRef.current && !frameRef.current && !document.hidden && !lightboxOpenRef.current) frameRef.current = requestAnimationFrame(animate)
  }
  function interact() { lastInputRef.current = performance.now(); velocityRef.current = 0; targetRef.current = null }
  function move(direction: number) {
    if (frameCount < 2) return
    lastInputRef.current = performance.now()
    velocityRef.current = 0
    const target = Math.round(rotationRef.current / step) * step + direction * step
    if (reducedRef.current) { targetRef.current = null; setRotation(target) }
    else { targetRef.current = target; tick() }
  }
  function reset() {
    interact()
    // Choose the nearest equivalent zero angle so reset never spins several turns.
    const target = Math.round(rotationRef.current / 360) * 360
    if (reducedRef.current) { targetRef.current = null; setRotation(target) }
    else { targetRef.current = target; tick() }
  }
  function openPhotograph(index: number, trigger: HTMLElement) {
    if (movedRef.current || lightboxOpenRef.current || !photos[index]) return
    interact()
    lastFocusRef.current = trigger
    lightboxOpenRef.current = true
    setOpenIndex(index)
    if (frameRef.current) { cancelAnimationFrame(frameRef.current); frameRef.current = 0 }
  }
  function closePhotograph() {
    if (!lightboxOpenRef.current) return
    lightboxOpenRef.current = false
    setOpenIndex(null)
    const trigger = lastFocusRef.current
    if (trigger?.isConnected) trigger.focus({ preventScroll: true })
    lastFocusRef.current = null
    previousTimeRef.current = 0
    lastInputRef.current = performance.now()
    tick()
  }
  function endDrag(event: PointerEvent | ReactPointerEvent) {
    if (event.pointerId !== pointerIdRef.current) return
    draggingRef.current = false; pointerIdRef.current = null; setDragging(false)
    const stage = stageRef.current
    if (stage?.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId)
    if (reducedRef.current || event.type === 'pointercancel') velocityRef.current = 0
    lastInputRef.current = performance.now()
    tick()
  }

  const latest = useRef({ tick, endDrag, setRotation })
  latest.current = { tick, endDrag, setRotation }

  useEffect(() => {
    destroyedRef.current = false
    lastInputRef.current = performance.now()
    const stage = stageRef.current
    if (!stage) return
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    reducedRef.current = Boolean(reducedProp || media.matches)
    const onMedia = () => { reducedRef.current = Boolean(reducedProp || media.matches); if (reducedRef.current) velocityRef.current = 0; latest.current.tick() }
    media.addEventListener('change', onMedia)
    const onPointerEnd = (event: PointerEvent) => latest.current.endDrag(event)
    window.addEventListener('pointerup', onPointerEnd)
    window.addEventListener('pointercancel', onPointerEnd)
    const onWheel = (event: WheelEvent) => {
      if (frameCount < 2 || event.ctrlKey || lightboxOpenRef.current || (!stage.matches(':hover') && !stage.contains(document.activeElement))) return
      event.preventDefault()
      interact(); movedRef.current = true
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientHeight : 1
      const change = Math.max(-35, Math.min(35, delta * unit * .085))
      latest.current.setRotation(rotationRef.current - change)
      velocityRef.current = reducedRef.current ? 0 : -change * .015
      latest.current.tick()
    }
    stage.addEventListener('wheel', onWheel, { passive: false })
    const onVisibility = () => {
      previousTimeRef.current = 0
      if (document.hidden) {
        if (frameRef.current) cancelAnimationFrame(frameRef.current)
        frameRef.current = 0; draggingRef.current = false; velocityRef.current = 0; setDragging(false)
      } else { lastInputRef.current = performance.now(); latest.current.tick() }
    }
    document.addEventListener('visibilitychange', onVisibility)
    const resize = () => {
      const width = stage.clientWidth
      // Keep the whole composition visible, with frames that follow each
      // photograph's own proportions instead of cropping every image upright.
      const longest = width <= 600 ? Math.min(180, width * .62) : 250
      const sizes = photos.map(p => ({ width: p.ratio >= 1 ? longest : longest * p.ratio, height: p.ratio >= 1 ? longest / p.ratio : longest }))
      const cardWidth = Math.max(...sizes.map(s => s.width))
      const radius = Math.min(width * .36, Math.max(cardWidth * .95, cardWidth / (2 * Math.tan(Math.PI / frameCount)) + 35))
      setLayout({ radius, sizes })
    }
    const observer = new ResizeObserver(resize)
    observer.observe(stage)
    resize(); tick()
    return () => {
      destroyedRef.current = true
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      frameRef.current = 0
      observer.disconnect()
      media.removeEventListener('change', onMedia)
      window.removeEventListener('pointerup', onPointerEnd)
      window.removeEventListener('pointercancel', onPointerEnd)
      stage.removeEventListener('wheel', onWheel)
      document.removeEventListener('visibilitychange', onVisibility)
      lightboxRef.current?.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Drive the native <dialog> from React state.
  useEffect(() => {
    const dialog = lightboxRef.current
    if (!dialog) return
    if (openIndex !== null && !dialog.open) dialog.showModal()
    else if (openIndex === null && dialog.open) dialog.close()
  }, [openIndex])

  const index = frontIndex(rotation, frameCount)
  useEffect(() => {
    if (index === lastIndexRef.current) return
    lastIndexRef.current = index
    // Only announce captions while the visitor is actively rotating.
    setLive(performance.now() - lastInputRef.current < 1800 ? 'polite' : 'off')
  }, [index])

  const current = photos[index]
  const open = openIndex !== null ? photos[openIndex] : null
  const openTitle = open ? { en: open.title.en || open.alt.en, zh: open.title.zh || open.alt.zh } : null

  return (
    <section className="hgallery" ref={rootRef} aria-label="Photography gallery / 摄影作品廊">
      <div className="hgallery-head">
        <div>
          <div className="hgallery-kicker">LIGHT · FRAME · MOMENT</div>
          <h3><Dual en="Through my lens." zh="镜头里的片刻" /></h3>
          <p><Dual en="Rotate the gallery to explore. Open a photograph to see it in detail." zh="转动作品廊探索，点击照片查看大图。" /></p>
        </div>
        <span className="hgallery-count" aria-label={`${photos.length} photographs / ${photos.length} 幅作品`}>{String(photos.length).padStart(2, '0')}</span>
      </div>
      <div
        className="hgallery-stage"
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-label="Interactive photo carousel. Drag or use arrow keys to rotate. / 交互相册，拖动或按方向键旋转。"
        data-dragging={String(dragging)}
        onPointerEnter={() => { hoverRef.current = true }}
        onPointerLeave={() => { hoverRef.current = false }}
        onPointerDown={event => {
          if (frameCount < 2 || !event.isPrimary || event.button !== 0) return
          interact()
          draggingRef.current = true; movedRef.current = false; pointerIdRef.current = event.pointerId
          if (!(event.target as Element).closest('button')) event.currentTarget.focus({ preventScroll: true })
          pointerXRef.current = pointerStartXRef.current = event.clientX; pointerTimeRef.current = performance.now()
          setDragging(true)
        }}
        onPointerMove={event => {
          if (!draggingRef.current || event.pointerId !== pointerIdRef.current) return
          const now = performance.now(), delta = event.clientX - pointerXRef.current
          if (Math.abs(event.clientX - pointerStartXRef.current) > 7) {
            movedRef.current = true
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId)
          }
          setRotation(rotationRef.current + delta * .26)
          velocityRef.current = Math.max(-.35, Math.min(.35, delta * .26 / Math.max(8, now - pointerTimeRef.current)))
          pointerXRef.current = event.clientX; pointerTimeRef.current = now
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={event => {
          if (event.altKey || event.ctrlKey || event.metaKey || lightboxOpenRef.current) return
          if (event.key === 'ArrowLeft') { event.preventDefault(); move(1) }
          if (event.key === 'ArrowRight') { event.preventDefault(); move(-1) }
          if (event.key === 'Home') { event.preventDefault(); reset() }
        }}
      >
        <div className="hgallery-halo" aria-hidden="true" />
        <div className="hgallery-floor" aria-hidden="true" />
        <div className="hgallery-rotor" style={{ transform: `rotateX(-8deg) rotateY(${rotation}deg)` }}>
          {photos.map((item, i) => {
            const angle = i * step
            const facing = Math.cos((angle + rotation) * Math.PI / 180)
            const size = layout.sizes[i]
            const style: CSSProperties = {
              width: size.width,
              height: size.height,
              transform: `translate(-50%,-50%) rotateY(${angle}deg) translateZ(${layout.radius}px)`,
              opacity: Math.max(.18, .32 + (facing + 1) * .34),
              pointerEvents: facing > .3 ? 'auto' : 'none',
            }
            return (
              <button
                key={item.src}
                className="hgallery-card"
                type="button"
                data-frame={i}
                data-front={String(facing > .94)}
                tabIndex={facing > .3 ? 0 : -1}
                style={style}
                aria-label={chosen(item.title) || chosen(item.alt)}
                onClick={event => {
                  if (event.detail === 0) movedRef.current = false
                  openPhotograph(i, event.currentTarget)
                }}
              >
                <img src={item.src} alt={chosen(item.alt)} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" draggable={false} />
              </button>
            )
          })}
        </div>
      </div>
      <div className="hgallery-caption" aria-live={live} aria-atomic="true">
        <Dual en={current.title.en || current.alt.en} zh={current.title.zh || current.alt.zh} />
      </div>
      <div className="hgallery-footer">
        <p className="hgallery-hint"><Dual en="DRAG TO ROTATE · SCROLL TO EXPLORE · ← → KEYS" zh="拖动旋转 · 滚轮切换 · 支持左右方向键" /></p>
        <div className="hgallery-controls">
          <button className="hgame-button hgallery-prev" type="button" aria-label="Previous frame / 上一张" onClick={() => move(1)}><span className="hgallery-arrow" aria-hidden="true">←</span></button>
          <button className="hgame-button hgallery-reset" type="button" onClick={reset}><Dual en="Reset view" zh="重置视角" /></button>
          <button className="hgame-button hgallery-next" type="button" aria-label="Next frame / 下一张" onClick={() => move(-1)}><span className="hgallery-arrow" aria-hidden="true">→</span></button>
        </div>
      </div>
      <dialog
        className="hgallery-lightbox"
        ref={lightboxRef}
        aria-label="Photograph detail / 摄影作品大图"
        onCancel={event => { event.preventDefault(); event.stopPropagation(); closePhotograph() }}
        onClick={event => { if (event.target === event.currentTarget) closePhotograph() }}
      >
        <div className="hgallery-lightbox-close">
          <button type="button" onClick={closePhotograph}><Dual en="Back to gallery" zh="返回作品廊" /> <span aria-hidden="true">×</span></button>
        </div>
        <figure>
          {open && openTitle && (
            <>
              <img src={open.fullSrc} alt={chosen(open.alt)} />
              <figcaption>
                <Dual en={openTitle.en} zh={openTitle.zh} />
                {open.caption && (open.caption.en || open.caption.zh) && (
                  <div className="hgallery-lightbox-description"><Dual en={open.caption.en} zh={open.caption.zh} /></div>
                )}
              </figcaption>
            </>
          )}
        </figure>
      </dialog>
    </section>
  )
}
