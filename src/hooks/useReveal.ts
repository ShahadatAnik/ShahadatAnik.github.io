import type { HTMLMotionProps } from 'framer-motion'
import { useMotion } from './useMotion'

/** Props for a `motion.*` element that fades up once when it scrolls into view (no-op when motion is off). */
export function useReveal(): Pick<HTMLMotionProps<'div'>, 'initial' | 'whileInView' | 'viewport' | 'transition'> {
  const { allowed } = useMotion()
  if (!allowed) return {}
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.06, margin: '0px 0px -25px 0px' },
    transition: { duration: 0.5, ease: [0.22, 0.8, 0.25, 1] },
  }
}
