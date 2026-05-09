import Link from 'next/link'
import { Clock, Lock, ChevronRight, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { fetchProblems } from '@/lib/data/problems'
import { cn } from '@/lib/utils'

export const metadata = { title: 'Explore Courses' }

export default async function ProblemsPage() {
  const problems = await fetchProblems()

  return (
    <div className="container py-12 md:py-16">
      <header className="mb-12 max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-brand-500 md:text-5xl">
          Explore Courses
        </h1>
        <p className="mt-4 text-lg text-slate-600 font-serif leading-relaxed">
          {problems.length} hand-curated courses and problem sets. Each ships with a comprehensive grading rubric authored by industry experts.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {problems.map((p) => (
          <Link
            key={p.slug}
            href={`/problems/${p.slug}`}
            className="group block"
          >
            <Card className="h-full border-none shadow-[0_8px_30px_rgba(10,15,28,0.02)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(10,15,28,0.06)] hover:-translate-y-1 bg-white ring-1 ring-slate-200 hover:ring-brand-400/50">
              <CardContent className="flex flex-col h-full space-y-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="line-clamp-2 font-display text-lg font-bold text-slate-900 group-hover:text-brand-500 transition-colors">
                    {p.title}
                  </h3>
                  {p.is_free ? (
                    <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-sans text-[10px] font-bold uppercase tracking-wider shrink-0">
                      Free
                    </Badge>
                  ) : (
                    <Badge className="bg-brand-50 text-brand-600 hover:bg-brand-100 font-sans text-[10px] font-bold uppercase tracking-wider gap-1 border border-brand-200 shrink-0">
                      <Lock className="h-3 w-3" />
                      Pro
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 flex-grow">
                  {p.tags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-600 border-none font-sans text-xs">
                      <Tag className="h-3 w-3 mr-1 opacity-50" />
                      {t}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                  <span className="flex items-center gap-1.5 text-xs font-sans font-medium text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    {p.estimated_minutes} min
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-sans text-[10px] font-bold uppercase tracking-wider border-none",
                      p.difficulty === 'easy'
                        ? 'bg-green-50 text-green-600'
                        : p.difficulty === 'medium'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-red-50 text-red-600'
                    )}
                  >
                    {p.difficulty}
                  </Badge>
                </div>

                <div
                  className={cn(
                    'mt-2 flex items-center justify-between text-sm font-sans font-semibold text-brand-500',
                    'opacity-0 transition-all group-hover:opacity-100',
                  )}
                >
                  View Details
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 group-hover:bg-brand-500 transition-colors">
                    <ChevronRight className="h-4 w-4 text-brand-500 group-hover:text-white transition-colors" />
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
