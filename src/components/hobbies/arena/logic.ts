/**
 * Browser-local footwork practice: pure game logic (no DOM, no storage).
 * State exists only for the open game instance.
 */
export const W = 900
export const H = 520
export const EDGE = 40
export const ROUND = 45

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))
const length = (x: number, y: number) => Math.hypot(x, y)

export interface Vec2 { x: number; y: number }
export interface Player extends Vec2 { radius: number; facing: number; invincible: number }
export interface Cone extends Vec2 { angle: number; spread: number; radius: number }

/** Physics catch-up is bounded; the round clock still consumes real active time. */
export function simulationSteps(seconds: number): number[] {
  if (!Number.isFinite(seconds) || seconds <= 0) return []
  // Never replay seconds of unseen attacks after a delayed animation frame.
  const physicsSeconds = Math.min(seconds, .25)
  const count = Math.ceil(physicsSeconds / (1 / 120))
  return Array.from({ length: count }, () => physicsSeconds / count)
}

export function advanceRoundClock(elapsed: number, cooldown: number, seconds: number): { elapsed: number; cooldown: number } {
  const activeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0
  return { elapsed: Math.min(ROUND, elapsed + activeSeconds), cooldown: Math.max(0, cooldown - activeSeconds) }
}

export function segmentDistanceSquared(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax, dy = by - ay
  const t = dx || dy ? clamp(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy), 0, 1) : 0
  return (px - ax - t * dx) ** 2 + (py - ay - t * dy) ** 2
}

/** Exact circle/sector intersection, including the two radial edges. */
export function intersectsCone(player: Pick<Player, 'x' | 'y' | 'radius'>, cone: Cone): boolean {
  const dx = player.x - cone.x, dy = player.y - cone.y
  const distance = length(dx, dy), delta = Math.atan2(Math.sin(Math.atan2(dy, dx) - cone.angle), Math.cos(Math.atan2(dy, dx) - cone.angle))
  if (Math.abs(delta) <= cone.spread && distance <= cone.radius + player.radius) return true
  for (const a of [cone.angle - cone.spread, cone.angle + cone.spread]) {
    if (segmentDistanceSquared(player.x, player.y, cone.x, cone.y, cone.x + Math.cos(a) * cone.radius, cone.y + Math.sin(a) * cone.radius) <= player.radius ** 2) return true
  }
  return false
}

export function dashDestination(player: Pick<Player, 'x' | 'y' | 'radius'>, direction: Vec2, distance = 135): Vec2 {
  const size = length(direction.x, direction.y) || 1
  return {
    x: clamp(player.x + direction.x / size * distance, EDGE + player.radius, W - EDGE - player.radius),
    y: clamp(player.y + direction.y / size * distance, EDGE + player.radius, H - EDGE - player.radius),
  }
}

export type Mode = 'ready' | 'running' | 'paused' | 'result'

interface HazardBase { x: number; y: number; warning: number; age: number; hit: boolean; touched: boolean }
export interface LineHazard extends HazardBase { type: 'line'; dx: number; dy: number; speed: number }
export interface CircleHazard extends HazardBase { type: 'circle'; radius: number; active: number }
export interface ConeHazard extends HazardBase { type: 'cone'; angle: number; spread: number; radius: number; active: number }
export type Hazard = LineHazard | CircleHazard | ConeHazard
export interface Particle { x: number; y: number; vx: number; vy: number; life: number; color: string }
export interface Trail { x: number; y: number; life: number }
export interface Bilingual { en: string; zh: string }
export interface RoundResult { won: boolean; elapsed: number; dodged: number }

export interface KeyInput {
  key: string
  code?: string
  repeat?: boolean
  ctrlKey?: boolean
  metaKey?: boolean
  altKey?: boolean
  /** Focus is in an input, textarea, select or contenteditable element. */
  targetIsEditable?: boolean
  /** Focus is on a button or link (Space must keep its native activation). */
  targetIsButton?: boolean
}

const MOVEMENT_KEYS = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright']

export interface ArenaOptions {
  reducedMotion?: boolean
  random?: () => number
}

/** Deterministic-by-injection state machine for one open arena game. */
export class ArenaGame {
  readonly reducedMotion: boolean
  private readonly random: () => number
  mode: Mode = 'ready'
  elapsed = 0
  hp = 3
  dodged = 0
  cooldown = 0
  spawnIn = 1.3
  wave = 0
  player: Player = { x: W / 2, y: H / 2, radius: 12, facing: -Math.PI / 2, invincible: 0 }
  target: Vec2 = { x: W / 2, y: H / 2 }
  keys = new Set<string>()
  hazards: Hazard[] = []
  particles: Particle[] = []
  trails: Trail[] = []
  moveMarker = 0
  lastDirection: Vec2 = { x: 0, y: -1 }
  status: Bilingual = { en: 'Ready when you are.', zh: '准备好就开始。' }
  result: RoundResult | null = null
  /** True when the current pause came from the tab being hidden. */
  automaticPause = false

