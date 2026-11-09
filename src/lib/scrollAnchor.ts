/**
 * Keeps the reader's place when the language changes. English and Korean text wrap differently, so the content above
 * the viewport changes height and the page would jump. We remember which block sits at the top of the screen before the
 * switch, and after the new language renders we scroll by however far that block moved.
 */
let anchor: { el: Element; top: number } | null = null

const BLOCKS = 'main h1, main h2, main h3, main h4, main p, main article, main summary, main figure, main li'

export function rememberScrollAnchor() {
  anchor = null
  if (window.scrollY < 8) return // at the top nothing needs holding
  const header = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0
  for (const el of document.querySelectorAll(BLOCKS)) {
    const rect = el.getBoundingClientRect()
    if (rect.height > 0 && rect.top >= header) {
      anchor = { el, top: rect.top }
      return
    }
  }
}

export function restoreScrollAnchor() {
  const saved = anchor
  anchor = null
  if (!saved || !saved.el.isConnected) return
  const delta = saved.el.getBoundingClientRect().top - saved.top
  if (Math.abs(delta) > 0.5) window.scrollBy({ top: delta, behavior: 'instant' })
}
