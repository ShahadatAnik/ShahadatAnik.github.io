import { useCallback, useState } from 'react'
import '@/styles/styles.css'
import '@/styles/readability.css'
import '@/styles/motion.css'
import '@/styles/brain-ai.css'
import '@/styles/visuals.css'
import '@/styles/polish.css'
import type { Lang } from '@/lib/lang'
import type { TopicId } from '@/data/i18n'
import { MotionProvider, useMotion } from '@/hooks/useMotion'
import { useScrollingFlag } from '@/hooks/useScrollingFlag'
import { ToastProvider } from '@/hooks/useToast'
import { Contact } from './home/Contact'
import { Experience } from './home/Experience'
// Gallery is hidden for now. To bring it back, uncomment this import and the Gallery line in the page below.
// import { Gallery } from './home/Gallery'
import { Header } from './home/Header'
import { Hero } from './home/Hero'
import { Journey } from './home/Journey'
import { DEFAULT_FILTERS, Publications, type PublicationFilters } from './home/Publications'
import { Research } from './home/Research'
import { LangContext } from './ui'

function Page() {
  const { allowed } = useMotion()
  useScrollingFlag()
  const [filters, setFilters] = useState<PublicationFilters>(DEFAULT_FILTERS)

  // "Explore related work" on a research node filters the publication list and scrolls to it.
  const explore = useCallback(
    (topic: TopicId) => {
      setFilters({ topic, query: '', year: 'all' })
      document.getElementById('publications')?.scrollIntoView({ behavior: allowed ? 'smooth' : 'instant' })
    },
    [allowed],
  )

  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Research onExplore={explore} />
        <Publications filters={filters} onFilters={setFilters} />
        <Journey />
        <Experience />
        {/* <Gallery /> */}
        <Contact />
      </main>
    </>
  )
}

export function HomePage({ lang }: { lang: Lang }) {
  return (
    <LangContext.Provider value={lang}>
      <MotionProvider>
        <ToastProvider>
          <Page />
        </ToastProvider>
      </MotionProvider>
    </LangContext.Provider>
  )
}
