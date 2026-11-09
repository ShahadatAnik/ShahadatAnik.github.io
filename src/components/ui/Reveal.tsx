import type { ReactNode } from 'react'

/** A plain block that groups content (it used to fade in on scroll; that was removed so sections are always visible). */
export function Reveal({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={className}>{children}</div>
}
