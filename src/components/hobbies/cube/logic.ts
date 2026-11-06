// A small, physical 3 × 3 cube model. Pure logic: no DOM, no storage.
export type Axis = 'x' | 'y' | 'z'
export type Face = 'U' | 'D' | 'L' | 'R' | 'F' | 'B'
export type Vec3 = [number, number, number]

export interface FaceMove { axis: Axis; layer: number; quarter: number }
export interface Move extends FaceMove { face?: Face; inverse?: boolean }
export interface Sticker { id: string; color: Face; normal: Vec3 }
export interface Piece { id: string; pos: Vec3; stickers: Sticker[] }
export type Cube = Piece[]

export const FACE_MOVES: Readonly<Record<Face, FaceMove>> = Object.freeze({
  U: { axis: 'y', layer: 1, quarter: -1 },
  D: { axis: 'y', layer: -1, quarter: 1 },
  L: { axis: 'x', layer: -1, quarter: 1 },
  R: { axis: 'x', layer: 1, quarter: -1 },
  F: { axis: 'z', layer: 1, quarter: -1 },
  B: { axis: 'z', layer: -1, quarter: 1 },
})
export const FACES = Object.keys(FACE_MOVES) as Face[]
export const COLORS: Readonly<Record<Face, string>> = { U: '#f4f1e9', D: '#f6cb50', L: '#f39845', R: '#e76362', F: '#51b89d', B: '#5b92d9' }
export const NORMALS: Readonly<Record<Face, Vec3>> = { U: [0, 1, 0], D: [0, -1, 0], L: [-1, 0, 0], R: [1, 0, 0], F: [0, 0, 1], B: [0, 0, -1] }
export const AXES: Readonly<Record<Axis, number>> = { x: 0, y: 1, z: 2 }

export function createCube(): Cube {
  const cube: Cube = []
  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
    if (x === 0 && y === 0 && z === 0) continue
    const pos: Vec3 = [x, y, z], id = `${x}:${y}:${z}`
    cube.push({
      id, pos,
      stickers: (Object.entries(NORMALS) as [Face, Vec3][])
        .filter(([, n]) => n.some((v, i) => v !== 0 && pos[i] === v))
        .map(([color, normal]) => ({ id: `${id}:${color}`, color, normal: [...normal] as Vec3 })),
    })
  }
  return cube
}

export function rotateVector(vector: Vec3, axis: Axis, quarter = 1): Vec3 {
  if (!(axis in AXES) || !Number.isInteger(quarter)) throw new Error('Invalid cube rotation')
  let [x, y, z] = vector
  for (let i = 0, n = ((quarter % 4) + 4) % 4; i < n; i++) {
    if (axis === 'x') [y, z] = [-z, y]
    else if (axis === 'y') [x, z] = [z, -x]
    else [x, y] = [-y, x]
  }
  return [x || 0, y || 0, z || 0]
}

export function applyMove(cube: Cube, axis: Axis, layer: number, quarter = 1): Cube {
  if (!(axis in AXES) || ![-1, 0, 1].includes(layer)) throw new Error('Invalid cube layer')
  return cube.map(piece => piece.pos[AXES[axis]] === layer ? {
    ...piece,
    pos: rotateVector(piece.pos, axis, quarter),
    stickers: piece.stickers.map(s => ({ ...s, normal: rotateVector(s.normal, axis, quarter) })),
  } : piece)
}

export function applyFaceMove(cube: Cube, face: Face, inverse = false): Cube {
  const move = FACE_MOVES[face]
  if (!move) throw new Error('Unknown cube face')
  return applyMove(cube, move.axis, move.layer, move.quarter * (inverse ? -1 : 1))
}

export function isSolved(cube: Cube): boolean {
  const faces = new Map<string, Face[]>()
  for (const p of cube) for (const s of p.stickers) {
    const key = s.normal.join(',')
    if (!faces.has(key)) faces.set(key, [])
    faces.get(key)!.push(s.color)
  }
  return faces.size === 6 && [...faces.values()].every(colors => colors.length === 9 && colors.every(c => c === colors[0]))
}

