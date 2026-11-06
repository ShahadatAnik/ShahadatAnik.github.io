// Falling-arrow training. Pure round logic: no DOM, no storage. All state lives only in the mounted session.
export const ROUND_MS = 40000
export const DIRECTIONS = ['left', 'down', 'up', 'right'] as const
export type Direction = (typeof DIRECTIONS)[number]
export type SpeedName = 'slow' | 'medium' | 'fast'
export type Grade = 'perfect' | 'good' | 'miss'

export interface SpeedConfig { spacing: number; travel: number; perfect: number; good: number }
export const SPEEDS: Readonly<Record<SpeedName, SpeedConfig>> = Object.freeze({
  slow: { spacing: 1250, travel: 3300, perfect: 80, good: 190 },
  medium: { spacing: 900, travel: 2500, perfect: 70, good: 165 },
  fast: { spacing: 650, travel: 1850, perfect: 60, good: 145 },
})

export interface Note {
  id: number
  direction: Direction
  spawnAt: number
  hitAt: number
  resolved: boolean
  grade: Grade | null
  resolvedAt: number | null
}

export interface Round {
  speed: SpeedName
  config: SpeedConfig
  notes: Note[]
  elapsed: number
  held: Partial<Record<Direction, boolean>>
  score: number
  combo: number
  bestCombo: number
  perfect: number
  good: number
  miss: number
  wrong: number
  reps: number
  done: boolean
}

export interface JudgmentEvent {
  grade: Grade
  direction: Direction
  noteId: number | null
  source: 'key' | 'late' | 'wrong'
}

export function createRound(speed: SpeedName | string = 'medium', seed: number = Date.now()): Round {
  const name: SpeedName = speed in SPEEDS ? (speed as SpeedName) : 'medium'
  const config = SPEEDS[name], notes: Note[] = []
  let randomState = Number(seed) >>> 0
  const random = () => { randomState = (1664525 * randomState + 1013904223) >>> 0; return randomState / 4294967296 }
  for (let spawnAt = 350, id = 0; spawnAt + config.travel <= ROUND_MS - 250; spawnAt += config.spacing, id++) {
    let direction = DIRECTIONS[Math.floor(random() * DIRECTIONS.length)]
    if (id > 1 && notes[id - 1].direction === direction && notes[id - 2].direction === direction)
      direction = DIRECTIONS[(DIRECTIONS.indexOf(direction) + 1) % 4]
    notes.push({ id, direction, spawnAt, hitAt: spawnAt + config.travel, resolved: false, grade: null, resolvedAt: null })
  }
  return {
    speed: name, config, notes, elapsed: 0, held: {}, score: 0, combo: 0,
    bestCombo: 0, perfect: 0, good: 0, miss: 0, wrong: 0, reps: 0, done: false,
  }
}

function judgment(round: Round, grade: Grade, direction: Direction, note: Note | null = null, source: JudgmentEvent['source'] = 'key'): JudgmentEvent {
  round[grade]++
  if (note) { note.resolved = true; note.grade = grade; note.resolvedAt = round.elapsed }
  if (grade === 'miss') {
    round.combo = 0
    if (source === 'wrong') { round.wrong++; round.score = Math.max(0, round.score - 60) }
  } else {
    round.reps++; round.combo++; round.bestCombo = Math.max(round.bestCombo, round.combo)
    round.score += (grade === 'perfect' ? 100 : 60) + Math.min(round.combo - 1, 10) * 5
  }
  return { grade, direction, noteId: note?.id ?? null, source }
}

export function advanceRound(round: Round, milliseconds: number): JudgmentEvent[] {
  const events: JudgmentEvent[] = []
  if (round.done || !Number.isFinite(milliseconds) || milliseconds < 0) return events
  round.elapsed = Math.min(ROUND_MS, round.elapsed + milliseconds)
  for (const note of round.notes) {
    if (!note.resolved && (round.elapsed > note.hitAt + round.config.good || round.elapsed === ROUND_MS))
      events.push(judgment(round, 'miss', note.direction, note, 'late'))
  }
  if (round.elapsed === ROUND_MS) { round.done = true; round.held = {} }
  return events
}

export function strikeRound(round: Round, direction: Direction, options: { repeat?: boolean } = {}): JudgmentEvent | null {
  if (round.done || !DIRECTIONS.includes(direction) || options.repeat || round.held[direction]) return null
  round.held[direction] = true
  const candidates = round.notes.filter(note => !note.resolved && Math.abs(note.hitAt - round.elapsed) <= round.config.good)
    .sort((a, b) => Math.abs(a.hitAt - round.elapsed) - Math.abs(b.hitAt - round.elapsed))
  const note = candidates.find(candidate => candidate.direction === direction)
  if (note) return judgment(round, Math.abs(note.hitAt - round.elapsed) <= round.config.perfect ? 'perfect' : 'good', direction, note)
  // A wrong direction during a note's window consumes that note. Pressing every
  // direction cannot turn the same beat into a success after the wrong input.
  return judgment(round, 'miss', direction, candidates[0] || null, 'wrong')
}

export function releaseRound(round: Round, direction: Direction): void { delete round.held[direction] }

export function keyDirection(key: string, code = ''): Direction | null {
  const map: Record<string, Direction> = {
    ArrowLeft: 'left', ArrowDown: 'down', ArrowUp: 'up', ArrowRight: 'right',
    Numpad4: 'left', Numpad2: 'down', Numpad8: 'up', Numpad6: 'right',
  }
  return map[key] || map[code] || null
}
