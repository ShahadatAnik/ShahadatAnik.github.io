import type { Publication } from './content'
import { T, type Bilingual } from './i18n'

export interface PaperLink {
  url: string
  label: Bilingual
}

/** Every outbound link of a paper (publisher/DOI links, then code). One source for rows, dialog and paper page. */
export function paperLinks(paper: Publication): PaperLink[] {
  const links: PaperLink[] = paper.links ?? [{ url: paper.url, label: paper.linkLabel ?? { en: 'Paper', ko: '논문' } }]
  return paper.codeUrl ? [...links, { url: paper.codeUrl, label: T.code }] : links
}
