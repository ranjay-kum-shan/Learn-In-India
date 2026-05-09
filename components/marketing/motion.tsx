'use client'

import * as React from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Reveal — fades + lifts a block into view as it scrolls into the viewport.
 * Animation runs once. Honors prefers-reduced-motion (no transform, instant).
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const variants: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0 },
      }
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Stagger — coordinates a Reveal-like animation across direct children
 * via <StaggerItem> below. Useful for grids / lists.
 */
export function Stagger({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduce ? 0 : delay || 0.08,
            delayChildren: 0.05,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  const variants: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 18 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] },
        },
      }
  return (
    <motion.div className={cn('h-full', className)} variants={variants}>
      {children}
    </motion.div>
  )
}

/**
 * HoverLift — modest interactive feedback for cards: gently lifts and adds
 * a soft glow when pointed at.
 */
export function HoverLift({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) {
    return <div className={cn('h-full', className)}>{children}</div>
  }
  return (
    <motion.div
      className={cn('h-full', className)}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {children}
    </motion.div>
  )
}

/**
 * ParallaxBlob — two soft, brand-colored blobs that drift on scroll. Pure
 * eye-candy in the background of the landing page; pointer-events: none.
 */
export function ParallaxBlob() {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 80])

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        style={reduce ? undefined : { y: y1 }}
        className="absolute -top-32 left-[10%] h-[420px] w-[420px] rounded-full bg-primary/15 blur-[120px]"
      />
      <motion.div
        style={reduce ? undefined : { y: y2 }}
        className="absolute top-[60%] right-[5%] h-[360px] w-[360px] rounded-full bg-primary/10 blur-[140px]"
      />
    </div>
  )
}
