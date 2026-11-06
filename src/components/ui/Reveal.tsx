import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useReveal } from '@/hooks/useReveal'

/** A block that fades in when it scrolls into view. */
export function Reveal({ className, children }: { className?: string; children: ReactNode }) {
  const reveal = useReveal()
  return (
    <motion.div className={className} {...reveal}>
      {children}
    </motion.div>
  )
}
