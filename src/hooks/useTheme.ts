import { useCallback, useEffect, useState } from 'react'
import { writeStorage } from './storage'

export const THEME_KEY = 'zz-theme'
type Theme = 'dark' | 'light'

/** The theme is applied pre-paint by the root inline script; this hook mirrors and toggles it. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')
  }, [])

  const toggle = useCallback(() => {
    const next: Theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#1c211e' : '#f7f7f2')
    writeStorage(THEME_KEY, next)
    setTheme(next)
  }, [])

  return { theme, toggle }
}
