export type Lang = 'both' | 'en' | 'zh'

export const langPrefix = (lang: Lang) => (lang === 'both' ? '' : `/${lang}`)

export function langFromPath(pathname: string): Lang {
  return /^\/zh(\/|$)/.test(pathname) ? 'zh' : /^\/en(\/|$)/.test(pathname) ? 'en' : 'both'
}
