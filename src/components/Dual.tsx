import type { ReactNode } from 'react'

/** Renders both language variants; the stylesheet shows the right one via html[data-language]. */
export function Dual({ en, zh }: { en: ReactNode; zh: ReactNode }) {
  return (
    <>
      <span className="en" lang="en">{en}</span>
      <span className="zh" lang="ko">{zh}</span>
    </>
  )
}
