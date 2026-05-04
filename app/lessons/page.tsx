import Link from 'next/link'
import { BookOpen, Clock, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { listLessons } from '@/lib/content/loaders'

export const metadata = { title: 'Lessons' }

export default async function LessonsPage() {
  const lessons = await listLessons()

  return (
    <div className="container py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Fundamentals
        </h1>
        <p className="mt-2 text-muted-foreground">
          The core mental models. Read these once; reference them forever.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {lessons.map((l) => (
          <Link key={l.slug} href={`/lessons/${l.slug}`} className="group block">
            <Card className="h-full transition-all hover:border-brand-500/40 hover:shadow-md">
              <CardContent className="flex items-start justify-between gap-4 p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-medium leading-tight">{l.title}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {l.reading_minutes} min
                      <Badge variant="secondary" className="capitalize">
                        {l.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
