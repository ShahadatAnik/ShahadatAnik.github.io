import { useEffect, type RefObject } from 'react'
import { useMotion } from './useMotion'

/** One-time staggered entrance of the hero headline fragments (`.headline-fragment`) when motion is allowed. */
export function useHeadlineEntrance(ref: RefObject<HTMLElement | null>) {
  const { allowed } = useMotion()
  useEffect(() => {
    const root = ref.current
    if (!root || !allowed || document.hidden) return
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const fragments = [...root.querySelectorAll<HTMLElement>('.headline-fragment')].filter((el) => el.getClientRects().length)
    const animations = fragments.map((fragment, index) =>
      fragment.animate(
        [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 440, delay: Math.min(index * 40, 400), easing: 'cubic-bezier(.2,.7,.25,1)', fill: 'backwards' },
      ),
    )
    const finish = () => animations.forEach((animation) => animation.finish())
    media.addEventListener('change', finish)
    return () => {
      media.removeEventListener('change', finish)
      animations.forEach((animation) => animation.cancel())
    }
    // Runs once on mount; later pause/resume must not replay the entrance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // Pausing motion mid-entrance completes it immediately.
  useEffect(() => {
    if (allowed) return
    ref.current?.getAnimations({ subtree: true }).forEach((animation) => animation.finish())
  }, [allowed, ref])
}
