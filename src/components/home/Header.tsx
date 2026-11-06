import { Menu } from 'lucide-react'
import { B, Brand, LanguageSwitch, ThemeToggle, useLang } from '@/components/ui'
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { useRef, useState, type CSSProperties } from 'react'
import { NAV_ITEMS, localized } from '@/data/i18n'
import { PROFILE_DATA } from '@/data/content'
import { useActiveIndicator } from '@/hooks/useActiveIndicator'
import { useActiveSection } from '@/hooks/useActiveSection'

const NAV_HASHES = NAV_ITEMS.map((item) => item.hash)

export function Header() {
  const lang = useLang()
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
      <a className="skip" href="#main">Skip to content / 본문으로 건너뛰기</a>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <header ref={headerRef} className={compact ? 'header is-compact' : 'header'}>
        <div className="header-inner">
          <Brand href="#home" ariaLabel={`${PROFILE_DATA.profile.shortName} — Home`} />
          <nav ref={navRef} className="desktop-nav" aria-label="Main navigation" data-has-active={String(Boolean(activeHash))} style={navStyle}>
            <span className="nav-active-indicator" aria-hidden="true" />
            {links(true)}
          </nav>
          <div className="header-tools">
            <LanguageSwitch innerRef={switchRef} lang={lang} target={{ to: '/{-$locale}' }} className="language-switch" indicator />
            <ThemeToggle />
            <button
              id="menu-toggle"
              type="button"
              className="icon-button menu-button"
              aria-label="Open navigation / 메뉴 열기"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Menu aria-hidden="true" />
            </button>
          </div>
        </div>
        <nav id="mobile-nav" className="mobile-nav" aria-label={localized(lang, 'Mobile navigation', '모바일 내비게이션')} hidden={!menuOpen}>
          {links(false, () => setMenuOpen(false))}
          <LanguageSwitch lang={lang} target={{ to: '/{-$locale}' }} className="mobile-language" onSelect={() => setMenuOpen(false)} />
        </nav>
      </header>
    </>
  )
}
