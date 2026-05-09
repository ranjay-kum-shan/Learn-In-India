import Link from 'next/link'
import {
  Trophy,
  Target,
  Flame,
  Activity,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { fetchProblems } from '@/lib/data/problems'
import { isSupabaseConfigured } from '@/lib/env'
import { getUser } from '@/lib/supabase/server'
import { getUserDashboard } from '@/lib/db/queries'
import { formatRelativeTime } from '@/lib/utils'
import { AnimatedStatCard } from '@/components/app/animated-stat'
import {
  Reveal,
  Stagger,
  StaggerItem,
  HoverLift,
} from '@/components/marketing/motion'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const allProblems = await fetchProblems()

  let user: Awaited<ReturnType<typeof getUser>> = null
  let dashboard: Awaited<ReturnType<typeof getUserDashboard>> | null = null

  if (isSupabaseConfigured) {
    user = await getUser()
    if (user) {
      dashboard = await getUserDashboard(user.id)
    }
  }

  const totals = dashboard?.ok ? dashboard.value.totals : { attempted: 0, graded: 0, avg_score: 0 }
  const streak = dashboard?.ok ? dashboard.value.user.streak_days : 0
  const xp = dashboard?.ok ? dashboard.value.user.total_xp : 0
  const recent = dashboard?.ok ? dashboard.value.recent : []
  const weakAreas = dashboard?.ok ? dashboard.value.weakAreas : []

  const nextProblem = allProblems[Math.min(totals.attempted, allProblems.length - 1)]

  return (
    <div className="container min-h-screen space-y-12 py-12 text-foreground md:py-16">
      <Reveal>
        <div className="flex flex-col gap-6 border-b border-hairline pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-bold tracking-tight">
              {greeting()}
              {user?.email
                ? `, ${user.user_metadata?.full_name ?? user.email.split('@')[0]}`
                : ''}
              .
            </h1>
            <p className="mt-4 font-sans text-lg leading-relaxed text-muted-foreground">
              Track your progress, review submissions, and continue your mastery journey.
            </p>
          </div>
          {nextProblem ? (
            <Button
              asChild
              size="lg"
              className="rounded-md font-display text-base tracking-wide"
            >
              <Link href={`/problems/${nextProblem.slug}`}>
                <Sparkles className="mr-2 h-4 w-4" />
                Practice next: {nextProblem.title}
              </Link>
            </Button>
          ) : null}
        </div>
      </Reveal>

      {/* Stats hero */}
      <div className="grid gap-4 md:grid-cols-4">
        <AnimatedStatCard
          icon={<Target className="h-5 w-5" />}
          label="Attempted"
          value={totals.attempted}
          sub={`${Math.max(0, allProblems.length - totals.attempted)} to go`}
          delay={0}
        />
        <AnimatedStatCard
          icon={<Trophy className="h-5 w-5" />}
          label="Avg score"
          value={totals.avg_score}
          sub="across graded submissions"
          delay={0.05}
        />
        <AnimatedStatCard
          icon={<Flame className="h-5 w-5" />}
          label="Streak"
          value={streak}
          sub={`day${streak === 1 ? '' : 's'}`}
          delay={0.1}
        />
        <AnimatedStatCard
          icon={<Activity className="h-5 w-5" />}
          label="XP"
          value={xp}
          sub="lifetime"
          delay={0.15}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent submissions */}
        <Reveal className="lg:col-span-2">
          <Card className="h-full rounded-lg border-hairline surface-3">
            <CardHeader className="rounded-t-lg border-b border-hairline surface-2 pb-4">
              <CardTitle className="font-display text-xl tracking-tight">
                Recent submissions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recent.length === 0 ? (
                <div className="p-6">
                  <EmptyRecent allProblems={allProblems} />
                </div>
              ) : (
                <ul className="divide-y divide-hairline">
                  {recent.map((s) => {
                    const problem = (
                      s as unknown as {
                        problem?: {
                          slug: string
                          title: string
                          difficulty: 'easy' | 'medium' | 'hard'
                        }
                      }
                    ).problem
                    if (!problem) return null
                    return (
                      <li key={s.id}>
                        <Link
                          href={`/problems/${problem.slug}`}
                          className="group flex items-center justify-between gap-4 p-6 transition-colors hover:bg-muted/40"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              <span className="truncate font-display text-lg font-bold tracking-tight transition-colors group-hover:text-primary">
                                {problem.title}
                              </span>
                              <Badge
                                variant="outline"
                                className={
                                  problem.difficulty === 'easy'
                                    ? 'rounded border-emerald-500/20 bg-emerald-500/10 font-display text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400'
                                    : problem.difficulty === 'medium'
                                      ? 'rounded border-amber-500/20 bg-amber-500/10 font-display text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400'
                                      : 'rounded border-rose-500/20 bg-rose-500/10 font-display text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400'
                                }
                              >
                                {problem.difficulty}
                              </Badge>
                            </div>
                            <div className="mt-2 font-sans text-xs text-muted-foreground">
                              {formatRelativeTime(s.created_at)}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {s.overall_score != null ? (
                              <div className="text-right">
                                <div className="font-display text-lg font-bold tracking-tighter">
                                  {s.overall_score}/100
                                </div>
                                <div className="mt-1 font-sans text-xs capitalize text-muted-foreground">
                                  {s.status}
                                </div>
                              </div>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="border-none bg-muted font-sans text-xs capitalize text-muted-foreground"
                              >
                                {s.status}
                              </Badge>
                            )}
                            <ArrowRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </Reveal>

        {/* Weak areas */}
        <Reveal delay={0.1}>
          <Card className="h-full rounded-lg border-hairline surface-3">
            <CardHeader className="rounded-t-lg border-b border-hairline surface-2 pb-4">
              <CardTitle className="font-display text-xl tracking-tight">
                Weak areas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {weakAreas.length === 0 ? (
                <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                  Submit a few designs and we&apos;ll surface the rubric categories
                  you&apos;re weakest in. Drill them next.
                </p>
              ) : (
                weakAreas.map((w) => (
                  <div key={w.category} className="space-y-3">
                    <div className="flex items-center justify-between font-sans text-sm">
                      <span className="font-medium capitalize tracking-wide">
                        {w.category.replace(/_/g, ' ')}
                      </span>
                      <span className="font-bold tracking-widest text-primary">
                        avg {w.avg_score.toFixed(1)} / 3
                      </span>
                    </div>
                    <Progress
                      value={(w.avg_score / 3) * 100}
                      className="h-1.5 bg-muted [&>div]:bg-primary"
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </Reveal>
      </div>

      {/* Activity heatmap */}
      <Reveal delay={0.15}>
        <Card className="rounded-lg border-hairline surface-3">
          <CardHeader className="rounded-t-lg border-b border-hairline surface-2 pb-4">
            <CardTitle className="font-display text-xl tracking-tight">Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ActivityHeatmap data={dashboard?.ok ? dashboard.value.activity : []} />
          </CardContent>
        </Card>
      </Reveal>
    </div>
  )
}

function EmptyRecent({
  allProblems,
}: {
  allProblems: Awaited<ReturnType<typeof fetchProblems>>
}) {
  const free = allProblems.filter((p) => p.is_free).slice(0, 3)
  return (
    <div className="space-y-6">
      <p className="font-sans text-sm leading-relaxed text-muted-foreground">
        Nothing yet. Pick a free problem and submit your first design — even 30% on the
        first attempt teaches you more than reading 3 articles.
      </p>
      <Stagger delay={0.06} className="grid gap-4 sm:grid-cols-2">
        {free.map((p) => (
          <StaggerItem key={p.slug}>
            <HoverLift>
              <Link
                href={`/problems/${p.slug}`}
                className="block rounded-lg border border-hairline surface-2 p-5 transition-colors hover:border-primary/30"
              >
                <div className="flex items-center justify-between">
                  <span className="mr-2 truncate font-display font-bold tracking-tight">
                    {p.title}
                  </span>
                  <Badge className="shrink-0 rounded border-emerald-500/20 bg-emerald-500/10 font-display text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    Free
                  </Badge>
                </div>
                <div className="mt-3 font-sans text-xs text-muted-foreground">
                  {p.estimated_minutes} min · {p.difficulty}
                </div>
              </Link>
            </HoverLift>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}

function ActivityHeatmap({ data }: { data: { date: string; count: number }[] }) {
  const counts = new Map(data.map((d) => [d.date, d.count]))
  const today = new Date()
  const cells: { date: string; count: number }[] = []
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    cells.push({ date: iso, count: counts.get(iso) ?? 0 })
  }
  const max = Math.max(1, ...cells.map((c) => c.count))
  return (
    <div className="overflow-x-auto">
      <div className="grid w-max grid-flow-col grid-rows-7 gap-1.5">
        {cells.map((c) => {
          const intensity = c.count / max
          return (
            <div
              key={c.date}
              title={`${c.date}: ${c.count} submission${c.count === 1 ? '' : 's'}`}
              className="h-3 w-3 rounded-sm"
              style={{
                backgroundColor:
                  c.count === 0
                    ? 'hsl(var(--muted))'
                    : `hsl(var(--primary) / ${(0.2 + 0.8 * intensity).toFixed(2)})`,
              }}
            />
          )
        })}
      </div>
      <div className="mt-6 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Less
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((v) => (
          <span
            key={v}
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: `hsl(var(--primary) / ${v})` }}
          />
        ))}
        More
      </div>
    </div>
  )
}

function greeting() {
  const h = new Date().getHours()
  if (h < 5) return 'Up late'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
