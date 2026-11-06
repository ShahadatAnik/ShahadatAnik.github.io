import { useEffect, useRef } from 'react'

/** Runs `callback` once per animation frame after scroll / resize (and on mount, font load, and when `extraTriggers` change). */
export function useScrollFrame(callback: () => void, extraTriggers: unknown[] = []) {
  const latest = useRef(callback)
  latest.current = callback
  useEffect(() => {
    let pending = false
    let frame = 0
    const run = () => {
      pending = false
      latest.current()
    }
    const schedule = () => {
      if (pending) return
      pending = true
      frame = requestAnimationFrame(run)
    }
    run()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) schedule()
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => latest.current(), extraTriggers)
}
