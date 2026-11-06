import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { useRef, useState, type CSSProperties } from 'react'
import { NAV_ITEMS, localized } from '../../data/i18n'
import type { Lang } from '../../lib/lang'
import { useActiveIndicator } from '../../hooks/useActiveIndicator'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useTheme } from '../../hooks/useTheme'
import { writeStorage } from '../../hooks/storage'
import { B, useLang } from './shared'

const LANGUAGES = [
  { lang: 'zh', to: '/zh/', label: '中', aria: '中文' },
  { lang: 'en', to: '/en/', label: 'EN', aria: 'English' },
  { lang: 'both', to: '/', label: '对照', aria: '中英文对照' },
] as const satisfies readonly { lang: Lang; to: string; label: string; aria: string }[]

const NAV_HASHES = NAV_ITEMS.map((item) => item.hash)

export function Header() {
  const lang = useLang()
  const { theme, toggle: toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const switchRef = useRef<HTMLDivElement>(null)

  // Scroll progress is a compositor-only scaleX; compact state flips only when it crosses the threshold.
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 })
  useMotionValueEvent(scrollY, 'change', (y) => setCompact((previous) => (previous === y > 90 ? previous : y > 90)))
  const [atBottom, setAtBottom] = useState(false)
  useMotionValueEvent(scrollYProgress, 'change', (p) => setAtBottom((previous) => (previous === p > 0.985 ? previous : p > 0.985)))
  const section = useActiveSection(NAV_HASHES)
  const activeHash = atBottom ? NAV_HASHES[NAV_HASHES.length - 1] : section

  useActiveIndicator(navRef, 'a.active', 'nav', [activeHash, lang])
  useActiveIndicator(switchRef, '[data-lang].active', 'language', [lang])

  const navStyle = { '--nav-opacity': activeHash ? '1' : '0' } as CSSProperties
  const links = (mark: boolean, onClick?: () => void) =>
    NAV_ITEMS.map((item) => (
      <a
        key={item.hash}
        href={`#${item.hash}`}
        className={mark && activeHash === item.hash ? 'active' : undefined}
        aria-current={mark && activeHash === item.hash ? 'location' : undefined}
        onClick={onClick}
      >
        <B value={item.label} />
      </a>
    ))

  return (
    <>
      <a className="skip" href="#main">Skip to content / 跳转正文</a>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <header ref={headerRef} className={compact ? 'header is-compact' : 'header'}>
        <div className="header-inner">
          <a href="#home" className="brand" aria-label="Zihan Zhang — Home">
            <span className="brand-symbol" aria-hidden="true">z<span>·</span></span>
            <span>Zihan Zhang<span className="brand-zh">张梓寒</span></span>
          </a>
          <nav ref={navRef} className="desktop-nav" aria-label="Main navigation" data-has-active={String(Boolean(activeHash))} style={navStyle}>
            <span className="nav-active-indicator" aria-hidden="true" />
            {links(true)}
          </nav>
          <div className="header-tools">
            <div ref={switchRef} className="language-switch" role="group" aria-label="Language / 语言">
              <span className="language-active-indicator" aria-hidden="true" />
              {LANGUAGES.map((item) => (
                <a
                  key={item.lang}
                  href={item.to}
                  data-lang={item.lang}
                  aria-label={item.aria}
                  className={lang === item.lang ? 'active' : undefined}
                  aria-current={lang === item.lang ? 'page' : undefined}
                  onClick={() => writeStorage('zz-language', item.lang)}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <button id="theme-toggle" type="button" className="icon-button" aria-label="Switch color theme / 切换深浅主题" aria-pressed={theme === 'dark'} onClick={toggleTheme}>
              <svg className="moon" viewBox="0 0 24 24"><path d="M20.5 14A8.6 8.6 0 0 1 10 3.5 8.7 8.7 0 1 0 20.5 14Z" /></svg>
              <svg className="sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></svg>
            </button>
            <button
              id="menu-toggle"
              type="button"
              className="icon-button menu-button"
              aria-label="Open navigation / 打开导航"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
          </div>
        </div>
        <nav id="mobile-nav" className="mobile-nav" aria-label={localized(lang, 'Mobile navigation', '移动导航')} hidden={!menuOpen}>
          {links(false, () => setMenuOpen(false))}
        </nav>
      </header>
    </>
  )
}
