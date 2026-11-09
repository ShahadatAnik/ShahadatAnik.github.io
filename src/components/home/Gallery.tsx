import { CalendarDays, ChevronLeft, ChevronRight, Images, MapPin, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { B, ExternalLink, Glyph, SectionHeading, T, useLang } from '@/components/ui'
import { PROFILE_DATA, type GalleryRecord } from '@/data/content'
import { T as STRINGS } from '@/data/i18n'
import { formatMonth } from '@/lib/format'

const { gallery } = PROFILE_DATA

/** One photo card: photo, date and place, the event name, and a short description. Events with several photos open the viewer. */
function GalleryCard({ item, clone = false, onOpen }: { item: GalleryRecord; clone?: boolean; onOpen: (item: GalleryRecord) => void }) {
  const lang = useLang()
  const many = item.images.length > 1
  const card = (
    <figure className="gallery-card">
      <div className={item.logo ? 'gallery-photo is-logo' : 'gallery-photo'}>
        <img src={item.images[0]} alt={clone ? '' : item.alt[lang]} width={800} height={600} loading="lazy" decoding="async" draggable={false} />
        {item.sample && <span className="gallery-sample"><T k="sampleBadge" /></span>}
        {many && (
          <span className="gallery-count" aria-hidden="true">
            <Glyph icon={Images} />1/{item.images.length}
          </span>
        )}
      </div>
      <figcaption>
        <p className="gallery-meta">
          <span><Glyph icon={CalendarDays} />{formatMonth(item.date, lang)}</span>
          {item.place && <span><Glyph icon={MapPin} /><B value={item.place} /></span>}
        </p>
        <h3><B value={item.event} /></h3>
        <p className="gallery-desc"><B value={item.description} /></p>
      </figcaption>
    </figure>
  )
  const linked = item.url && !many
  return (
    <li className="gallery-item" {...(clone ? { 'aria-hidden': true, inert: true } : {})}>
      {linked ? <ExternalLink className="gallery-link" href={item.url!} arrow={false}>{card}</ExternalLink> : card}
      {many && (
        // Stretched over the whole card so the card stays valid markup (a figure cannot live inside a button).
        <button type="button" className="gallery-open" onClick={() => onOpen(item)} aria-label={`${STRINGS.galleryOpen[lang]}: ${item.event[lang]} (${item.images.length})`} />
      )}
    </li>
  )
}

/**
 * Photo viewer for events with several photos. Uses a native modal <dialog>, so focus is trapped, Escape closes it and
 * the page behind is inert. Arrow keys, the buttons and a swipe change the photo; the next photo is preloaded.
 */
function GalleryViewer({ item, onClose }: { item: GalleryRecord; onClose: () => void }) {
  const lang = useLang()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const swipeStart = useRef<number | null>(null)
  const [index, setIndex] = useState(0)
  const total = item.images.length
  const go = useCallback((step: number) => setIndex((current) => (current + step + total) % total), [total])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    // Not closed in the cleanup: removing the dialog from the page already leaves the top layer, and closing it here
    // would fire `close` and unmount the viewer again (React strict mode runs this effect twice in development).
    if (!dialog.open) dialog.showModal()
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => { document.documentElement.style.overflow = previousOverflow }
  }, [])

  // Preload the neighbours so the arrows feel instant.
  useEffect(() => {
    for (const step of [1, -1]) {
      const preload = new Image()
      preload.src = item.images[(index + step + total) % total]
    }
  }, [index, item.images, total])

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); go(1) }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1) }
  }
  const onPointerUp = (event: PointerEvent) => {
    if (swipeStart.current === null) return
    const distance = event.clientX - swipeStart.current
    swipeStart.current = null
    if (Math.abs(distance) > 50) go(distance < 0 ? 1 : -1)
  }

  return (
    <dialog
      ref={dialogRef}
      className="gallery-viewer"
      aria-label={item.event[lang]}
      onClose={onClose}
      onKeyDown={onKeyDown}
      // A click on the dark backdrop (the dialog element itself) closes it.
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <div className="viewer-card">
        <div
          className="viewer-stage"
          onPointerDown={(event) => { swipeStart.current = event.clientX }}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { swipeStart.current = null }}
        >
          <img key={index} src={item.images[index]} alt={`${item.alt[lang]} (${index + 1}/${total})`} draggable={false} />
          <button type="button" className="viewer-close" onClick={onClose} aria-label={STRINGS.galleryClose[lang]}><Glyph icon={X} /></button>
          <button type="button" className="viewer-nav prev" onClick={() => go(-1)} aria-label={STRINGS.galleryPrev[lang]}><Glyph icon={ChevronLeft} /></button>
          <button type="button" className="viewer-nav next" onClick={() => go(1)} aria-label={STRINGS.galleryNext[lang]}><Glyph icon={ChevronRight} /></button>
          <span className="viewer-count" aria-live="polite">{index + 1} / {total}</span>
        </div>
        <div className="viewer-caption">
          <p className="gallery-meta">
            <span><Glyph icon={CalendarDays} />{formatMonth(item.date, lang)}</span>
            {item.place && <span><Glyph icon={MapPin} /><B value={item.place} /></span>}
          </p>
          <h3><B value={item.event} /></h3>
          <p className="viewer-desc"><B value={item.description} /></p>
          {item.url && <ExternalLink className="viewer-link" href={item.url}><T k="galleryOpenLink" /></ExternalLink>}
        </div>
      </div>
    </dialog>
  )
}

/**
 * Auto-scrolling photo strip. The cards are repeated so each half of the track is wider than any screen (otherwise
 * the loop would show a gap with only a few photos). The copies are added after the page has loaded, so the HTML stays
 * small and search engines see each photo once; they are hidden from screen readers and the keyboard. It pauses on hover
 * or focus, and becomes a plain swipeable row when motion is reduced or paused.
 */
const MIN_CARDS_PER_HALF = 8

export function Gallery() {
  if (gallery.length === 0) return null
  const [running, setRunning] = useState(false)
  const [viewing, setViewing] = useState<GalleryRecord | null>(null)
  useEffect(() => setRunning(true), [])
  const repeat = Math.max(1, Math.ceil(MIN_CARDS_PER_HALF / gallery.length))
  // Before the page is interactive there is just one copy and the strip is still; then the copies appear and it starts.
  const copies = Array.from({ length: running ? repeat * 2 : 1 }, (_, copy) => copy)
  return (
    <section className="gallery-section section" id="gallery">
      <div className="page-width">
        <SectionHeading eyebrow="GALLERY" title="galleryTitle" intro="galleryIntro" />
      </div>
      <div className="gallery-marquee" role="region" aria-label="Photo gallery / 사진 갤러리" tabIndex={0}>
        <ul className={running ? 'gallery-track is-running' : 'gallery-track'} style={{ '--count': gallery.length * repeat } as CSSProperties}>
          {copies.map((copy) =>
            gallery.map((item) => <GalleryCard key={`${copy}-${item.images[0]}-${item.date}`} item={item} clone={copy > 0} onOpen={setViewing} />),
          )}
        </ul>
      </div>
      {viewing && <GalleryViewer item={viewing} onClose={() => setViewing(null)} />}
    </section>
  )
}
