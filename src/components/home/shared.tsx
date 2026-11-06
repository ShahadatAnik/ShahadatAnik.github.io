import { Fragment, createContext, useContext, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Dual } from '../Dual'
import { T as STRINGS, type Bilingual, type TKey } from '../../data/i18n'
import type { Publication } from '../../data/content'
import type { Lang } from '../../lib/lang'
import { useReveal } from '../../hooks/useReveal'

export const LangContext = createContext<Lang>('en')
export const useLang = () => useContext(LangContext)

/** Renders a UI string from the i18n table. */
export function T({ k }: { k: TKey }) {
  return <Dual en={STRINGS[k].en} ko={STRINGS[k].ko} />
}

export function B({ value }: { value: Bilingual }) {
  return <Dual en={value.en} ko={value.ko} />
}

/** "2023–present" -> localized "present". */
export function Period({ text }: { text: string }) {
  const parts = text.split('present')
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {part}
          {index < parts.length - 1 && <T k="present" />}
        </Fragment>
      ))}
    </>
  )
}

/** A block that fades in when it scrolls into view. */
export function Reveal({ className, children }: { className?: string; children: ReactNode }) {
  const reveal = useReveal()
  return (
    <motion.div className={className} {...reveal}>
      {children}
    </motion.div>
  )
}

export interface PaperLink {
  url: string
  label: Bilingual
}

type PaperExtras = { links?: PaperLink[]; linkLabel?: Bilingual; codeUrl?: string }

export function paperLinks(paper: Publication): PaperLink[] {
  const p = paper as Publication & PaperExtras
  return p.links ?? [{ url: p.url, label: p.linkLabel ?? { en: 'Paper', ko: '논문' } }]
}

export const paperCodeUrl = (paper: Publication) => (paper as Publication & PaperExtras).codeUrl

export const venueLabel = (p: Publication) => (p.type === 'thesis' ? 'Thesis' : p.venue.split(' · ')[0])
