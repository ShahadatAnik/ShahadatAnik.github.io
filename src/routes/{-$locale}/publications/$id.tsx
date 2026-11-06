import { createFileRoute, notFound } from '@tanstack/react-router'
import { PaperPage } from '../../../components/paper/PaperPage'
import { PAPER_IDS, paperHead } from '../../../data/seo'
import type { Lang } from '../../../lib/lang'

const langOf = (locale?: string): Lang => (locale === 'kr' ? 'ko' : 'en')

export const Route = createFileRoute('/{-$locale}/publications/$id')({
  beforeLoad: ({ params }) => {
    if ((params.locale && params.locale !== 'kr') || !PAPER_IDS.includes(params.id)) throw notFound()
  },
  head: ({ params }) => paperHead(params.id, langOf(params.locale)),
  component: function Paper() {
    const { id, locale } = Route.useParams()
    return <PaperPage id={id} lang={langOf(locale)} />
  },
})
