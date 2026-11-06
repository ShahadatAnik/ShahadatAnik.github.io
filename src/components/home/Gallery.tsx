import { CalendarDays, MapPin } from 'lucide-react'
import type { CSSProperties } from 'react'
import { B, ExternalLink, Glyph, SectionHeading, T, useLang } from '@/components/ui'
import { PROFILE_DATA, type GalleryRecord } from '@/data/content'
import { formatMonth } from '@/lib/format'

const { gallery } = PROFILE_DATA

/** One photo card: photo, date and place, the event name, and a short description. */
function GalleryCard({ item, clone = false }: { item: GalleryRecord; clone?: boolean }) {
  const lang = useLang()
  const card = (
    <figure className="gallery-card">
      <div className="gallery-photo">
        <img src={item.image} alt={clone ? '' : item.alt[lang]} width={800} height={600} loading="lazy" decoding="async" draggable={false} />
        {item.sample && <span className="gallery-sample"><T k="sampleBadge" /></span>}
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
  return (
    <li className="gallery-item" {...(clone ? { 'aria-hidden': true, inert: true } : {})}>
      {item.url ? <ExternalLink className="gallery-link" href={item.url} arrow={false}>{card}</ExternalLink> : card}
    </li>
  )
}

/**
 * Auto-scrolling photo strip. The list is repeated once so the loop has no jump; the copy is hidden from
 * screen readers and the keyboard. It pauses on hover or focus, and becomes a plain swipeable row when
 * motion is reduced or paused.
 */
export function Gallery() {
  if (gallery.length === 0) return null
  return (
    <section className="gallery-section section" id="gallery">
      <div className="page-width">
        <SectionHeading eyebrow="GALLERY" title="galleryTitle" intro="galleryIntro" />
      </div>
      <div className="gallery-marquee" role="region" aria-label="Photo gallery / 사진 갤러리" tabIndex={0}>
        <ul className="gallery-track" style={{ '--count': gallery.length } as CSSProperties}>
          {gallery.map((item) => <GalleryCard key={`${item.image}-${item.date}`} item={item} />)}
          {gallery.map((item) => <GalleryCard key={`clone-${item.image}-${item.date}`} item={item} clone />)}
        </ul>
      </div>
    </section>
  )
}
