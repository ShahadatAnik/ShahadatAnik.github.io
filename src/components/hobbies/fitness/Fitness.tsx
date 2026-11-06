import { useEffect, useReducer, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Dual } from '../../Dual'
import type { HobbyContext } from '../types'
import {
  DIRECTIONS, ROUND_MS, SPEEDS, advanceRound, createRound, keyDirection, releaseRound, strikeRound,
} from './logic'
import type { Direction, JudgmentEvent, Round, SpeedName } from './logic'
import './fitness.css'

type Phase = 'ready' | 'running' | 'paused' | 'finished'

const ARROWS: Record<Direction, string> = { left: '←', down: '↓', up: '↑', right: '→' }
const ARROW_ZH: Record<Direction, string> = { left: '左', down: '下', up: '上', right: '右' }
const COLORS: Record<Direction, string> = { left: '#bb9ae8', down: '#efad73', up: '#8bd3b3', right: '#8fc3e5' }
const SPEED_LABELS: Record<SpeedName, [string, string]> = { slow: ['Slow', '慢速'], medium: ['Medium', '中速'], fast: ['Fast', '快速'] }
const SPEED_NAMES = Object.keys(SPEEDS) as SpeedName[]

interface Size { width: number; height: number }
interface Lift { left: number; right: number; glow: number }

function drawArrow(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, direction: Direction, color: string, reduced: boolean, alpha = 1, outline = false) {
  ctx.save(); ctx.translate(x, y)
  ctx.rotate({ up: 0, right: Math.PI / 2, down: Math.PI, left: -Math.PI / 2 }[direction]); ctx.globalAlpha = alpha
  ctx.beginPath()
  ctx.moveTo(0, -size * .52); ctx.lineTo(size * .47, -size * .05); ctx.lineTo(size * .19, -size * .05); ctx.lineTo(size * .19, size * .43)
  ctx.lineTo(-size * .19, size * .43); ctx.lineTo(-size * .19, -size * .05); ctx.lineTo(-size * .47, -size * .05); ctx.closePath()
  if (outline) { ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke() }
  else {
    ctx.shadowBlur = reduced ? 0 : 13; ctx.shadowColor = color; ctx.fillStyle = color; ctx.fill(); ctx.shadowBlur = 0
    ctx.strokeStyle = '#ffffff60'; ctx.lineWidth = 1; ctx.stroke()
  }
  ctx.restore()
}

function renderLanes(ctx: CanvasRenderingContext2D, size: Size, round: Round, phase: Phase, reduced: boolean, language: string) {
  const { width: w, height: h } = size, line = h - 62, lane = w / 4, arrowSize = Math.min(48, lane * .62)
  const bg = ctx.createLinearGradient(0, 0, w, h); bg.addColorStop(0, '#292735'); bg.addColorStop(1, '#191f2b'); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  DIRECTIONS.forEach((direction, i) => {
    const x = (i + .5) * lane
    ctx.fillStyle = i % 2 ? '#ffffff03' : '#00000008'; ctx.fillRect(i * lane, 0, lane, h)
    ctx.strokeStyle = '#ffffff08'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo((i + 1) * lane, 0); ctx.lineTo((i + 1) * lane, h); ctx.stroke()
    const isHeld = round.held[direction]
    drawArrow(ctx, x, line, arrowSize, direction, isHeld ? COLORS[direction] : '#8a8697', reduced, isHeld ? 1 : .6, true)
  })
  ctx.fillStyle = '#91d5ae0d'; ctx.fillRect(0, line - 17, w, 34)
  ctx.strokeStyle = '#efbc7f8c'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, line); ctx.lineTo(w, line); ctx.stroke()
  if (phase === 'ready') {
    for (const [direction, previewY] of [['left', 72], ['up', 142], ['right', 215]] as [Direction, number][])
      drawArrow(ctx, (DIRECTIONS.indexOf(direction) + .5) * lane, previewY, arrowSize, direction, COLORS[direction], reduced, .45)
  } else {
    for (const note of round.notes) {
      const x = (DIRECTIONS.indexOf(note.direction) + .5) * lane
      if (note.resolved) {
        const age = round.elapsed - (note.resolvedAt ?? 0)
        if (age < 240 && note.grade !== 'miss' && !reduced) {
          ctx.strokeStyle = COLORS[note.direction]; ctx.globalAlpha = 1 - age / 240; ctx.lineWidth = 2
          ctx.beginPath(); ctx.arc(x, line, arrowSize * .5 + age * .08, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1
        }
        continue
      }
      if (round.elapsed < note.spawnAt || round.elapsed > note.hitAt + round.config.good) continue
      const progress = (round.elapsed - note.spawnAt) / (note.hitAt - note.spawnAt), y = -arrowSize + (line + arrowSize) * progress
      drawArrow(ctx, x, y, arrowSize, note.direction, COLORS[note.direction], reduced)
    }
  }
  ctx.textAlign = 'center'; ctx.font = '9px sans-serif'; ctx.fillStyle = '#a8a3b4'
  ctx.fillText(language === 'zh' ? '判 定 线' : 'JUDGEMENT LINE', w / 2, h - 15)
}

