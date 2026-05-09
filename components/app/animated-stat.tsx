'use client'

import * as React from 'react'
import {
  motion,
  useReducedMotion,
  useInView,
  animate,
} from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

export function AnimatedStatCard({
  icon,
  label,
  value,
  sub,
  delay = 0,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  sub: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [display, setDisplay] = React.useState<string>(
    typeof value === 'number' ? '0' : String(value),
  )

  // Tween numeric values from 0 to target on first reveal.
  React.useEffect(() => {
    if (!inView) return
    if (typeof value !== 'number') {
      setDisplay(String(value))
      return
    }
    if (reduce) {
      setDisplay(String(value))
      return
    }
    const controls = animate(0, value, {
      duration: 1.0,
      ease: 'easeOut',
      delay,
      onUpdate: (v) => setDisplay(Math.round(v).toString()),
    })
    return () => controls.stop()
  }, [inView, value, delay, reduce])

  return (
    <motion.div
      ref={ref}
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      <Card className="rounded-lg border-hairline surface-3 transition-colors hover:border-primary/30">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div className="font-display text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
              {label}
            </div>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded border border-primary/20 bg-primary/10 text-primary">
              {icon}
            </span>
          </div>
          <div className="font-display text-4xl font-bold tracking-tighter">{display}</div>
          <div className="font-sans text-xs text-muted-foreground">{sub}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
