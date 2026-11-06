import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../../components/HomePage'
import { homeHead } from '../../data/seo'

export const Route = createFileRoute('/zh/')({ head: () => homeHead('zh'), component: () => <HomePage lang="zh" /> })