type Point = [number, number]
function stroke(ctx: CanvasRenderingContext2D, points: Point[], color: string, width: number) {
  ctx.beginPath(); ctx.moveTo(...points[0]); points.slice(1).forEach(point => ctx.lineTo(...point))
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke()
}
function rounded(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, color: string) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = color; ctx.fill()
}
function ellipse(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, color: string) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill()
}

function renderAthlete(ctx: CanvasRenderingContext2D, size: Size, lift: Lift, reduced: boolean) {
  const { width: w, height: h } = size
  const bg = ctx.createLinearGradient(0, 0, w, h); bg.addColorStop(0, '#362c33'); bg.addColorStop(1, '#25242f'); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  const light = ctx.createRadialGradient(w * .5, h * .4, 0, w * .5, h * .4, w * .8)
  light.addColorStop(0, `rgba(237,171,96,${.13 + lift.glow * .12})`); light.addColorStop(1, '#edab6000'); ctx.fillStyle = light; ctx.fillRect(0, 0, w, h)
  const scale = Math.min(w / 235, h / 315); ctx.save(); ctx.translate(w / 2, h * .53); ctx.scale(scale, scale)
  ellipse(ctx, 0, 119, 85, 9, '#171b23'); stroke(ctx, [[-92, 119], [92, 119]], '#dfaa6d35', 2)
  stroke(ctx, [[-13, 47], [-29, 82], [-33, 113]], '#747c8a', 18); stroke(ctx, [[13, 47], [29, 82], [33, 113]], '#a4aebb', 18)
  stroke(ctx, [[-43, 116], [-23, 116]], '#e8dfd4', 9); stroke(ctx, [[23, 116], [43, 116]], '#e8dfd4', 9)
  const shirt = ctx.createLinearGradient(-32, -43, 32, 58); shirt.addColorStop(0, '#ad9edc'); shirt.addColorStop(1, '#756698')
  rounded(ctx, -30, -42, 60, 101, 21, shirt as unknown as string)
  rounded(ctx, -9, -60, 18, 22, 6, '#e7bfa0'); ellipse(ctx, 0, -82, 22, 25, '#efceb0')
  ctx.beginPath(); ctx.arc(0, -89, 24, Math.PI, Math.PI * 2); ctx.fillStyle = '#33313e'; ctx.fill(); rounded(ctx, -22, -99, 44, 9, 5, '#eda663')
  for (const side of [-1, 1]) {
    const amount = side === -1 ? lift.left : lift.right
    const p = reduced ? (amount > .1 ? .65 : 0) : Math.sin(amount * Math.PI), handX = side * (63 - p * 9), handY = 36 - p * 88
    stroke(ctx, [[side * 30, -25], [side * 50, 7], [handX, handY]], side < 0 ? '#d6b498' : '#efceb0', 14)
    stroke(ctx, [[handX - 21, handY], [handX + 21, handY]], '#c1c8d0', 5)
    rounded(ctx, handX - 25, handY - 15, 10, 30, 3, '#e29a6f'); rounded(ctx, handX + 15, handY - 15, 10, 30, 3, '#edb473'); ellipse(ctx, handX, handY, 7, 7, '#f3d0af')
  }
  if (lift.glow > .1 && !reduced) {
    ctx.strokeStyle = `rgba(145,213,174,${lift.glow * .4})`; ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(0, -2, 102 + (1 - lift.glow) * 12, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke()
  }
  ctx.restore()
}

function gradeLabel(event: JudgmentEvent): [string, string] {
  if (event.grade === 'perfect') return ['Perfect', '完美']
  if (event.grade === 'good') return ['Good', '不错']
  return event.source === 'wrong' ? ['Wrong arrow', '方向错误'] : ['Miss', '漏掉了']
}

export default function Fitness({ language, reducedMotion: reduced }: HobbyContext) {
  const rootRef = useRef<HTMLDivElement>(null)
  const laneRef = useRef<HTMLCanvasElement>(null)
  const athleteRef = useRef<HTMLCanvasElement>(null)
  const startRef = useRef<HTMLButtonElement>(null)

  const [, redraw] = useReducer((n: number) => n + 1, 0)
  const [phase, setPhaseState] = useState<Phase>('ready')
  const [speed, setSpeed] = useState<SpeedName>('medium')
  const [feedback, setFeedback] = useState<JudgmentEvent | null>(null)

  const roundRef = useRef<Round>(createRound())
  const phaseRef = useRef<Phase>('ready')
  const frameRef = useRef(0)
  const lastNowRef = useRef(0)
  const destroyedRef = useRef(false)
  const liftRef = useRef<Lift>({ left: 0, right: 0, glow: 0 })
  const sizesRef = useRef(new Map<HTMLCanvasElement, Size>())

  const setPhase = (next: Phase) => { phaseRef.current = next; setPhaseState(next) }
  const round = roundRef.current

  function draw() {
    if (destroyedRef.current) return
    const lanes = laneRef.current, athlete = athleteRef.current
    const laneCtx = lanes?.getContext('2d'), athleteCtx = athlete?.getContext('2d')
    if (lanes && laneCtx) renderLanes(laneCtx, sizesRef.current.get(lanes) ?? { width: 450, height: 360 }, roundRef.current, phaseRef.current, reduced, language)
    if (athlete && athleteCtx) renderAthlete(athleteCtx, sizesRef.current.get(athlete) ?? { width: 300, height: 360 }, liftRef.current, reduced)
  }
  function stopFrame() { cancelAnimationFrame(frameRef.current); frameRef.current = 0; lastNowRef.current = 0 }

  function applyFeedback(event: JudgmentEvent | null | undefined) {
    if (!event) return
    setFeedback(event)
    if (event.grade !== 'miss') {
      if (event.direction === 'left' || event.direction === 'up') liftRef.current.left = 1; else liftRef.current.right = 1
      liftRef.current.glow = 1
    }
  }

  function finish() {
    setPhase('finished'); stopFrame(); setFeedback(null)
    redraw(); draw()
  }
  function syncClock(now: number): boolean {
    const elapsed = lastNowRef.current ? Math.max(0, now - lastNowRef.current) : 0
    lastNowRef.current = Math.max(lastNowRef.current, now)
    const events = advanceRound(roundRef.current, elapsed)
    if (events.length) applyFeedback(events[events.length - 1])
    if (roundRef.current.done) { finish(); return false }
    return true
  }
  function tick(now: number) {
    if (destroyedRef.current || phaseRef.current !== 'running') return
    const visualDelta = Math.min(lastNowRef.current ? Math.max(0, now - lastNowRef.current) : 0, 100)
    if (!syncClock(now)) return
    const lift = liftRef.current
    lift.left = Math.max(0, lift.left - visualDelta / 560); lift.right = Math.max(0, lift.right - visualDelta / 560); lift.glow = Math.max(0, lift.glow - visualDelta / 800)
    redraw(); draw()
    frameRef.current = requestAnimationFrame(tick)
  }
  function begin() {
    stopFrame()
    roundRef.current = createRound(speed)
    liftRef.current = { left: 0, right: 0, glow: 0 }
    setPhase('running'); setFeedback(null)
    rootRef.current?.focus({ preventScroll: true })
    lastNowRef.current = performance.now()
    frameRef.current = requestAnimationFrame(tick)
    redraw()
  }
  function setPaused(paused: boolean) {
    if (paused && phaseRef.current === 'running') {
      if (!syncClock(performance.now())) return
      setPhase('paused'); stopFrame(); roundRef.current.held = {}
      redraw(); draw()
    } else if (!paused && phaseRef.current === 'paused') {
      setPhase('running'); redraw()
      rootRef.current?.focus({ preventScroll: true })
      lastNowRef.current = performance.now()
      frameRef.current = requestAnimationFrame(tick)
    }
  }
  function attempt(direction: Direction, repeat = false) {
    if (phaseRef.current !== 'running' || repeat) return
    if (!syncClock(performance.now())) return
    applyFeedback(strikeRound(roundRef.current, direction, { repeat }))
    redraw(); draw()
  }
  function release(direction: Direction) { releaseRound(roundRef.current, direction); redraw() }

  const latest = useRef({ setPaused, release, draw })
  latest.current = { setPaused, release, draw }

  useEffect(() => {
    destroyedRef.current = false
    const sizes = sizesRef.current
    const onKeyUp = (event: KeyboardEvent) => { const direction = keyDirection(event.key, event.code); if (direction) latest.current.release(direction) }
    const onVisibility = () => { if (document.hidden) latest.current.setPaused(true) }
    // Releasing outside the panel only clears held-key state; it never intercepts
    // page keys. This avoids a stuck direction if focus moved while held down.
    window.addEventListener('keyup', onKeyUp)
    document.addEventListener('visibilitychange', onVisibility)
    const resize = () => {
      for (const canvas of [laneRef.current, athleteRef.current]) {
        if (!canvas) continue
        const rect = canvas.getBoundingClientRect()
        if (!rect.width || !rect.height) continue
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr)
        canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0)
        sizes.set(canvas, { width: rect.width, height: rect.height })
      }
      latest.current.draw()
    }
    const observer = new ResizeObserver(resize)
    if (laneRef.current) observer.observe(laneRef.current)
    if (athleteRef.current) observer.observe(athleteRef.current)
    resize()
    return () => {
      destroyedRef.current = true
      stopFrame()
      observer.disconnect()
      window.removeEventListener('keyup', onKeyUp)
      document.removeEventListener('visibilitychange', onVisibility)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    draw()
    if (phase === 'finished') startRef.current?.focus({ preventScroll: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const running = phase === 'running'
  let overlay: ReactNode = null
  if (phase === 'ready') {
    overlay = (
      <>
        <div className="hf-arrow-sample" aria-hidden="true">← ↓ ↑ →</div>
        <h3><Dual en="A little rhythm. A little strength." zh="跟着节奏，举起哑铃。" /></h3>
        <p><Dual en="Choose Slow, Medium or Fast, then start. Match the falling arrows at the bottom line. Use the arrow buttons on a touch screen." zh="选择慢速、中速或快速，再开始训练。在底部判定线匹配下落箭头；触屏可使用下方四个方向按钮。" /></p>
      </>
    )
  } else if (phase === 'paused') {
    overlay = (
      <>
        <h3><Dual en="Paused" zh="已暂停" /></h3>
        <p><Dual en="Time and arrows are on hold. Press Resume when you are ready." zh="计时和箭头已停下，准备好后点击「继续」。" /></p>
      </>
    )
  } else if (phase === 'finished') {
    overlay = (
      <>
        <h3><Dual en="Session complete" zh="训练完成" /></h3>
        <strong>{round.score}</strong>
        <p><Dual en={`${round.reps} lifts · ${round.perfect} perfect · best combo ${round.bestCombo}`} zh={`${round.reps} 次举起 · ${round.perfect} 次完美 · 最高 ${round.bestCombo} 连击`} /></p>
        <p><Dual en="Choose a pace and train again." zh="可重新选择速度，再练一局。" /></p>
      </>
    )
  }
  const label = feedback ? gradeLabel(feedback) : null

  return (
    <div
      className="hfitness"
      ref={rootRef}
      tabIndex={0}
      aria-label="Falling-arrow dumbbell game / 方向箭头哑铃小游戏"
      onKeyDown={event => {
        const direction = keyDirection(event.key, event.code)
        if (!direction || phaseRef.current !== 'running' || (event.target as Element).closest('input,textarea,select,[contenteditable="true"]')) return
        event.preventDefault()
        attempt(direction, event.repeat)
      }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) { roundRef.current.held = {}; redraw() }
      }}
    >
      <p className="hf-instructions"><Dual en="Follow the arrows from top to bottom. Press the matching arrow key when a note meets the glowing line to lift a dumbbell." zh="箭头从上向下落。到达发光判定线时，按下对应方向键，让人物举起哑铃。" /></p>
      <div className="hf-setup">
        <span className="hf-setup-title"><Dual en="CHOOSE YOUR PACE" zh="选择训练速度" /></span>
        <fieldset className="hf-speeds">
          <legend><Dual en="Training speed" zh="训练速度" /></legend>
          {SPEED_NAMES.map(name => (
            <label key={name}>
              <input type="radio" name="hf-speed" value={name} checked={speed === name} disabled={phase === 'running' || phase === 'paused'} onChange={() => setSpeed(name)} />
              <span><Dual en={SPEED_LABELS[name][0]} zh={SPEED_LABELS[name][1]} /></span>
            </label>
          ))}
        </fieldset>
      </div>
      <dl className="hf-hud">
        <div className="hf-stat"><dt><Dual en="TIME" zh="剩余时间" /></dt><dd>{Math.max(0, Math.ceil((ROUND_MS - round.elapsed) / 1000))}<span style={{ fontSize: 12 }}>s</span></dd></div>
        <div className="hf-stat"><dt><Dual en="SCORE" zh="得分" /></dt><dd>{round.score}</dd></div>
        <div className="hf-stat"><dt><Dual en="COMBO" zh="连击" /></dt><dd>{round.combo}</dd></div>
        <div className="hf-stat"><dt><Dual en="GOOD REPS" zh="有效次数" /></dt><dd>{round.reps}</dd></div>
      </dl>
      <div className="hf-board">
        <div className="hf-arrow-panel">
          <canvas ref={laneRef} aria-label="Four falling-arrow lanes / 四列下落方向箭头" onPointerDown={() => { if (running) rootRef.current?.focus({ preventScroll: true }) }} />
          <div className="hf-panel-caption">ARROW TRAINING / 40 SEC</div>
        </div>
        <div className="hf-athlete-panel">
          <canvas ref={athleteRef} aria-label="Athlete raises a dumbbell for each correct arrow / 正确命中时人物举起哑铃" onPointerDown={() => { if (running) rootRef.current?.focus({ preventScroll: true }) }} />
          <div className="hf-panel-caption">FIND YOUR RHYTHM</div>
        </div>
        <div className="hf-grade" data-grade={feedback?.grade ?? 'ready'} role="status" aria-live="polite">
          {feedback && label && <><Dual en={label[0]} zh={label[1]} /> {ARROWS[feedback.direction]}</>}
        </div>
        <div className="hf-duration"><span style={{ transform: `scaleX(${1 - round.elapsed / ROUND_MS})` }} /></div>
        <div className="hf-overlay" hidden={running}>{overlay}</div>
      </div>
      <div className="hf-controls">
        <div className="hf-session-actions">
          <button className="hgame-button hf-start" type="button" ref={startRef} hidden={phase === 'running' || phase === 'paused'} onClick={begin}>
            {phase === 'finished' ? <Dual en="Train again" zh="再练一局" /> : <Dual en="Start session" zh="开始训练" />}
          </button>
          <button className="hgame-button" type="button" hidden={phase === 'ready' || phase === 'finished'} onClick={() => setPaused(phaseRef.current === 'running')}>
            {phase === 'paused' ? <Dual en="Resume" zh="继续" /> : <Dual en="Pause" zh="暂停" />}
          </button>
        </div>
        <div className="hf-keys" role="group" aria-label="Arrow controls / 方向操作">
          {DIRECTIONS.map(direction => (
            <button
              key={direction}
              className="hf-key"
              type="button"
              disabled={!running}
              data-pressed={String(Boolean(round.held[direction]))}
              aria-label={`${direction} / ${ARROW_ZH[direction]}`}
              onPointerDown={event => {
                if (event.button !== 0 || phaseRef.current !== 'running') return
                event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); attempt(direction)
              }}
              onPointerUp={() => release(direction)}
              onPointerCancel={() => release(direction)}
              onLostPointerCapture={() => release(direction)}
              onClick={event => { if (event.detail === 0) { attempt(direction); release(direction) } }}
            >
              {ARROWS[direction]}
            </button>
          ))}
        </div>
      </div>
      <p className="hf-note"><Dual en="Arrow keys / numeric-keypad arrows · one press per note · wrong directions and missed arrows break your combo. Pause any time; switching tabs pauses automatically. No progress is saved." zh="使用键盘方向键或数字小键盘方向键，每个箭头按一次。按错或漏掉会中断连击。可随时暂停，切换标签页自动暂停；不保存进度。" /></p>
    </div>
  )
}
