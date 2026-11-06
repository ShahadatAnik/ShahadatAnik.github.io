import { useEffect, useState } from 'react'

/**
 * Scroll-spy: the section currently crossing a thin "reading line" below the sticky header.
 * One IntersectionObserver replaces measuring every section on each scroll frame.
 * The previous section stays active in the gaps between sections.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const targets = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    if (!targets.length || !('IntersectionObserver' in window)) return
    const line = Math.round(80 + Math.min(innerHeight * 0.24, 160))
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(entry.target.id)
        else if (entry.target.id === ids[0] && entry.boundingClientRect.top > line) setActive(null)
      }
    }, { rootMargin: `-${line}px 0px -${Math.max(innerHeight - line - 1, 0)}px 0px` })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [ids])
  return active
}
