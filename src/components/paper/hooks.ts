import { useCallback, useEffect, useRef, useState } from 'react'

const THEME_KEY = 'zz-theme'

/** Light/dark theme stored on <html data-theme> and persisted under "zz-theme". */
export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')
  }, [])

  const toggle = useCallback(() => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      /* storage unavailable */
    }
    setTheme(next)
  }, [])

  return { theme, toggle }
}

/** Transient status message for the toast element. */
export function useToast(duration = 2500) {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const show = useCallback(
    (text: string) => {
      clearTimeout(timer.current)
      setMessage(text)
      setVisible(true)
      timer.current = setTimeout(() => setVisible(false), duration)
    },
    [duration],
  )

  return { message, visible, show }
}

export async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const input = document.createElement('textarea')
    input.value = text
    input.style.cssText = 'position:fixed;opacity:0;top:0;left:0'
    document.body.appendChild(input)
    input.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      /* ignore */
    }
    input.remove()
    return ok
  }
}
