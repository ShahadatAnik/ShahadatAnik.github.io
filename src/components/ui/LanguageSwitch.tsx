import { Link } from '@tanstack/react-router'
import type { Ref } from 'react'
import { writeStorage } from '@/hooks/storage'
import { rememberScrollAnchor } from '@/lib/scrollAnchor'
import type { Lang } from '@/lib/lang'

const LANGUAGES = [
  { lang: 'en', locale: undefined, label: 'EN', aria: 'EN, English' },
  { lang: 'ko', locale: 'kr', label: 'KR', aria: 'KR, 한국어' },
] as const satisfies readonly { lang: Lang; locale: 'kr' | undefined; label: string; aria: string }[]

/** Which route the switch stays on: the home page, or one paper page. */
export type SwitchTarget = { to: '/{-$locale}' } | { to: '/{-$locale}/publications/$id'; id: string }

interface Props {
  lang: Lang
  target: SwitchTarget
  className: string
  /** Render the sliding indicator span (the home header animates it). */
  indicator?: boolean
  innerRef?: Ref<HTMLDivElement>
  onSelect?: () => void
}

/** EN / KR switch. A client-side route change, so the page never reloads. */
export function LanguageSwitch({ lang, target, className, indicator = false, innerRef, onSelect }: Props) {
  return (
    <div ref={innerRef} className={className} role="group" aria-label="Language / 언어">
      {indicator && <span className="language-active-indicator" aria-hidden="true" />}
      {LANGUAGES.map((item) => {
        const shared = {
          'data-lang': item.lang,
          'aria-label': item.aria,
          className: lang === item.lang ? 'active' : undefined,
          'aria-current': lang === item.lang ? ('page' as const) : undefined,
          resetScroll: false,
          onClick: () => {
            rememberScrollAnchor()
            writeStorage('zz-language', item.lang)
            onSelect?.()
          },
          children: item.label,
        }
        return target.to === '/{-$locale}' ? (
          <Link key={item.lang} to="/{-$locale}" params={{ locale: item.locale }} {...shared} />
        ) : (
          <Link key={item.lang} to="/{-$locale}/publications/$id" params={{ id: target.id, locale: item.locale }} {...shared} />
        )
      })}
    </div>
  )
}
