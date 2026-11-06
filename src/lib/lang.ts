export type Lang = 'both' | 'en' | 'zh'

/** English lives at `/`; Korean (internal key `zh`, the second language slot) lives at `/kr/`. */
export const langPrefix = (lang: Lang) => (lang === 'zh' ? '/kr' : '')

export function langFromPath(pathname: string): Lang {
  return /^\/kr(\/|$)/.test(pathname) ? 'zh' : 'en'
}
