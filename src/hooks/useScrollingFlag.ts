import { useEffect, useRef } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'

/**
 * Sets html[data-scrolling="true"] while the page is scrolling (cleared 140ms after the last scroll event).
 * Stylesheets pause decorative animations then, so repainting animated SVG/filters never competes with scrolling.
 */
export function useScrollingFlag() {
  const { scrollY } = useScroll()
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useMotionValueEvent(scrollY, 'change', () => {
    const root = document.documentElement
    if (root.dataset.scrolling !== 'true') root.dataset.scrolling = 'true'
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      root.dataset.scrolling = 'false'
    }, 140)
  })

  useEffect(
    () => () => {
      clearTimeout(timer.current)
      delete document.documentElement.dataset.scrolling
    },
    [],
  )
}
