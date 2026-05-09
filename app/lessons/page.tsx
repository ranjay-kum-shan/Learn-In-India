import Link from 'next/link'
import { BookOpen, Clock, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { listLessons } from '@/lib/content/loaders'

export const metadata = { title: 'Lessons' }

export default async function LessonsPage() {
  const lessons = await listLessons()

  return (
    <div className="container py-12 md:py-16 text-foreground min-h-screen">
      <header className="mb-12 max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
          Fundamentals
        </h1>
        <p className="mt-4 text-lg text-muted-foreground font-sans leading-relaxed">
          The core mental models and foundational knowledge. Read these once; reference them forever in your professional journey.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((l) => (
          <Link key={l.slug} href={`/lessons/${l.slug}`} className="group block">
            <Card className="h-full border-[#191A1F] bg-[#050505] transition-all duration-300 hover:border-[#404040] hover:-translate-y-1 rounded-lg">
              <CardContent className="flex flex-col h-full space-y-4 p-6">
                <div className="flex items-start gap-4">
                  <span className="shrink-0 flex h-12 w-12 items-center justify-center rounded border border-brand-primary/20 bg-brand-primary/10 text-brand-primary">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white leading-tight tracking-tight group-hover:text-brand-primary transition-colors">
                      {l.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-sans">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        {l.reading_minutes} min
                      </span>
                      <Badge variant="secondary" className="bg-[#191A1F] text-muted-foreground hover:text-white border-none font-display text-[10px] font-bold uppercase tracking-widest rounded transition-colors">
                        {l.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 flex justify-end">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-[#191A1F] text-muted-foreground group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
