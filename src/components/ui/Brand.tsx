import { PROFILE_DATA } from '../../data/content'
import { Name } from './Name'

/** Logo mark + full name, linking to `href`. Used by both headers. */
export function Brand({ href, ariaLabel }: { href: string; ariaLabel?: string }) {
  return (
    <a className="brand" href={href} aria-label={ariaLabel}>
      <span className="brand-symbol" aria-hidden="true">a<span>·</span></span>
      <span><Name name={PROFILE_DATA.profile.nameEn} /></span>
    </a>
  )
}
