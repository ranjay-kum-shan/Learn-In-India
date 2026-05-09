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
    <div className="container py-12 md:py-16 text-foreground min-h-screen">
      <header className="mb-12 max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
          Explore Courses
        </h1>
        <p className="mt-4 text-lg text-muted-foreground font-sans leading-relaxed">
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
            <Card className="h-full border-[#191A1F] bg-[#050505] transition-all duration-300 hover:border-[#404040] hover:-translate-y-1 rounded-lg">
              <CardContent className="flex flex-col h-full space-y-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="line-clamp-2 font-display text-lg font-bold text-white tracking-tight group-hover:text-brand-primary transition-colors">
                    {p.title}
                  </h3>
                  {p.is_free ? (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-display text-[10px] font-bold uppercase tracking-widest shrink-0 rounded">
                      Free
                    </Badge>
                  ) : (
                    <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20 font-display text-[10px] font-bold uppercase tracking-widest gap-1 shrink-0 rounded">
                      <Lock className="h-3 w-3" />
                      Pro
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 flex-grow">
                  {p.tags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="secondary" className="bg-[#191A1F] text-muted-foreground hover:text-white border-none font-sans text-xs transition-colors rounded">
                      <Tag className="h-3 w-3 mr-1 opacity-50" />
                      {t}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-[#191A1F] pt-4 mt-auto">
                  <span className="flex items-center gap-1.5 text-xs font-sans font-medium text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {p.estimated_minutes} min
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-display text-[10px] font-bold uppercase tracking-widest rounded",
                      p.difficulty === 'easy'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : p.difficulty === 'medium'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    )}
                  >
                    {p.difficulty}
                  </Badge>
                </div>

                <div
                  className={cn(
                    'mt-2 flex items-center justify-between text-sm font-display tracking-wide font-bold text-brand-primary',
                    'opacity-0 transition-all group-hover:opacity-100',
                  )}
                >
                  View Details
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-brand-primary/10 text-brand-primary">
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