export function serializeCube(cube: Cube): string {
  return JSON.stringify(cube.map(p => ({
    id: p.id, pos: p.pos,
    stickers: [...p.stickers].sort((a, b) => a.id.localeCompare(b.id)).map(s => ({ id: s.id, color: s.color, normal: s.normal })),
  })).sort((a, b) => a.id.localeCompare(b.id)))
}

export function scrambleMoves(length = 20, random: () => number = Math.random): Required<Move>[] {
  const result: Required<Move>[] = []
  let previousAxis: Axis | null = null
  for (let i = 0; i < length; i++) {
    const candidates = FACES.filter(face => FACE_MOVES[face].axis !== previousAxis)
    const face = candidates[Math.floor(random() * candidates.length) % candidates.length]
    const inverse = random() < 0.5
    result.push({ face, inverse, ...FACE_MOVES[face], quarter: FACE_MOVES[face].quarter * (inverse ? -1 : 1) })
    previousAxis = FACE_MOVES[face].axis
  }
  return result
}

export function faceTurn(face: Face, inverse: boolean): Move {
  const base = FACE_MOVES[face]
  return { ...base, quarter: base.quarter * (inverse ? -1 : 1) }
}

export interface Camera { x: number; y: number }
export const DEFAULT_CAMERA: Readonly<Camera> = { x: -25, y: -34 }

/** "mm:ss" clock used by the timer. */
export function formatClock(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}

/** Orbiting the camera with a pointer drag; pitch is clamped. */
export function orbitCamera(camera: Camera, dx: number, dy: number): Camera {
  return { y: camera.y + dx * 0.48, x: Math.max(-88, Math.min(88, camera.x - dy * 0.42)) }
}

function cameraVector(vector: Vec3, camera: Camera): Vec3 {
  let [x, y, z] = [vector[0], -vector[1], vector[2]]
  const ry = camera.y * Math.PI / 180, rx = camera.x * Math.PI / 180;
  [x, z] = [x * Math.cos(ry) + z * Math.sin(ry), -x * Math.sin(ry) + z * Math.cos(ry)];
  [y, z] = [y * Math.cos(rx) - z * Math.sin(rx), y * Math.sin(rx) + z * Math.cos(rx)]
  return [x, y, z]
}

function projectTangent(vector: Vec3, point: Vec3, camera: Camera, unit: number, stageHeight: number): [number, number] {
  const tangent = cameraVector(vector, camera), position = cameraVector(point, camera)
  const depth = 1050 - position[2] * unit
  // Differentiate the same CSS perspective projection used by the scene.
  // The object center is 44% down; the perspective origin is 42% down.
  return [
    tangent[0] + position[0] * unit * tangent[2] / depth,
    tangent[1] + (position[1] * unit + stageHeight * 0.02) * tangent[2] / depth,
  ]
}

export interface StickerStart { id: string; normal: Vec3 }

/** Which layer turn does dragging a sticker by (dx, dy) screen pixels mean? */
export function stickerMove(cube: Cube, start: StickerStart, dx: number, dy: number, camera: Camera, unit: number, stageHeight: number): Move | null {
  const piece = cube.find(p => p.id === start.id)
  if (!piece) return null
  const p = piece.pos.map((v, i) => v + start.normal[i] * 0.48) as Vec3
  let best: { axis: Axis; layer: number; quarter: number; score: number } | null = null
  for (const [axis, index] of Object.entries(AXES) as [Axis, number][]) {
    if (start.normal[index] !== 0) continue
    const derivative: Vec3 = axis === 'x' ? [0, -p[2], p[1]] : axis === 'y' ? [p[2], 0, -p[0]] : [-p[1], p[0], 0]
    const v = projectTangent(derivative, p, camera, unit, stageHeight), magnitude = Math.hypot(v[0], v[1])
    if (magnitude < 0.01) continue
    const score = (v[0] * dx + v[1] * dy) / magnitude
    if (!best || Math.abs(score) > best.score) best = { axis, layer: piece.pos[index], quarter: score > 0 ? 1 : -1, score: Math.abs(score) }
  }
  return best ? { axis: best.axis, layer: best.layer, quarter: best.quarter } : null
}
