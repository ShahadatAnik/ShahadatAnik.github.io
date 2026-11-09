import { useEffect } from 'react'

/**
 * Sets html[data-scrolling="true"] while the page is scrolling (cleared 140ms after the last scroll event).
 * Stylesheets pause decorative animations then, so repainting animated SVG/filters never competes with scrolling.
 */
export function useScrollingFlag() {
  useEffect(() => {
    const root = document.documentElement
    let timer: ReturnType<typeof setTimeout> | undefined
    const onScroll = () => {
      if (root.dataset.scrolling !== 'true') root.dataset.scrolling = 'true'
      clearTimeout(timer)
      timer = setTimeout(() => {
        root.dataset.scrolling = 'false'
      }, 140)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(timer)
      delete root.dataset.scrolling
    }
  }, [])
}
