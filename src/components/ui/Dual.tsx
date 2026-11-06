import type { ReactNode } from 'react'

/** Renders both language variants; the stylesheet shows the right one via html[data-language]. */
export function Dual({ en, ko }: { en: ReactNode; ko: ReactNode }) {
  return (
    <>
      <span className="en" lang="en">{en}</span>
      <span className="ko" lang="ko">{ko}</span>
    </>
  )
}
