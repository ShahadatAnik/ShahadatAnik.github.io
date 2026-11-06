import { langPrefix, type Lang } from '../../lib/lang'

const LANGS: { lang: Lang; label: string; aria: string }[] = [
  { lang: 'zh', label: '中', aria: '中文' },
  { lang: 'en', label: 'EN', aria: 'English' },
  { lang: 'both', label: '对照', aria: '中英文对照' },
]

type Props = { id: string; lang: Lang; theme: 'dark' | 'light'; onToggleTheme: () => void }

export function PaperHeader({ id, lang, theme, onToggleTheme }: Props) {
  return (
    <header className="header">
      <div className="header-inner">
        <a className="brand" href={`${langPrefix(lang)}/`}>
          <span className="brand-symbol" aria-hidden="true">
            z<span>·</span>
          </span>
          <span>
            Zihan Zhang<span className="brand-zh">张梓寒</span>
          </span>
        </a>
        <div className="header-tools">
          <nav className="paper-language" aria-label="Language / 语言">
            <span className="language-active-indicator" aria-hidden="true"></span>
            {LANGS.map((l) => (
              <a
                key={l.lang}
                data-lang={l.lang}
                href={`${langPrefix(l.lang)}/publications/${id}/`}
                aria-label={l.aria}
                className={l.lang === lang ? 'active' : undefined}
                aria-current={l.lang === lang ? 'page' : undefined}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <button
            id="paper-theme"
            className="paper-theme"
            type="button"
            aria-label="Switch color theme / 切换深浅主题"
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
