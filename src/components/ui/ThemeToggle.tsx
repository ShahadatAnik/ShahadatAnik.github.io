import { useTheme } from '../../hooks/useTheme'

/** Light/dark switch (moon/sun icon). Used by both headers. */
export function ThemeToggle({ id = 'theme-toggle' }: { id?: string }) {
  const { theme, toggle } = useTheme()
  return (
    <button id={id} type="button" className="icon-button" aria-label="Switch color theme / 테마 전환" aria-pressed={theme === 'dark'} onClick={toggle}>
      <svg className="moon" viewBox="0 0 24 24"><path d="M20.5 14A8.6 8.6 0 0 1 10 3.5 8.7 8.7 0 1 0 20.5 14Z" /></svg>
      <svg className="sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></svg>
    </button>
  )
}
