import { createFileRoute, notFound } from '@tanstack/react-router'
import { HomePage } from '../../components/HomePage'
import { homeHead } from '../../data/seo'
import type { Lang } from '../../lib/lang'

const langOf = (locale?: string): Lang => (locale === 'kr' ? 'ko' : 'en')

// One route for both languages (`/` and `/kr`), so the page stays mounted when the language is switched.
export const Route = createFileRoute('/{-$locale}/')({
  beforeLoad: ({ params }) => {
    if (params.locale && params.locale !== 'kr') throw notFound()
  },
  head: ({ params }) => homeHead(langOf(params.locale)),
  component: function Home() {
    const { locale } = Route.useParams()
    return <HomePage lang={langOf(locale)} />
  },
})
