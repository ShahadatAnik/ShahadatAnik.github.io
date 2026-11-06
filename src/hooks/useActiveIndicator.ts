import { useEffect, type RefObject } from 'react'

/**
 * Positions a sliding indicator: measures the active child of `containerRef` and exposes its box as CSS
 * variables (`--<prefix>-x/-width`, plus `-y/-height` when vertical) on the container.
 * Re-measures on `deps`, resize and font load.
 */
export function useActiveIndicator(
  containerRef: RefObject<HTMLElement | null>,
  activeSelector: string,
  prefix: string,
  deps: unknown[],
  opts: { vertical?: boolean } = {},
) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const measure = () => {
      const active = container.querySelector<HTMLElement>(activeSelector)
      if (!active) return
      container.style.setProperty(`--${prefix}-x`, `${active.offsetLeft}px`)
      container.style.setProperty(`--${prefix}-width`, `${active.offsetWidth}px`)
      if (opts.vertical) {
        container.style.setProperty(`--${prefix}-y`, `${active.offsetTop}px`)
        container.style.setProperty(`--${prefix}-height`, `${active.offsetHeight}px`)
      }
    }
    measure()
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) measure()
    })
    window.addEventListener('resize', measure, { passive: true })
    return () => {
      cancelled = true
      window.removeEventListener('resize', measure)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
