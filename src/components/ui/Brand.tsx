import { PROFILE_DATA } from '@/data/content'
import { Name } from './Name'

/** The site logo (the same artwork as the favicon) + full name, linking to `href`. Used by both headers. */
export function Brand({ href, ariaLabel }: { href: string; ariaLabel?: string }) {
  return (
    <a className="brand" href={href} aria-label={ariaLabel}>
      <span className="brand-symbol" aria-hidden="true">
        <img src="/assets/favicon.svg?v=2" alt="" width={36} height={36} />
      </span>
      <span className="brand-name"><Name name={PROFILE_DATA.profile.nameEn} /></span>
    </a>
  )
}
