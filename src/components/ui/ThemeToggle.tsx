import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

/** Light/dark switch (moon/sun icon). Used by both headers. */
export function ThemeToggle({ id = 'theme-toggle' }: { id?: string }) {
  const { theme, toggle } = useTheme()
  return (
    <button id={id} type="button" className="icon-button" aria-label="Switch color theme / 테마 전환" aria-pressed={theme === 'dark'} onClick={toggle}>
      <Moon className="moon" aria-hidden="true" />
      <Sun className="sun" aria-hidden="true" />
    </button>
  )
}
