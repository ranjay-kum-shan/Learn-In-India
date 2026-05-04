import Link from 'next/link'
import { Clock, Lock, ChevronRight, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { fetchProblems } from '@/lib/data/problems'
import { cn } from '@/lib/utils'

export const metadata = { title: 'Problems' }

export default async function ProblemsPage() {
  const problems = await fetchProblems()

  return (
    <div className="container py-10">
      <header className="mb-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Problems
        </h1>
        <p className="mt-2 text-muted-foreground">
          {problems.length} hand-curated problems. Each ships with a rubric authored by
          a senior engineer.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {problems.map((p) => (
          <Link
            key={p.slug}
            href={`/problems/${p.slug}`}
            className="group block"
          >
            <Card className="h-full transition-all hover:border-brand-500/40 hover:shadow-md hover:shadow-brand-500/10">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="line-clamp-2 text-base font-semibold leading-tight tracking-tight">
                    {p.title}
                  </h3>
                  {p.is_free ? (
                    <Badge variant="success">Free</Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <Lock className="h-3 w-3" />
                      Pro
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="outline" className="text-[10px]">
                      <Tag className="h-2.5 w-2.5 opacity-60" />
                      {t}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {p.estimated_minutes} min
                  </span>
                  <Badge
                    variant={
                      p.difficulty === 'easy'
                        ? 'success'
                        : p.difficulty === 'medium'
                          ? 'warning'
                          : 'destructive'
                    }
                  >
                    {p.difficulty}
                  </Badge>
                </div>

                <div
                  className={cn(
                    'flex items-center gap-1 text-xs font-medium text-brand-500',
                    'translate-x-0 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100',
                  )}
                >
                  Open <ChevronRight className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
