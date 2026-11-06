import { PROFILE_DATA } from '../../data/content'
import { localized } from '../../data/i18n'
import { CopyButton } from './CopyButton'
import { Reveal, T, useLang } from './shared'

const { profile } = PROFILE_DATA

export function Contact() {
  const lang = useLang()
  return (
    <section className="contact-section" id="contact">
      <div className="page-width">
        <Reveal className="contact-top">
          <div>
            <span className="eyebrow">06 / GET IN TOUCH</span>
            <h2><T k="contactTitle" /></h2>
            <p><T k="contactIntro" /></p>
          </div>
          <a className="contact-arrow" href={`mailto:${profile.email}`} aria-label="Send an email / 发送邮件">
            <span className="contact-arrow-glyph" aria-hidden="true">↗</span>
          </a>
        </Reveal>
        <div className="email-row">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <CopyButton
            id="copy-email"
            className="icon-button"
            text={profile.email}
            message={localized(lang, 'Email address copied', '已复制邮箱地址')}
            ariaLabel="Copy email / 复制邮箱"
          >
            <svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4H4v12h4" /></svg>
          </CopyButton>
        </div>
        <Footer />
      </div>
    </section>
  )
}

function Footer() {
  return (
    <div className="footer">
      <span>© 2026 Zihan Zhang · 张梓寒</span>
      <div>
        <a id="footer-github" target="_blank" rel="noopener" href={profile.github}>GitHub ↗</a>
        <a id="footer-scholar" target="_blank" rel="noopener" href={profile.scholar}>Scholar ↗</a>
        <a href="#home"><T k="backTop" /></a>
      </div>
      <span className="footer-note"><T k="footerNote" /></span>
    </div>
  )
}