  constructor(options: ArenaOptions = {}) {
    this.reducedMotion = !!options.reducedMotion
    this.random = options.random ?? Math.random
  }

  /** Remaining time text, one decimal, as shown in the HUD. */
  get timeText(): string { return (ROUND - this.elapsed).toFixed(1) }
  get dashReady(): boolean { return this.mode === 'running' && this.cooldown <= 0 }

  private setStatus(en: string, zh: string) { this.status = { en, zh } }

  private burst(x: number, y: number, color: string, count = 12) {
    if (this.reducedMotion) return
    for (let i = 0; i < count; i++) {
      const angle = this.random() * Math.PI * 2, speed = 30 + this.random() * 100
      this.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: .55, color })
    }
  }

  private spawn() {
    const { elapsed, player, random } = this
    const difficulty = elapsed / ROUND
    this.wave++
    const wave = this.wave
    const type = elapsed < 8 ? (wave % 3 === 0 ? 'circle' : 'line') : elapsed < 16 ? (wave % 2 ? 'line' : 'circle') : (['line', 'circle', 'line', 'cone'] as const)[wave % 4]
    if (type === 'line') {
      const side = Math.floor(random() * 4)
      let x: number, y: number
      if (side < 2) { x = side === 0 ? 30 : W - 30; y = 70 + random() * (H - 140) } else { x = 70 + random() * (W - 140); y = side === 2 ? 30 : H - 30 }
      const aim = { x: clamp(player.x + (random() - .5) * 32, EDGE, W - EDGE), y: clamp(player.y + (random() - .5) * 32, EDGE, H - EDGE) }
      const magnitude = length(aim.x - x, aim.y - y) || 1
      this.hazards.push({ type, x, y, dx: (aim.x - x) / magnitude, dy: (aim.y - y) / magnitude, speed: 370 + difficulty * 150, warning: .95 - difficulty * .18, age: 0, hit: false, touched: false })
    } else if (type === 'circle') {
      this.hazards.push({ type, x: clamp(player.x + (random() - .5) * 64, 90, W - 90), y: clamp(player.y + (random() - .5) * 64, 90, H - 90), radius: 54 + difficulty * 17, warning: 1.12 - difficulty * .12, active: .34, age: 0, hit: false, touched: false })
    } else {
      const angle = random() * Math.PI * 2, distance = 160 + random() * 80
      const x = clamp(player.x + Math.cos(angle) * distance, 60, W - 60), y = clamp(player.y + Math.sin(angle) * distance, 60, H - 60)
      this.hazards.push({ type, x, y, angle: Math.atan2(player.y - y, player.x - x), spread: .36 + difficulty * .06, radius: 240, warning: 1.08, active: .32, age: 0, hit: false, touched: false })
    }
  }

  private finish(won: boolean) {
    this.mode = 'result'
    this.keys.clear()
    this.result = { won, elapsed: this.elapsed, dodged: this.dodged }
    this.setStatus(
      won ? '45 seconds survived. Challenge complete.' : 'Three hits. Take a breath and try again.',
      won ? '坚持 45 秒，挑战完成。' : '受到三次攻击，休息一下，再试一次。',
    )
  }

  private collide(h: Hazard) {
    h.touched = true
    if (h.hit || this.player.invincible > 0) return
    h.hit = true
    this.hp--
    this.player.invincible = 1.1
    this.burst(this.player.x, this.player.y, '#eaa5bd', 16)
    this.setStatus(
      this.hp ? `${this.hp} ${this.hp === 1 ? 'life' : 'lives'} left. Keep moving.` : 'Round complete.',
      this.hp ? `还剩 ${this.hp} 次机会，继续移动。` : '本局结束。',
    )
    if (this.hp <= 0) this.finish(false)
  }

  private heldDirection(): Vec2 {
    const { keys } = this
    return {
      x: (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0),
      y: (keys.has('s') || keys.has('arrowdown') ? 1 : 0) - (keys.has('w') || keys.has('arrowup') ? 1 : 0),
    }
  }

  private update(dt: number) {
    const { player } = this
    player.invincible = Math.max(0, player.invincible - dt)
    this.moveMarker = Math.max(0, this.moveMarker - dt * .5)
    let { x: dx, y: dy } = this.heldDirection()
    const keyboard = !!(dx || dy)
    if (!keyboard) { dx = this.target.x - player.x; dy = this.target.y - player.y }
    const distance = length(dx, dy), step = keyboard ? 290 * dt : Math.min(distance, 290 * dt)
    if (distance > .5) {
      this.lastDirection = { x: dx / distance, y: dy / distance }
      player.x = clamp(player.x + dx / distance * step, EDGE + player.radius, W - EDGE - player.radius)
      player.y = clamp(player.y + dy / distance * step, EDGE + player.radius, H - EDGE - player.radius)
      player.facing = Math.atan2(dy, dx)
    }
    if (keyboard) this.target = { x: player.x, y: player.y }
    this.spawnIn -= dt
    if (this.spawnIn <= 0) { this.spawn(); this.spawnIn = .95 - (this.elapsed / ROUND) * .43 }
    for (const h of this.hazards) {
      const oldAge = h.age
      h.age += dt
      if (h.age < h.warning) continue
      if (h.type === 'line') {
        const activeDt = Math.min(dt, h.age - h.warning), oldX = h.x, oldY = h.y
        h.x += h.dx * h.speed * activeDt
        h.y += h.dy * h.speed * activeDt
        if (segmentDistanceSquared(player.x, player.y, oldX, oldY, h.x, h.y) <= (player.radius + 6) ** 2) this.collide(h)
      } else if (h.age <= h.warning + h.active || oldAge < h.warning) {
        const hit = h.type === 'circle' ? length(player.x - h.x, player.y - h.y) <= h.radius + player.radius : intersectsCone(player, h)
        if (hit) this.collide(h)
      }
      if (this.mode !== 'running') return
    }
    this.hazards = this.hazards.filter(h => {
      const done = h.type === 'line' ? (h.x < 0 || h.x > W || h.y < 0 || h.y > H || h.age > 5) : h.age > h.warning + h.active
      if (done && !h.touched) this.dodged++
      return !done
    })
    this.particles = this.particles.filter(p => { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; return p.life > 0 })
    this.trails = this.trails.filter(t => (t.life -= dt) > 0)
  }

  /** Advance one animation frame by `seconds` of real, active time. */
  advance(seconds: number) {
    if (this.mode !== 'running') return
    const clock = advanceRoundClock(this.elapsed, this.cooldown, seconds)
    this.elapsed = clock.elapsed
    this.cooldown = clock.cooldown
    if (this.elapsed >= ROUND - 1e-7) { this.elapsed = ROUND; this.finish(true); return }
    for (const dt of simulationSteps(seconds)) {
      if (this.mode !== 'running') break
      this.update(dt)
    }
  }

  start() {
    this.mode = 'running'
    this.automaticPause = false
    this.result = null
    this.elapsed = 0; this.hp = 3; this.dodged = 0; this.cooldown = 0; this.spawnIn = 1.3; this.wave = 0
    this.hazards = []; this.particles = []; this.trails = []; this.keys.clear()
    this.player = { x: W / 2, y: H / 2, radius: 12, facing: -Math.PI / 2, invincible: 0 }
    this.target = { x: this.player.x, y: this.player.y }
    this.lastDirection = { x: 0, y: -1 }
    this.setStatus('Watch the warnings. You have three lives.', '留意预警，你有三次机会。')
  }

  pause(automatic = false) {
    if (this.mode !== 'running') return
    this.mode = 'paused'
    this.automaticPause = automatic
    this.keys.clear()
  }

  /** `hidden` mirrors document.hidden: a hidden tab never resumes. */
  resume(hidden = false) {
    if (this.mode !== 'paused' || hidden) return
    this.mode = 'running'
    this.automaticPause = false
    this.setStatus('Back in the arena. Keep moving.', '回到训练场，继续移动。')
  }

  dash() {
    if (this.mode !== 'running' || this.cooldown > 0) return
    let direction = this.heldDirection()
    if (!length(direction.x, direction.y)) {
      direction = { x: this.target.x - this.player.x, y: this.target.y - this.player.y }
      if (length(direction.x, direction.y) < 2) direction = this.lastDirection
    }
    const destination = dashDestination(this.player, direction), old = { x: this.player.x, y: this.player.y }
    if (!this.reducedMotion) for (let i = 0; i < 8; i++) this.trails.push({ x: old.x + (destination.x - old.x) * i / 8, y: old.y + (destination.y - old.y) * i / 8, life: .28 })
    this.player.x = destination.x
    this.player.y = destination.y
    this.player.facing = Math.atan2(direction.y, direction.x)
    this.target = { ...destination }
    this.cooldown = 5
    this.moveMarker = 0
    this.burst(this.player.x, this.player.y, '#92e5f3', 8)
  }

  /** Set the click/touch destination from arena coordinates (0..W, 0..H). */
  setTarget(x: number, y: number) {
    const r = this.player.radius
    this.target = { x: clamp(x, EDGE + r, W - EDGE - r), y: clamp(y, EDGE + r, H - EDGE - r) }
    this.moveMarker = 1
  }

  clearKeys() { this.keys.clear() }
  releaseKey(key: string) { this.keys.delete(key.toLowerCase()) }

  /**
   * Keyboard handling. Returns true when the event is consumed and the caller
   * should call preventDefault().
   */
  keyDown(input: KeyInput): boolean {
    if (input.ctrlKey || input.metaKey || input.altKey || input.targetIsEditable) return false
    const key = input.key.toLowerCase()
    if (key === 'p' && (this.mode === 'running' || this.mode === 'paused')) {
      if (this.mode === 'running') this.pause(); else this.resume()
      return true
    }
    if (this.mode !== 'running') return false
    if (MOVEMENT_KEYS.includes(key)) { this.keys.add(key); return true }
    if (input.code === 'Space' && !input.targetIsButton) {
      if (!input.repeat) this.dash()
      return true
    }
    return false
  }
}
