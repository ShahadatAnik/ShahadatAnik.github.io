import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { readStorage, writeStorage } from './storage'

export const MOTION_KEY = 'zz-motion-paused'

interface MotionState {
  /** The visitor paused motion via the toggle. */
  userPaused: boolean
  /** The OS asks for reduced motion. */
  reduced: boolean
  /** Motion is permitted at all (neither paused nor reduced). */
  allowed: boolean
  /** Motion is permitted and the tab is visible: decorative animation should run. */
  running: boolean
  toggle: () => void
}

const MotionContext = createContext<MotionState>({ userPaused: false, reduced: false, allowed: true, running: true, toggle: () => {} })

export function MotionProvider({ children }: { children: ReactNode }) {
  const [userPaused, setUserPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setUserPaused(readStorage(MOTION_KEY) === 'true')
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const syncMedia = () => setReduced(media.matches)
    const syncVisible = () => setVisible(!document.hidden)
    const syncStorage = (event: StorageEvent) => {
      if (event.key === MOTION_KEY) setUserPaused(event.newValue === 'true')
    }
    syncMedia()
    syncVisible()
    media.addEventListener('change', syncMedia)
    document.addEventListener('visibilitychange', syncVisible)
    window.addEventListener('storage', syncStorage)
    return () => {
      media.removeEventListener('change', syncMedia)
      document.removeEventListener('visibilitychange', syncVisible)
      window.removeEventListener('storage', syncStorage)
    }
  }, [])

  // Global flag the stylesheets key off (html[data-motion-paused=true]).
  useEffect(() => {
    document.documentElement.dataset.motionPaused = String(userPaused || reduced)
  }, [userPaused, reduced])

  const toggle = useCallback(() => {
    setUserPaused((previous) => {
      writeStorage(MOTION_KEY, String(!previous))
      return !previous
    })
  }, [])

  const value = useMemo<MotionState>(() => {
    const allowed = !userPaused && !reduced
    return { userPaused, reduced, allowed, running: allowed && visible, toggle }
  }, [userPaused, reduced, visible, toggle])

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}

export const useMotion = () => useContext(MotionContext)
