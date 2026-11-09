import { useEffect, useState, type RefObject } from 'react'

/** True while the referenced element intersects the viewport. Defaults to true before measurement / without IntersectionObserver. */
export function useInView(ref: RefObject<Element | null>, threshold = 0.05) {
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const element = ref.current
    if (!element || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) setInView(entry.isIntersecting)
    }, { threshold })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, threshold])
  return inView
}

/** Becomes true once the element has scrolled past `rootMargin` into view, and stays true. */
export function useReached(ref: RefObject<Element | null>, rootMargin = '0px') {
  const [reached, setReached] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setReached(true)
        observer.disconnect()
      }
    }, { rootMargin })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, rootMargin])
  return reached
}
