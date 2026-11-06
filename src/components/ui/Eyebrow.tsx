import type { ReactNode } from 'react'

/** The small all-caps label above a heading. */
export function Eyebrow({ children, section = false }: { children: ReactNode; section?: boolean }) {
  return <span className={section ? 'eyebrow section-number' : 'eyebrow'}>{children}</span>
}
