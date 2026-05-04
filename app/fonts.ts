import { Inter, JetBrains_Mono } from 'next/font/google'

// We brand-name these "Geist" via CSS variables but use the freely-available
// Inter + JetBrains Mono pair from next/font for zero-config setup.
export const fontSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-sans',
})

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
})
