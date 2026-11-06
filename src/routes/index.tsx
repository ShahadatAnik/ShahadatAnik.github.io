import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../components/HomePage'
import { homeHead } from '../data/seo'

export const Route = createFileRoute('/')({ head: () => homeHead('both'), component: () => <HomePage lang="both" /> })
