/** Which frame faces the viewer for a carousel rotation (degrees) and frame count. */
export function frontIndex(rotation: number, count: number): number {
  return count > 0 ? ((-Math.round(rotation / (360 / count))) % count + count) % count : 0
}

/** Clamped width/height ratio; falls back to the default portrait card shape. */
export function photoRatio(width: number, height: number): number {
  return Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0 ? Math.max(.35, Math.min(2.8, width / height)) : 164 / 218
}
