import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { Dual } from '../../Dual'
import type { HobbyContext } from '../types'
import {
  AXES, COLORS, DEFAULT_CAMERA, FACES, NORMALS, applyMove, createCube, faceTurn, formatClock, isSolved,
  orbitCamera, scrambleMoves, stickerMove,
} from './logic'
import type { Camera, Cube as CubeState, Face, Move, Piece, StickerStart } from './logic'
import './cube.css'

const NAMES: Record<Face, [string, string]> = { U: ['Up', '顶'], D: ['Down', '底'], L: ['Left', '左'], R: ['Right', '右'], F: ['Front', '前'], B: ['Back', '后'] }

interface Anim { move: Move; duration: number; active: boolean }
interface PointerState extends Partial<StickerStart> {
  pointerId: number; x: number; y: number; lastX: number; lastY: number; mode: 'sticker' | 'orbit'
}
type Vars = CSSProperties & Record<`--${string}`, string>

export default function Cube({ reducedMotion: reducedProp }: HobbyContext) {
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [reduced] = useState(() => reducedProp || (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion:reduce)').matches))

  const [cube, setCubeState] = useState<CubeState>(createCube)
  const [moves, setMoves] = useState(0)
  const [timeText, setTimeText] = useState('00:00')
  const [status, setStatus] = useState({ en: 'Your next move.', zh: '从下一步开始。' })
  const [busy, setBusyState] = useState(false)
  const [solved, setSolved] = useState(true)
  const [camera, setCameraState] = useState<Camera>({ ...DEFAULT_CAMERA })
  const [anim, setAnim] = useState<Anim | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)

  const cubeRef = useRef(cube)
  const cameraRef = useRef(camera)
  const busyRef = useRef(false)
  const destroyedRef = useRef(false)
  const movesRef = useRef(0)
  const startedAtRef = useRef<number | null>(null)
  const elapsedRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pointerRef = useRef<PointerState | null>(null)
  const frameRef = useRef<number | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const finishAnimRef = useRef<(() => void) | null>(null)

  const setCube = (next: CubeState) => { cubeRef.current = next; setCubeState(next) }
  const setCamera = (next: Camera) => { cameraRef.current = next; setCameraState(next) }
  const message = (en: string, zh: string) => setStatus({ en, zh })
  const lock = (value: boolean) => { busyRef.current = value; setBusyState(value) }

  function updateTime() {
    const running = startedAtRef.current === null ? 0 : performance.now() - startedAtRef.current
    setTimeText(formatClock(elapsedRef.current + running))
  }
  function stopTimer() {
    if (startedAtRef.current !== null) elapsedRef.current += performance.now() - startedAtRef.current
    startedAtRef.current = null
    if (timerRef.current !== null) clearInterval(timerRef.current)
    timerRef.current = null
    updateTime()
  }
  function resetStats() {
    stopTimer()
    movesRef.current = 0; elapsedRef.current = 0
    setMoves(0)
    updateTime()
  }

  function animateMove(move: Move, duration = 230): Promise<boolean> {
    if (destroyedRef.current) return Promise.resolve(false)
    if (reduced || duration <= 0) { setCube(applyMove(cubeRef.current, move.axis, move.layer, move.quarter)); return Promise.resolve(true) }
    return new Promise<boolean>(resolve => {
      let finished = false
      const done = () => {
        if (finished) return
        finished = true
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
        if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
        frameRef.current = timeoutRef.current = null
        finishAnimRef.current = null
        if (destroyedRef.current) { resolve(false); return }
        setCube(applyMove(cubeRef.current, move.axis, move.layer, move.quarter))
        setAnim(null)
        resolve(true)
      }
      finishAnimRef.current = done
      setAnim({ move, duration, active: false })
      frameRef.current = requestAnimationFrame(() => {
        // A second frame gives the new slice its initial, unrotated paint.
        frameRef.current = requestAnimationFrame(() => {
          frameRef.current = null
          if (destroyedRef.current) { done(); return }
          setAnim({ move, duration, active: true })
          timeoutRef.current = setTimeout(done, duration + 35)
        })
      })
    })
  }

  async function manualMove(move: Move, label?: string) {
    if (busyRef.current || destroyedRef.current) return
    if (isSolved(cubeRef.current) && movesRef.current > 0) resetStats()
    lock(true)
    if (startedAtRef.current === null) { startedAtRef.current = performance.now(); timerRef.current = setInterval(updateTime, 250) }
    movesRef.current++
    setMoves(movesRef.current)
    message(label || 'Make it your own.', label || '找到你的节奏。')
    const completed = await animateMove(move)
    if (!completed || destroyedRef.current) return
    if (isSolved(cubeRef.current)) { stopTimer(); message('Solved. Nicely done!', '还原成功，漂亮！'); setSolved(true) }
    else { message('One turn at a time.', '一步一步，找到答案。'); setSolved(false) }
    lock(false)
  }

  async function scramble() {
    if (busyRef.current || destroyedRef.current) return
    resetStats()
    lock(true)
    message('Mixing things up…', '正在打乱…')
    for (const move of scrambleMoves(20)) if (!await animateMove(move, 62)) return
    if (destroyedRef.current) return
    setSolved(isSolved(cubeRef.current))
    message('Scrambled. Your move!', '打乱完成，轮到你了！')
    lock(false)
  }

  function resetCube() {
    if (busyRef.current) return
    resetStats(); setCube(createCube()); setSolved(true)
    message('A fresh start.', '重新开始。')
  }

  const manualMoveRef = useRef(manualMove)
  manualMoveRef.current = manualMove

  useEffect(() => {
    destroyedRef.current = false
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as Element | null
      if (destroyedRef.current || event.repeat || event.altKey || event.ctrlKey || event.metaKey || target?.matches?.('input,textarea,select,[contenteditable=true]')) return
      // Only the mounted game in the active dialog owns these shortcuts.
      const dialog = rootRef.current?.closest('dialog')
      if (dialog && !dialog.open) return
      const face = event.key.toUpperCase() as Face
      if (!FACES.includes(face)) return
      event.preventDefault()
      void manualMoveRef.current(faceTurn(face, event.shiftKey), face + (event.shiftKey ? '′' : ''))
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      destroyedRef.current = true
      document.removeEventListener('keydown', onKeyDown)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
      if (timerRef.current !== null) clearInterval(timerRef.current)
      frameRef.current = timeoutRef.current = timerRef.current = null
      finishAnimRef.current?.()
      pointerRef.current = null
    }
  }, [])

  function clearPointer() {
    const pointer = pointerRef.current
    if (pointer) { try { stageRef.current?.releasePointerCapture(pointer.pointerId) } catch { /* already released */ } }
    pointerRef.current = null
    setSelected(null)
    setDragging(null)
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || pointerRef.current || busyRef.current) return
    const sticker = (event.target as Element).closest<HTMLElement>('[data-hc-sticker]')
    const mode = sticker ? 'sticker' : 'orbit'
    pointerRef.current = {
      pointerId: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, mode,
      id: sticker?.dataset.hcSticker, normal: sticker?.dataset.hcNormal?.split(',').map(Number) as StickerStart['normal'] | undefined,
    }
    if (sticker) setSelected(`${sticker.dataset.hcSticker}|${sticker.dataset.hcNormal}`)
    stageRef.current?.focus({ preventScroll: true })
    stageRef.current?.setPointerCapture(event.pointerId)
    event.preventDefault()
  }
  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const pointer = pointerRef.current
    if (!pointer || pointer.pointerId !== event.pointerId) return
    if (pointer.mode === 'orbit') {
      setCamera(orbitCamera(cameraRef.current, event.clientX - pointer.lastX, event.clientY - pointer.lastY))
      pointer.lastX = event.clientX; pointer.lastY = event.clientY
    }
    setDragging(pointer.mode)
    event.preventDefault()
  }
  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const start = pointerRef.current
    if (!start || start.pointerId !== event.pointerId) return
    const dx = event.clientX - start.x, dy = event.clientY - start.y
    clearPointer()
    if (start.mode === 'sticker' && start.id && start.normal && Math.hypot(dx, dy) >= 15) {
      const root = rootRef.current, stage = stageRef.current
      const unit = root ? parseFloat(getComputedStyle(root).getPropertyValue('--hc-unit')) || 70 : 70
      const move = stickerMove(cubeRef.current, { id: start.id, normal: start.normal }, dx, dy, cameraRef.current, unit, stage?.clientHeight ?? 410)
      if (move) void manualMove(move)
    }
  }

  const layerIds = anim ? new Set(cube.filter(p => p.pos[AXES[anim.move.axis]] === anim.move.layer).map(p => p.id)) : null
  const renderPiece = (piece: Piece) => (
    <div
      key={piece.id}
      className="hcube-piece"
      data-hc-piece={piece.id}
      style={{ transform: `translate3d(calc(var(--hc-unit) * ${piece.pos[0]}),calc(var(--hc-unit) * ${-piece.pos[1]}),calc(var(--hc-unit) * ${piece.pos[2]}))` }}
    >
      {(Object.entries(NORMALS) as [Face, readonly number[]][]).map(([face, normal]) => {
        const sticker = piece.stickers.find(s => s.normal.every((v, i) => v === normal[i]))
        const stickerKey = `${piece.id}|${normal.join(',')}`
        return (
          <div className="hcube-face" data-face={face} aria-hidden="true" key={face}>
            {sticker && (
              <div
                className={`hcube-sticker${selected === stickerKey ? ' hcube-selected' : ''}`}
                data-hc-sticker={piece.id}
                data-hc-normal={normal.join(',')}
                style={{ '--hc-color': COLORS[sticker.color] } as Vars}
              />
            )}
          </div>
        )
      })}
    </div>
  )
  const layerStyle: CSSProperties | undefined = anim?.active
    ? {
        transition: `transform ${anim.duration}ms cubic-bezier(.22,.75,.24,1)`,
        transform: `rotate${anim.move.axis.toUpperCase()}(${anim.move.quarter * 90 * (anim.move.axis === 'y' ? 1 : -1)}deg)`,
      }
    : undefined

  return (
    <div className="hcube" data-solved={String(solved)} ref={rootRef}>
      <div className="hcube-topline">
        <div className="hcube-stats">
          <div className="hcube-stat"><strong>{moves}</strong><span><Dual en="moves" zh="步" /></span></div>
          <div className="hcube-stat"><strong>{timeText}</strong><span><Dual en="time" zh="用时" /></span></div>
        </div>
        <div className="hcube-status" role="status" aria-live="polite"><Dual en={status.en} zh={status.zh} /></div>
      </div>
      <div
        className="hcube-stage"
        ref={stageRef}
        tabIndex={0}
        role="img"
        aria-label="Interactive 3D Rubik’s cube. Drag a sticker to turn a layer, or use the face buttons below. / 可交互三维魔方。拖动彩块转层，或使用下方面转按钮。"
        aria-busy={busy}
        data-dragging={dragging ?? undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={clearPointer}
        onContextMenu={event => event.preventDefault()}
      >
        <div className="hcube-stage-label">3 × 3 · <Dual en="IN YOUR HANDS" zh="方寸之间，随心转动" /></div>
        <div className="hcube-floor" />
        <div className="hcube-scene">
          <div className="hcube-object" style={{ transform: `rotateX(${camera.x}deg) rotateY(${camera.y}deg)` }}>
            {cube.filter(p => !layerIds?.has(p.id)).map(renderPiece)}
            {anim && layerIds && <div className="hcube-layer" style={layerStyle}>{cube.filter(p => layerIds.has(p.id)).map(renderPiece)}</div>}
          </div>
        </div>
        <div className="hcube-orbit-note"><Dual en="Drag a sticker to turn · Drag the background to orbit" zh="拖动彩块转层 · 拖动背景旋转视角" /></div>
      </div>
      <div className="hcube-controls" aria-label="Cube face turns / 魔方面转操作">
        {FACES.map(face => (
          <div className="hcube-face-controls" key={face}>
            <div className="hcube-face-name">
              <i className="hcube-face-dot" style={{ '--hc-color': COLORS[face] } as Vars} aria-hidden="true" />
              <Dual en={NAMES[face][0]} zh={NAMES[face][1]} />
            </div>
            <div className="hcube-turns">
              <button className="hcube-turn" type="button" disabled={busy} aria-label={`Turn ${face} clockwise / ${NAMES[face][1]}面顺时针转动`} onClick={() => void manualMove(faceTurn(face, false), face)}>{face} ↻</button>
              <button className="hcube-turn" type="button" disabled={busy} aria-label={`Turn ${face} counterclockwise / ${NAMES[face][1]}面逆时针转动`} onClick={() => void manualMove(faceTurn(face, true), `${face}′`)}>{face}′</button>
            </div>
          </div>
        ))}
      </div>
      <div className="hcube-actions">
        <button className="hgame-button hcube-scramble" type="button" disabled={busy} onClick={() => void scramble()}>↝ <Dual en="Scramble" zh="随机打乱" /></button>
        <button className="hgame-button" type="button" disabled={busy} onClick={resetCube}>↺ <Dual en="Reset cube" zh="重置魔方" /></button>
        <button className="hgame-button" type="button" onClick={() => setCamera({ ...DEFAULT_CAMERA })}>⤾ <Dual en="Reset view" zh="复位视角" /></button>
      </div>
      <p className="hcube-help">
        <Dual
          en={<>Keyboard: <kbd>U</kbd> <kbd>D</kbd> <kbd>L</kbd> <kbd>R</kbd> <kbd>F</kbd> <kbd>B</kbd>; hold <kbd>Shift</kbd> for the inverse. The timer starts with your first turn. Reset returns to a solved cube.</>}
          zh="键盘 U / D / L / R / F / B 转动对应面，按住 Shift 反向。首次转动开始计时；“重置魔方”恢复初始状态。"
        />
      </p>
    </div>
  )
}
