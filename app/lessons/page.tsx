import Link from 'next/link'
import { BookOpen, Clock, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { listLessons } from '@/lib/content/loaders'

export const metadata = { title: 'Lessons' }

export default async function LessonsPage() {
  const lessons = await listLessons()

  return (
    <div className="container py-12 md:py-16">
      <header className="mb-12 max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-brand-500 md:text-5xl">
          Fundamentals
        </h1>
        <p className="mt-4 text-lg text-slate-600 font-serif leading-relaxed">
          The core mental models and foundational knowledge. Read these once; reference them forever in your professional journey.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((l) => (
          <Link key={l.slug} href={`/lessons/${l.slug}`} className="group block">
            <Card className="h-full border-none shadow-[0_8px_30px_rgba(10,15,28,0.02)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(10,15,28,0.06)] hover:-translate-y-1 bg-white ring-1 ring-slate-200 hover:ring-brand-400/50">
              <CardContent className="flex flex-col h-full space-y-4 p-6">
                <div className="flex items-start gap-4">
                  <span className="shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900 leading-tight group-hover:text-brand-500 transition-colors">
                      {l.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-sans">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        {l.reading_minutes} min
                      </span>
                      <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-600 border-none font-sans text-[10px] font-bold uppercase tracking-wider">
                        {l.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 flex justify-end">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 group-hover:bg-brand-500 transition-colors">
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
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
