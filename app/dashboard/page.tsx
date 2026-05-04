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
    <div className="container space-y-8 py-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {greeting()}{user?.email ? `, ${user.user_metadata?.full_name ?? user.email.split('@')[0]}` : ''}.
          </h1>
          <p className="text-muted-foreground">
            Today's drill is the fastest path to your next offer. Pick a problem, design,
            ship.
          </p>
        </div>
        {nextProblem ? (
          <Button asChild variant="gradient" size="lg">
            <Link href={`/problems/${nextProblem.slug}`}>
              <Sparkles className="h-4 w-4" />
              Practice next: {nextProblem.title}
            </Link>
          </Button>
        ) : null}
      </div>

      {/* Stats hero */}
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard
          icon={<Target className="h-5 w-5" />}
          label="Attempted"
          value={totals.attempted}
          sub={`${allProblems.length - totals.attempted} to go`}
        />
        <StatCard
          icon={<Trophy className="h-5 w-5" />}
          label="Avg score"
          value={`${totals.avg_score}`}
          sub="across graded submissions"
        />
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label="Streak"
          value={streak}
          sub={`day${streak === 1 ? '' : 's'}`}
        />
        <StatCard
          icon={<Activity className="h-5 w-5" />}
          label="XP"
          value={xp}
          sub="lifetime"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent submissions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <EmptyRecent allProblems={allProblems} />
            ) : (
              <div className="divide-y divide-border/40">
                {recent.map((s) => {
                  const problem = (s as unknown as { problem?: { slug: string; title: string; difficulty: 'easy'|'medium'|'hard' } }).problem
                  if (!problem) return null
                  return (
                    <Link
                      key={s.id}
                      href={`/problems/${problem.slug}`}
                      className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-accent/30"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium">{problem.title}</span>
                          <Badge
                            variant={
                              problem.difficulty === 'easy'
                                ? 'success'
                                : problem.difficulty === 'medium'
                                  ? 'warning'
                                  : 'destructive'
                            }
                          >
                            {problem.difficulty}
                          </Badge>
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {formatRelativeTime(s.created_at)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {s.overall_score != null ? (
                          <div className="text-right">
                            <div className="text-sm font-semibold">{s.overall_score}/100</div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {s.status}
                            </div>
                          </div>
                        ) : (
                          <Badge variant="secondary" className="capitalize">
                            {s.status}
                          </Badge>
                        )}
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weak areas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weak areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weakAreas.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Submit a few designs and we'll surface the rubric categories you're
                weakest in. Drill them next.
              </p>
            ) : (
              weakAreas.map((w) => (
                <div key={w.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">
                      {w.category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      avg {w.avg_score.toFixed(1)} / 3
                    </span>
                  </div>
                  <Progress value={(w.avg_score / 3) * 100} />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity heatmap (lightweight) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityHeatmap data={dashboard?.ok ? dashboard.value.activity : []} />
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  sub: string
}) {
  return (
    <Card>
      <CardContent className="space-y-1.5 p-5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-brand-500/10 text-brand-500">
            {icon}
          </span>
        </div>
        <div className="font-display text-3xl font-semibold tracking-tight">{value}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </CardContent>
    </Card>
  )
}

function EmptyRecent({
  allProblems,
}: {
  allProblems: Awaited<ReturnType<typeof fetchProblems>>
}) {
  const free = allProblems.filter((p) => p.is_free).slice(0, 3)
  return (
    <div className="space-y-4 py-2">
      <p className="text-sm text-muted-foreground">
        Nothing yet. Pick a free problem and submit your first design — even 30% on the
        first attempt teaches you more than reading 3 articles.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {free.map((p) => (
          <Link
            key={p.slug}
            href={`/problems/${p.slug}`}
            className="rounded-lg border border-border/60 bg-card/40 p-3 transition-colors hover:border-brand-500/40"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{p.title}</span>
              <Badge variant="success">Free</Badge>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {p.estimated_minutes} min · {p.difficulty}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function ActivityHeatmap({ data }: { data: { date: string; count: number }[] }) {
  const counts = new Map(data.map((d) => [d.date, d.count]))
  const today = new Date()
  // 12 weeks
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
      <div className="grid grid-flow-col grid-rows-7 gap-1">
        {cells.map((c) => {
          const intensity = c.count / max
          const bg =
            c.count === 0
              ? 'hsl(var(--muted) / 0.4)'
              : `hsl(var(--primary) / ${0.2 + 0.7 * intensity})`
          return (
            <div
              key={c.date}
              title={`${c.date}: ${c.count} submission${c.count === 1 ? '' : 's'}`}
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: bg }}
            />
          )
        })}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        Less
        {[0.2, 0.4, 0.6, 0.8].map((v) => (
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
