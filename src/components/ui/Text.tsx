import { Fragment } from 'react'
import { T as STRINGS, type Bilingual, type TKey } from '@/data/i18n'
import { Dual } from './Dual'

/** Renders a UI string from the i18n table. */
export function T({ k }: { k: TKey }) {
  return <Dual en={STRINGS[k].en} ko={STRINGS[k].ko} />
}

/** Renders a `{ en, ko }` value. */
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
