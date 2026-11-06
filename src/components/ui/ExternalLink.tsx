import { ArrowUpRight } from 'lucide-react'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { Glyph } from './Glyph'

/** The ↗ arrow that follows every link that leaves the page. */
export function Arrow({ className = 'link-arrow' }: { className?: string }) {
  return (
    <>
      {' '}
      <Glyph icon={ArrowUpRight} className={className} strokeWidth={2.1} />
    </>
  )
}

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> & {
  href: string
  /** Show the arrow after the label (default true). */
  arrow?: boolean
  children: ReactNode
}

/** A link that opens in a new tab, with the arrow. The only place `target="_blank"` is written. */
export function ExternalLink({ arrow = true, children, ...rest }: Props) {
  return (
    <a {...rest} target="_blank" rel="noopener">
      {children}
      {arrow && <Arrow />}
    </a>
  )
}
