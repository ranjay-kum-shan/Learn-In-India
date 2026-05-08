import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toast'
import { QueryProvider } from '@/components/providers/query-provider'
import { fontSans, fontMono, fontSerif } from './fonts'
import { cn } from '@/lib/utils'
import { env } from '@/lib/env'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${env.NEXT_PUBLIC_SITE_NAME} — Practice system design like Duolingo`,
    template: `%s · ${env.NEXT_PUBLIC_SITE_NAME}`,
  },
  description:
    'A practice gym for system design. Build architectures on an interactive canvas, get rubric-graded by an AI staff engineer in 30 seconds, and walk into your interview fluent.',
  keywords: [
    'system design',
    'system design interview',
    'distributed systems practice',
    'AI grading',
    'design canvas',
    'FAANG interview prep',
  ],
  authors: [{ name: env.NEXT_PUBLIC_SITE_NAME }],
  creator: env.NEXT_PUBLIC_SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: env.NEXT_PUBLIC_SITE_URL,
    title: `${env.NEXT_PUBLIC_SITE_NAME} — Practice system design like Duolingo`,
    description:
      'Drag-drop architectures, rubric-graded by AI, hand-curated FAANG-style problems.',
    siteName: env.NEXT_PUBLIC_SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: env.NEXT_PUBLIC_SITE_NAME,
    description:
      'Drag-drop architectures, rubric-graded by AI, hand-curated FAANG-style problems.',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0f1c' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontMono.variable,
          fontSerif.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
