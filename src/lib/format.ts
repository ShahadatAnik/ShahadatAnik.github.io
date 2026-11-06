import type { Lang } from './lang'

/** '2023-12-01' -> 'Dec 1, 2023' (en) or '2023년 12월 1일' (ko). */
export function formatDate(date: string, lang: Lang): string {
  const [y, m, d] = date.split('-').map(Number)
  if (!y || !m || !d) return date
  if (lang === 'ko') return `${y}년 ${m}월 ${d}일`
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
}
