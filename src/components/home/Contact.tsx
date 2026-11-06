import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { CopyButton, CopyIcon, Eyebrow, ExternalLink, Glyph, Reveal, T, useLang } from '@/components/ui'
import { PROFILE_DATA } from '@/data/content'
import { localized } from '@/data/i18n'

const { profile } = PROFILE_DATA

export function Contact() {
  const lang = useLang()
  return (
    <section className="contact-section" id="contact">
      <div className="page-width">
        <Reveal className="contact-top">
          <div>
            <Eyebrow>GET IN TOUCH</Eyebrow>
            <h2><T k="contactTitle" /></h2>
            <p><T k="contactIntro" /></p>
          </div>
          <a className="contact-arrow" href={`mailto:${profile.email}`} aria-label="Send an email / 이메일 보내기">
            <Glyph icon={ArrowUpRight} className="contact-arrow-glyph" strokeWidth={1.6} />
          </a>
        </Reveal>
        <div className="email-row">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <CopyButton
            id="copy-email"
            className="icon-button"
            text={profile.email}
            message={localized(lang, 'Email address copied', '이메일 주소를 복사했습니다')}
            ariaLabel="Copy email / 이메일 복사"
          >
            <CopyIcon />
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
      <span>© {new Date().getFullYear()} {profile.nameEn}</span>
      <div>
        <ExternalLink id="footer-github" href={profile.github}>GitHub</ExternalLink>
        <ExternalLink id="footer-linkedin" href={profile.linkedin}>LinkedIn</ExternalLink>
        <ExternalLink id="footer-scholar" href={profile.scholar}>Scholar</ExternalLink>
        <a href="#home"><T k="backTop" /><Glyph icon={ArrowUp} className="link-arrow back-arrow" strokeWidth={2.1} /></a>
      </div>
    </div>
  )
}
