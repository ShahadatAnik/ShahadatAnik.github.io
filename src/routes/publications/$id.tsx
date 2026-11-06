import { createFileRoute, notFound } from '@tanstack/react-router'
import { PaperPage } from '../../components/paper/PaperPage'
import { PAPER_IDS, paperHead } from '../../data/seo'

export const Route = createFileRoute('/publications/$id')({
  beforeLoad: ({ params }) => {
    if (!PAPER_IDS.includes(params.id)) throw notFound()
  },
  head: ({ params }) => paperHead(params.id, 'both'),
  component: function Paper() {
    const { id } = Route.useParams()
    return <PaperPage id={id} lang="both" />
  },
})
