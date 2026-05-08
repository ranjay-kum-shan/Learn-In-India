import { Inter, JetBrains_Mono, Newsreader } from 'next/font/google'

export const fontSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export const fontSerif = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
})
