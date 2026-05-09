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
    <div className="container space-y-12 py-12 md:py-16 text-foreground min-h-screen">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-[#191A1F] pb-8">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-white">
            {greeting()}{user?.email ? `, ${user.user_metadata?.full_name ?? user.email.split('@')[0]}` : ''}.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground font-sans leading-relaxed">
            Welcome to your academic dashboard. Track your progress, review submissions, and continue your mastery journey.
          </p>
        </div>
        {nextProblem ? (
          <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-onPrimary font-display tracking-wide text-base rounded-md">
            <Link href={`/problems/${nextProblem.slug}`}>
              <Sparkles className="h-4 w-4 mr-2" />
              Practice next: {nextProblem.title}
            </Link>
          </Button>
        ) : null}
      </div>

      {/* Stats hero */}
      <div className="grid gap-4 md:grid-cols-4">
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

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent submissions */}
        <Card className="lg:col-span-2 border-[#191A1F] bg-[#050505] rounded-lg">
          <CardHeader className="border-b border-[#191A1F] bg-[#0a0a0a] pb-4 rounded-t-lg">
            <CardTitle className="font-display text-xl text-white tracking-tight">Recent submissions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recent.length === 0 ? (
              <div className="p-6">
                <EmptyRecent allProblems={allProblems} />
              </div>
            ) : (
              <div className="divide-y divide-[#191A1F]">
                {recent.map((s) => {
                  const problem = (s as unknown as { problem?: { slug: string; title: string; difficulty: 'easy'|'medium'|'hard' } }).problem
                  if (!problem) return null
                  return (
                    <Link
                      key={s.id}
                      href={`/problems/${problem.slug}`}
                      className="group flex items-center justify-between gap-4 p-6 transition-colors hover:bg-[#0a0a0a]"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="truncate font-display text-lg font-bold text-white group-hover:text-brand-primary transition-colors tracking-tight">
                            {problem.title}
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              problem.difficulty === 'easy'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-display text-[10px] font-bold uppercase tracking-widest rounded'
                                : problem.difficulty === 'medium'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 font-display text-[10px] font-bold uppercase tracking-widest rounded'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20 font-display text-[10px] font-bold uppercase tracking-widest rounded'
                            }
                          >
                            {problem.difficulty}
                          </Badge>
                        </div>
                        <div className="mt-2 text-xs font-sans text-muted-foreground">
                          {formatRelativeTime(s.created_at)}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {s.overall_score != null ? (
                          <div className="text-right">
                            <div className="text-lg font-display font-bold text-white tracking-tighter">{s.overall_score}/100</div>
                            <div className="text-xs font-sans text-muted-foreground capitalize mt-1">
                              {s.status}
                            </div>
                          </div>
                        ) : (
                          <Badge variant="secondary" className="bg-[#191A1F] text-muted-foreground border-none font-sans capitalize text-xs">
                            {s.status}
                          </Badge>
                        )}
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brand-primary transition-colors" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weak areas */}
        <Card className="border-[#191A1F] bg-[#050505] rounded-lg">
          <CardHeader className="border-b border-[#191A1F] bg-[#0a0a0a] pb-4 rounded-t-lg">
            <CardTitle className="font-display text-xl text-white tracking-tight">Weak areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {weakAreas.length === 0 ? (
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                Submit a few designs and we&apos;ll surface the rubric categories you&apos;re
                weakest in. Drill them next.
              </p>
            ) : (
              weakAreas.map((w) => (
                <div key={w.category} className="space-y-3">
                  <div className="flex items-center justify-between text-sm font-sans">
                    <span className="font-medium text-white capitalize tracking-wide">
                      {w.category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-brand-primary font-bold tracking-widest">
                      avg {w.avg_score.toFixed(1)} / 3
                    </span>
                  </div>
                  <Progress value={(w.avg_score / 3) * 100} className="h-1.5 bg-[#191A1F] [&>div]:bg-brand-primary" />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity heatmap */}
      <Card className="border-[#191A1F] bg-[#050505] rounded-lg">
        <CardHeader className="border-b border-[#191A1F] bg-[#0a0a0a] pb-4 rounded-t-lg">
          <CardTitle className="font-display text-xl text-white tracking-tight">Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
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
    <Card className="border-[#191A1F] bg-[#050505] hover:border-[#404040] transition-colors rounded-lg">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div className="text-xs font-display font-bold uppercase tracking-[0.1em] text-muted-foreground">
            {label}
          </div>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded border border-brand-primary/20 bg-brand-primary/10 text-brand-primary">
            {icon}
          </span>
        </div>
        <div className="font-display text-4xl font-bold text-white tracking-tighter">{value}</div>
        <div className="text-xs font-sans text-muted-foreground">{sub}</div>
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
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground font-sans leading-relaxed">
        Nothing yet. Pick a free problem and submit your first design — even 30% on the
        first attempt teaches you more than reading 3 articles.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {free.map((p) => (
          <Link
            key={p.slug}
            href={`/problems/${p.slug}`}
            className="rounded-lg border border-[#191A1F] bg-[#0a0a0a] p-5 transition-all hover:border-[#404040] hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-white tracking-tight truncate mr-2">{p.title}</span>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-display text-[10px] font-bold uppercase tracking-widest shrink-0 rounded">Free</Badge>
            </div>
            <div className="mt-3 text-xs font-sans text-muted-foreground">
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
      <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-max">
        {cells.map((c) => {
          const intensity = c.count / max
          const bg =
            c.count === 0
              ? '#191A1F' // outline-variant color for empty
              : `hsla(258, 100%, 87%, ${0.2 + 0.8 * intensity})` // Flash Lavender with varying alpha
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
      <div className="mt-6 flex items-center gap-2 text-xs font-display font-bold tracking-widest uppercase text-muted-foreground">
        Less
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((v) => (
          <span
            key={v}
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: `hsla(258, 100%, 87%, ${v})` }}
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
