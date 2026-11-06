export type Lang = 'en' | 'ko'

/** English lives at `/`; Korean (internal key `ko`, the second language slot) lives at `/kr/`. */
export const langPrefix = (lang: Lang) => (lang === 'ko' ? '/kr' : '')

export function langFromPath(pathname: string): Lang {
  return /^\/kr(\/|$)/.test(pathname) ? 'ko' : 'en'
}
