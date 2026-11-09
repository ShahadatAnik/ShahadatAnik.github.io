import { useCallback, useEffect, useState } from 'react'
import { readStorage, writeStorage } from './storage'

export const THEME_KEY = 'zz-theme'
type Theme = 'dark' | 'light'

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#1c211e' : '#f7f7f2')
}

/**
 * The theme is applied before first paint by the root inline script: the saved choice, otherwise the system setting.
 * This hook mirrors it, saves a choice made with the toggle, and follows the system while nothing has been saved.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')
    const system = matchMedia('(prefers-color-scheme: dark)')
    const follow = () => {
      if (readStorage(THEME_KEY)) return // the visitor picked a theme: keep it
      const next: Theme = system.matches ? 'dark' : 'light'
      applyTheme(next)
      setTheme(next)
    }
    system.addEventListener('change', follow)
    return () => system.removeEventListener('change', follow)
  }, [])

  const toggle = useCallback(() => {
    const next: Theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    writeStorage(THEME_KEY, next)
    setTheme(next)
  }, [])

  return { theme, toggle }
}
