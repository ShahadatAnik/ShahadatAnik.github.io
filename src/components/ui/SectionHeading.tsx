import type { ReactNode } from 'react'
import type { TKey } from '@/data/i18n'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'
import { T } from './Text'

interface Props {
  eyebrow: string
  title: TKey
  /** Short paragraph on the right. */
  intro?: TKey
  /** Anything else on the right (e.g. a link). Replaces `intro`. */
  action?: ReactNode
  /** Fade in on scroll (default true). */
  reveal?: boolean
}

/** Eyebrow + h2 (+ intro or action): the heading used by every home-page section. */
export function SectionHeading({ eyebrow, title, intro, action, reveal = true }: Props) {
  const content = (
    <>
      <div>
        <Eyebrow section>{eyebrow}</Eyebrow>
        <h2><T k={title} /></h2>
      </div>
      {action ?? (intro && <p className="section-intro"><T k={intro} /></p>)}
    </>
  )
  return reveal ? <Reveal className="section-heading">{content}</Reveal> : <div className="section-heading">{content}</div>
}
