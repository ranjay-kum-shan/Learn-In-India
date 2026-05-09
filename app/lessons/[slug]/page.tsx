import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, ArrowLeft, BookOpen } from 'lucide-react'
import { Markdown } from '@/components/markdown'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { loadLesson, listLessons } from '@/lib/content/loaders'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  try {
    const { frontmatter } = await loadLesson(slug)
    return { title: frontmatter.title }
  } catch {
    return { title: 'Lesson' }
  }
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params
  let data: Awaited<ReturnType<typeof loadLesson>>
  try {
    data = await loadLesson(slug)
  } catch {
    notFound()
  }
  const { frontmatter, body } = data!

  // Find next lesson
  const all = await listLessons()
  const idx = all.findIndex((l) => l.slug === slug)
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null

  return (
    <div className="container py-8">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/lessons">
          <ArrowLeft className="h-4 w-4" />
          All lessons
        </Link>
      </Button>

      <Card>
        <CardContent className="p-7 md:p-10">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded border border-brand-primary/20 bg-brand-primary/10 text-brand-primary">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                {frontmatter.title}
              </h1>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {frontmatter.reading_minutes} min read
                <Badge variant="secondary" className="capitalize">
                  {frontmatter.category}
                </Badge>
              </div>
            </div>
          </div>

          <Markdown>{body}</Markdown>

          {next ? (
            <div className="mt-10 flex items-center justify-end border-t border-border/40 pt-6">
              <Button asChild variant="outline">
                <Link href={`/lessons/${next.slug}`}>
                  Next: {next.title}
                </Link>
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
