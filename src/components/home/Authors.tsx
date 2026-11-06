import { PROFILE_DATA } from '../../data/content'
import { Fragment } from 'react'
import type { Publication } from '../../data/content'
import { localized } from '../../data/i18n'
import { Highlight } from './Highlight'
import { useLang } from './shared'

/** Comma-separated author list; the site owner is bold and corresponding authors carry an asterisk. */
export function Authors({ paper, query = '' }: { paper: Publication; query?: string }) {
  const lang = useLang()
  const label = localized(lang, 'Corresponding author', '교신저자')
  const names = paper.authors.split(',').map((name) => name.trim())
  return (
    <>
      {names.map((name, index) => (
        <Fragment key={name}>
          {index > 0 && ', '}
          <span className="publication-author">
            {name === PROFILE_DATA.profile.nameEn ? <strong><Highlight text={name} query={query} /></strong> : <Highlight text={name} query={query} />}
            {(paper.correspondingAuthors as string[]).includes(name) && (
              <sup className="author-mark" title={label} aria-label={label}>*</sup>
            )}
          </span>
        </Fragment>
      ))}
    </>
  )
}
