import { useEffect, useReducer, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { Dual } from '../../Dual'
import type { HobbyContext } from '../types'
import { drawArena } from './draw'
import { ArenaGame, H, ROUND, W } from './logic'
import './arena.css'

const EDITABLE = 'input,textarea,select,[contenteditable="true"]'

export default function Arena({ reducedMotion }: HobbyContext) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const startRef = useRef<HTMLButtonElement>(null)

  const [game] = useState(() => new ArenaGame({ reducedMotion }))
  const [, redraw] = useReducer((n: number) => n + 1, 0)
  const [canvasFailed, setCanvasFailed] = useState(false)

  const rafRef = useRef(0)
  const lastFrameRef = useRef(0)
  const lastHudRef = useRef('')
  const pointerRef = useRef<number | null>(null)
  const sizeRef = useRef({ width: W, height: H })
  const destroyedRef = useRef(false)

  function paint() {
    const canvas = canvasRef.current, ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || destroyedRef.current) return
    drawArena(ctx, game, sizeRef.current.width, sizeRef.current.height)
  }
  function hudKey() {
    return `${game.timeText}/${game.hp}/${game.dodged}/${Math.ceil(game.cooldown * 10) / 10}/${game.mode}/${game.status.en}`
  }
  /** Reconcile the frame loop and the screen with the game's current state. */
  function sync(force = true) {
    if (destroyedRef.current) return
    if (game.mode === 'running') {
      if (!rafRef.current) { lastFrameRef.current = performance.now(); rafRef.current = requestAnimationFrame(frame) }
    } else if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0 }
    const key = hudKey()
    if (force || key !== lastHudRef.current) { lastHudRef.current = key; redraw() }
    paint()
  }
  function frame(now: number) {
    rafRef.current = 0
    if (destroyedRef.current || game.mode !== 'running') return
    const delta = lastFrameRef.current ? (now - lastFrameRef.current) / 1000 : 0
    lastFrameRef.current = now
    game.advance(delta)
    if (game.mode === 'running') {
      rafRef.current = requestAnimationFrame(frame)
      sync(false)
    } else sync()
  }

  function start() {
    if (game.mode === 'paused') game.resume(document.hidden); else game.start()
    sync()
    if (game.mode === 'running') canvasRef.current?.focus({ preventScroll: true })
  }
  function pause(automatic = false) { game.pause(automatic); sync() }

  const latest = useRef({ pause, sync })
  latest.current = { pause, sync }

  useEffect(() => {
    destroyedRef.current = false
    const root = rootRef.current, canvas = canvasRef.current
    if (!root || !canvas) return
    if (!canvas.getContext('2d')) { setCanvasFailed(true); return }
    const scope: HTMLElement = root.closest('dialog') || root
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as Element | null
      const handled = game.keyDown({
        key: event.key, code: event.code, repeat: event.repeat,
        ctrlKey: event.ctrlKey, metaKey: event.metaKey, altKey: event.altKey,
        targetIsEditable: !!target?.closest?.(EDITABLE),
        targetIsButton: !!target?.closest?.('button,a'),
      })
      if (handled) { event.preventDefault(); latest.current.sync() }
    }
    const onKeyUp = (event: KeyboardEvent) => game.releaseKey(event.key)
    const onVisibility = () => { if (document.hidden) latest.current.pause(true) }
    // Changing window focus is not the same as hiding the game. Clear held keys, keep playing.
    const onWindowBlur = () => { game.clearKeys(); pointerRef.current = null }
    scope.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('blur', onWindowBlur)
    const resize = () => {
      if (destroyedRef.current) return
      const rect = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2)
      if (rect.width <= 0 || rect.height <= 0) return
      const width = Math.max(1, Math.round(rect.width * dpr)), height = Math.max(1, Math.round(rect.height * dpr))
      sizeRef.current = { width, height }
      if (canvas.width !== width) canvas.width = width
      if (canvas.height !== height) canvas.height = height
      paint()
    }
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    observer?.observe(canvas)
    if (!observer) window.addEventListener('resize', resize)
    resize()
    return () => {
      destroyedRef.current = true
      cancelAnimationFrame(rafRef.current); rafRef.current = 0
      scope.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('blur', onWindowBlur)
      window.removeEventListener('resize', resize)
      observer?.disconnect()
      game.clearKeys()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (game.mode === 'result') startRef.current?.focus({ preventScroll: true })
  }, [game.mode, game])

  function point(event: ReactPointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    game.setTarget((event.clientX - rect.left) / rect.width * W, (event.clientY - rect.top) / rect.height * H)
  }
  function releasePointer(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (pointerRef.current === event.pointerId) {
      pointerRef.current = null
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const { mode } = game
  let title: ReactNode, copy: ReactNode, startLabel: ReactNode
  if (canvasFailed) {
    title = <Dual en="Read. Move. Repeat." zh="预判，走位，再躲一招。" />
    copy = <Dual en="This browser could not start the canvas. Please try another browser." zh="此浏览器无法启动画布，请尝试其他浏览器。" />
    startLabel = <Dual en="Enter the arena" zh="开始挑战" />
  } else if (mode === 'paused') {
    title = <Dual en="Take a breath." zh="稍作休息。" />
    copy = game.automaticPause
      ? <Dual en="The round paused while this tab was hidden. Resume when you are ready." zh="切换标签页后，本局已暂停。准备好后继续。" />
      : <Dual en="Your round is paused. Pick up exactly where you left off." zh="本局已暂停，点击继续即可回到训练场。" />
    startLabel = <><Dual en="Resume training" zh="继续挑战" /> <span aria-hidden="true">↗</span></>
  } else if (mode === 'result' && game.result) {
    const { won, elapsed, dodged } = game.result
    title = won ? <Dual en="Beautiful footwork." zh="走位漂亮。" /> : <Dual en="One more try?" zh="再来一局？" />
    copy = <Dual en={`${won ? 'Round cleared' : 'Training complete'} · ${elapsed.toFixed(1)}s survived · ${dodged} attacks dodged.`} zh={`${won ? '挑战成功' : '训练结束'} · 坚持 ${elapsed.toFixed(1)} 秒 · 成功躲避 ${dodged} 次。`} />
    startLabel = <><Dual en="Play again" zh="再来一局" /> <span aria-hidden="true">↻</span></>
  } else {
    title = <Dual en="Read. Move. Repeat." zh="预判，走位，再躲一招。" />
    copy = <Dual en="Three lives. Forty-five seconds. Every attack gives you a warning." zh="三次机会，45 秒挑战。所有技能都会提前预警。" />
    startLabel = <><Dual en="Enter the arena" zh="开始挑战" /> <span aria-hidden="true">↗</span></>
  }

  return (
    <div className="harena" ref={rootRef}>
      <div className="ha-heading">
        <div><p className="ha-eyebrow">LEAGUE OF LEGENDS · FOOTWORK PRACTICE</p><h3><Dual en="One more dodge." zh="峡谷走位挑战" /></h3></div>
        <p className="ha-duration"><strong>{ROUND}<span style={{ fontSize: '.4em', letterSpacing: 0 }}>s</span></strong><Dual en="SURVIVE THE RIFT" zh="坚持到底" /></p>
      </div>
      <div className="ha-hud">
        <div><span className="ha-hud-label"><Dual en="REMAINING" zh="剩余时间" /></span><strong className="ha-value">{game.timeText}</strong></div>
        <div>
          <span className="ha-hud-label"><Dual en="HEALTH" zh="生命" /></span>
          <strong className="ha-lives" aria-label={`${game.hp} lives / ${game.hp} 次机会`}>
            {[0, 1, 2].map(i => <i key={i} className={i >= game.hp ? 'is-lost' : undefined}>♥</i>)}
          </strong>
        </div>
        <div><span className="ha-hud-label"><Dual en="DODGED" zh="成功躲避" /></span><strong className="ha-value">{String(game.dodged).padStart(2, '0')}</strong></div>
      </div>
      <div className="ha-field">
        <canvas
          ref={canvasRef}
          className="ha-canvas"
          width={900}
          height={520}
          tabIndex={0}
          aria-label="Skillshot arena. Click to move, use WASD or arrows, Space to dash. / 走位训练场。点地移动，WASD 或方向键移动，空格位移。"
          onPointerDown={event => {
            if (game.mode !== 'running' || (event.button !== 0 && event.button !== 2)) return
            event.preventDefault()
            event.currentTarget.focus({ preventScroll: true })
            pointerRef.current = event.pointerId
            point(event)
            try { event.currentTarget.setPointerCapture?.(event.pointerId) } catch { /* Pointer already released; the destination remains valid. */ }
          }}
          onPointerMove={event => { if (game.mode === 'running' && pointerRef.current === event.pointerId) point(event) }}
          onPointerUp={releasePointer}
          onPointerCancel={releasePointer}
          onLostPointerCapture={() => { pointerRef.current = null }}
          onContextMenu={event => event.preventDefault()}
          onBlur={() => game.clearKeys()}
        />
        <div className="ha-overlay" hidden={mode === 'running'}>
          <div className="ha-panel">
            <svg className="ha-crest" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M24 3 42 14v20L24 45 6 34V14Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <path d="m24 12 9 12-9 12-9-12Z" fill="currentColor" opacity=".85" />
              <path d="M24 5v5m0 28v5M9 15l5 3m20 13 5 3m0-19-5 3M14 31l-5 3" stroke="currentColor" />
            </svg>
            <h4>{title}</h4>
            <p>{copy}</p>
            <button className="ha-primary" type="button" ref={startRef} disabled={canvasFailed} onClick={start}>{startLabel}</button>
          </div>
        </div>
      </div>
      <div className="ha-controls">
        <div className="ha-buttons">
          <button
            type="button"
            className="ha-control ha-dash"
            disabled={!game.dashReady}
            style={{ '--ha-charge': String(1 - game.cooldown / 5) } as CSSProperties}
            onClick={() => { game.dash(); sync(); if (game.mode === 'running') canvasRef.current?.focus({ preventScroll: true }) }}
          >
            <span><kbd className="ha-key-note">SPACE</kbd><Dual en="Dash" zh="位移" /> <b>{game.cooldown > 0 ? `${game.cooldown.toFixed(1)}s` : '↗'}</b></span>
          </button>
          <button
            type="button"
            className="ha-control"
            disabled={mode !== 'running' && mode !== 'paused'}
            onClick={() => { if (game.mode === 'paused') start(); else pause() }}
          >
            {mode === 'paused' ? <Dual en="Resume" zh="继续" /> : <Dual en="Pause" zh="暂停" />}
          </button>
        </div>
        <div className="ha-legend" aria-hidden="true">
          <span><i /><Dual en="Line" zh="直线" /></span>
          <span><i /><Dual en="Impact" zh="落点" /></span>
          <span><i /><Dual en="Fan" zh="扇形" /></span>
        </div>
      </div>
      <p className="ha-instructions"><Dual en="Click the ground to move, or use WASD / arrow keys. Space dashes toward your destination; 5-second cooldown. Leave the red and gold warning zones before they activate." zh="鼠标点地或用 WASD／方向键移动，空格向移动方向位移，冷却 5 秒。手机可点地或拖动移动，并点击「位移」。在红色、金色预警生效前离开范围。" /></p>
      <p className="ha-status" role="status" aria-live="polite"><Dual en={game.status.en} zh={game.status.zh} /></p>
    </div>
  )
}
