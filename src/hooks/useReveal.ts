import type { HTMLMotionProps } from 'framer-motion'

/**
 * Props for a `motion.*` element. Scroll-reveal fading was removed: it started blocks at opacity 0 and
 * depended on IntersectionObserver firing, which left sections invisible in some browsers.
 */
export function useReveal(): Pick<HTMLMotionProps<'div'>, 'initial' | 'whileInView' | 'viewport' | 'transition'> {
  return {}
}
