import { Link } from '@tanstack/react-router'
import { langPrefix, type Lang } from '../../lib/lang'
import { PROFILE_DATA } from '../../data/content'

const LANGS: { lang: Lang; label: string; aria: string }[] = [
  { lang: 'en', label: 'EN', aria: 'English' },
  { lang: 'ko', label: 'KR', aria: '한국어' },
]

type Props = { id: string; lang: Lang; theme: 'dark' | 'light'; onToggleTheme: () => void }

export function PaperHeader({ id, lang, theme, onToggleTheme }: Props) {
  return (
    <header className="header">
      <div className="header-inner">
        <a className="brand" href={`${langPrefix(lang)}/`}>
          <span className="brand-symbol" aria-hidden="true">
            a<span>·</span>
          </span>
          <span>
            {PROFILE_DATA.profile.nameEn}
          </span>
        </a>
        <div className="header-tools">
          <nav className="paper-language" aria-label="Language / 언어">
            <span className="language-active-indicator" aria-hidden="true"></span>
            {LANGS.map((l) => (
              <Link
                key={l.lang}
                data-lang={l.lang}
                to="/{-$locale}/publications/$id"
                params={{ id, locale: l.lang === 'ko' ? 'kr' : undefined }}
                resetScroll={false}
                aria-label={l.aria}
                className={l.lang === lang ? 'active' : undefined}
                aria-current={l.lang === lang ? 'page' : undefined}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <button
            id="paper-theme"
            className="paper-theme"
            type="button"
            aria-label="Switch color theme / 테마 전환"
            aria-pressed={theme === 'dark'}
            onClick={onToggleTheme}
          >
            ◐
          </button>
        </div>
      </div>
    </header>
  )
}
