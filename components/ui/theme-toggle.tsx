'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  // Avoid SSR/CSR mismatch by rendering a placeholder until theme is known.
  if (!mounted) {
    return (
      <span
        aria-hidden
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-md border border-border',
          className,
        )}
      />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-md border border-border bg-background/60 backdrop-blur transition-colors hover:border-primary/50 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      <span className="sr-only">Toggle theme</span>
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ y: -16, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 16, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="text-foreground"
          >
            <Moon className="h-4 w-4" strokeWidth={1.75} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ y: 16, opacity: 0, rotate: 90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -16, opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="text-foreground"
          >
            <Sun className="h-4 w-4" strokeWidth={1.75} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
