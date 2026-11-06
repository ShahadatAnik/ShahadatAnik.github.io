import type { LucideIcon } from 'lucide-react'

/** Wraps a lucide icon in a span so it sizes with the text (1em) and can be styled and animated by class. */
export function Glyph({ icon: Icon, className, strokeWidth = 1.9 }: { icon: LucideIcon; className?: string; strokeWidth?: number }) {
  return (
    <span className={className ? `glyph ${className}` : 'glyph'} aria-hidden="true">
      <Icon size="1em" strokeWidth={strokeWidth} />
    </span>
  )
}
