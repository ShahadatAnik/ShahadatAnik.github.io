import { Arrow, Authors, B, CopyButton, Dual, ExternalLink, Eyebrow, T, useLang } from '../ui'
import { useEffect, useRef } from 'react'
import type { Publication } from '../../data/content'
import { paperLinks } from '../../data/papers'
import { SITE_ORIGIN, localized, paperPath } from '../../data/i18n'
import { useMotion } from '../../hooks/useMotion'

interface PaperDialogProps {
  paper: Publication | null
  /** Element that opened the dialog; focus returns to it on close. */
  trigger: HTMLElement | null
  onClosed: () => void
}

/** Modal "research overview" of a publication. The parent mounts it with `paper` set to open it. */
export function PaperDialog({ paper, trigger, onClosed }: PaperDialogProps) {
  const lang = useLang()
  const { allowed } = useMotion()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const animation = useRef<Animation | null>(null)
  const generation = useRef(0)
  const saved = useRef({ scrollY: 0, overflow: '' })
  const allowedRef = useRef(allowed)
  allowedRef.current = allowed

  // Open when a paper is chosen.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !paper || dialog.open) return
    generation.current++
    animation.current?.cancel()
    saved.current = { scrollY: scrollY, overflow: document.body.style.overflow }
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    dialog.scrollTop = 0
    dialog.dataset.state = 'opening'
    closeRef.current?.focus({ preventScroll: true })
    const rect = trigger?.getBoundingClientRect()
    const box = dialog.getBoundingClientRect()
    const dy = rect ? Math.max(-40, Math.min(40, rect.top + rect.height / 2 - box.top - box.height / 2)) : 14
    const current = generation.current
    if (allowedRef.current) {
      const run = dialog.animate(
        [{ opacity: 0, transform: `translateY(${dy}px) scale(.975)` }, { opacity: 1, transform: 'translateY(0) scale(1)' }],
        { duration: 240, easing: 'cubic-bezier(.2,.7,.2,1)' },
      )
      animation.current = run
      run.finished.then(() => {
        if (generation.current === current) dialog.dataset.state = 'open'
      }).catch(() => {})
    } else {
      dialog.dataset.state = 'open'
    }
  }, [paper, trigger])

  // Never leave the page scroll-locked if the page unmounts while open.
  useEffect(() => {
    const dialog = dialogRef.current
    return () => {
      animation.current?.cancel()
      if (dialog?.open) {
        document.body.style.overflow = saved.current.overflow
        dialog.close()
      }
    }
  }, [])

  const close = () => {
    const dialog = dialogRef.current
    if (!dialog || !dialog.open || dialog.dataset.state === 'closing') return
    const current = ++generation.current
    animation.current?.cancel()
    dialog.dataset.state = 'closing'
    const finish = () => {
      if (generation.current === current && dialog.open) dialog.close()
    }
    if (allowedRef.current) {
      const run = dialog.animate(
        [{ opacity: 1, transform: 'translateY(0) scale(1)' }, { opacity: 0, transform: 'translateY(10px) scale(.985)' }],
        { duration: 160, easing: 'ease-in' },
      )
      animation.current = run
      run.finished.then(finish).catch(() => {})
    } else {
      finish()
    }
  }

  const onClose = () => {
    const dialog = dialogRef.current
    document.body.style.overflow = saved.current.overflow
    if (dialog) dialog.dataset.state = 'closed'
    window.scrollTo({ top: saved.current.scrollY, behavior: 'instant' })
    const target = trigger?.isConnected ? trigger : paper ? document.querySelector<HTMLElement>(`.pub-row[data-paper="${paper.id}"] [data-open]`) : null
    target?.focus({ preventScroll: true })
    const url = new URL(location.href)
    if (paper && url.searchParams.get('paper') === paper.id) {
      url.searchParams.delete('paper')
      history.replaceState(history.state, '', url.href)
    }
    onClosed()
  }

  const corresponding = ((paper?.correspondingAuthors as string[] | undefined)?.length ?? 0) > 0

  return (
    <dialog
      id="paper-dialog"
      ref={dialogRef}
      aria-labelledby={lang === 'ko' ? 'dialog-ko-label' : 'dialog-title'}
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
      onClose={onClose}
      onClick={(event) => {
        const dialog = dialogRef.current
        if (!dialog || event.target !== dialog) return
        const r = dialog.getBoundingClientRect()
        if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close()
      }}
    >
      <div className="dialog-top">
        <Eyebrow><T k="paperDetails" /></Eyebrow>
        <button ref={closeRef} id="close-dialog" type="button" className="icon-button" aria-label="Close / 닫기" onClick={close}>×</button>
      </div>
      <div id="dialog-body">
        {paper && (
          <>
            <h2 id="dialog-title" className="en" lang="en">{paper.title}</h2>
            <h2 id="dialog-ko-label" className="dialog-ko-title ko" lang="ko">{paper.koTitle}</h2>
            <p className="dialog-authors"><Authors paper={paper} /></p>
            {corresponding && <p className="author-legend"><span aria-hidden="true">*</span> <T k="correspondingAuthor" /></p>}
            <p className="dialog-venue">{paper.venue} · {paper.year}</p>
            {paper.authorship && <span className="dialog-authorship authorship-label"><B value={paper.authorship} /></span>}
            <div className="dialog-summary">
              <div className="summary-label"><T k="researchInBrief" /></div>
              <B value={paper.summary} />
            </div>
            {paper.abstract && (
              <details className="dialog-abstract">
                <summary><Dual en="Abstract" ko="초록" /></summary>
                <p><B value={paper.abstract} /></p>
              </details>
            )}
            <div className="dialog-actions">
              <div className="dialog-primary-actions">
                {paperLinks(paper).map((link, i) => (
                  <ExternalLink key={link.url} className={`button ${i === 0 ? 'primary' : 'secondary'}`} href={link.url}>
                    <B value={link.label} />
                  </ExternalLink>
                ))}
              </div>
              <div className="dialog-secondary-actions">
                <CopyButton className="text-button" text={paper.bibtex} message={localized(lang, 'BibTeX copied', 'BibTeX를 복사했습니다')}>
                  <T k="copyBibtex" /> <span aria-hidden="true">⧉</span>
                </CopyButton>
                <CopyButton className="text-button" text={SITE_ORIGIN + paperPath(lang, paper.id)} message={localized(lang, 'Paper link copied', '논문 링크를 복사했습니다')}>
                  <T k="copyLink" /><Arrow />
                </CopyButton>
              </div>
            </div>
            <details className="bib-details">
              <summary>BibTeX</summary>
              <pre>{paper.bibtex}</pre>
            </details>
          </>
        )}
      </div>
    </dialog>
  )
}
