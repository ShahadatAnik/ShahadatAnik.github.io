import type { Lang } from './lang'

/** Every date on the site is written YYYY.MM (or YYYY.MM.DD), in both languages. '2023-12-01' -> '2023.12.01'. */
export function formatDate(date: string, lang: Lang): string {
  const [y, m, d] = date.split('-').map(Number)
  if (!y || !m || !d) return date
  return `${y}.${String(m).padStart(2, '0')}.${String(d).padStart(2, '0')}`
}

/** '2026-05' (or '2026-05-14') -> '2026.05'. A bare year ('2022') stays '2022'. */
export function formatMonth(date: string, lang: Lang): string {
  const [y, m] = date.split('-').map(Number)
  if (y && !m) return String(y)
  if (!y || !m) return date
  return `${y}.${String(m).padStart(2, '0')}`
}
