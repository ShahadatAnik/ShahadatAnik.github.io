import { topicLabel } from '@/data/i18n'
import { B } from './Text'

/** A paper's research topics, as bilingual labels. */
export function TopicList({ topics, className }: { topics: readonly string[]; className: string }) {
  return (
    <div className={className}>
      {topics.map((topic) => <span key={topic}><B value={topicLabel(topic)} /></span>)}
    </div>
  )
}
