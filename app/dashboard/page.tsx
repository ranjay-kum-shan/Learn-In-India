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
    <div className="container space-y-12 py-12 md:py-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-slate-200 pb-8">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-brand-500">
            {greeting()}{user?.email ? `, ${user.user_metadata?.full_name ?? user.email.split('@')[0]}` : ''}.
          </h1>
          <p className="mt-4 text-lg text-slate-600 font-serif leading-relaxed">
            Welcome to your academic dashboard. Track your progress, review submissions, and continue your mastery journey.
          </p>
        </div>
        {nextProblem ? (
          <Button asChild size="lg" className="bg-brand-500 hover:bg-brand-500/90 text-white font-sans text-base shadow-sm">
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
        <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgba(10,15,28,0.02)] ring-1 ring-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
            <CardTitle className="font-display text-xl text-slate-900">Recent submissions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recent.length === 0 ? (
              <div className="p-6">
                <EmptyRecent allProblems={allProblems} />
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recent.map((s) => {
                  const problem = (s as unknown as { problem?: { slug: string; title: string; difficulty: 'easy'|'medium'|'hard' } }).problem
                  if (!problem) return null
                  return (
                    <Link
                      key={s.id}
                      href={`/problems/${problem.slug}`}
                      className="group flex items-center justify-between gap-4 p-6 transition-colors hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="truncate font-sans font-semibold text-slate-900 group-hover:text-brand-500 transition-colors">
                            {problem.title}
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              problem.difficulty === 'easy'
                                ? 'bg-green-50 text-green-600 border-none font-sans text-[10px] font-bold uppercase tracking-wider'
                                : problem.difficulty === 'medium'
                                  ? 'bg-amber-50 text-amber-600 border-none font-sans text-[10px] font-bold uppercase tracking-wider'
                                  : 'bg-red-50 text-red-600 border-none font-sans text-[10px] font-bold uppercase tracking-wider'
                            }
                          >
                            {problem.difficulty}
                          </Badge>
                        </div>
                        <div className="mt-1 text-xs font-sans text-slate-500">
                          {formatRelativeTime(s.created_at)}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {s.overall_score != null ? (
                          <div className="text-right">
                            <div className="text-sm font-sans font-bold text-slate-900">{s.overall_score}/100</div>
                            <div className="text-xs font-sans text-slate-500 capitalize">
                              {s.status}
                            </div>
                          </div>
                        ) : (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-sans capitalize text-xs">
                            {s.status}
                          </Badge>
                        )}
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weak areas */}
        <Card className="border-none shadow-[0_8px_30px_rgba(10,15,28,0.02)] ring-1 ring-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
            <CardTitle className="font-display text-xl text-slate-900">Weak areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {weakAreas.length === 0 ? (
              <p className="text-sm text-slate-600 font-sans leading-relaxed">
                Submit a few designs and we&apos;ll surface the rubric categories you&apos;re
                weakest in. Drill them next.
              </p>
            ) : (
              weakAreas.map((w) => (
                <div key={w.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-sans">
                    <span className="font-semibold text-slate-700 capitalize">
                      {w.category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      avg {w.avg_score.toFixed(1)} / 3
                    </span>
                  </div>
                  {/* Note: since indicatorClassName might not be natively supported on all Progress components, we will use a workaround if needed, but it works correctly if standard shadcn with tailwind classes. */}
                  <Progress value={(w.avg_score / 3) * 100} className="h-2 bg-slate-100 [&>div]:bg-brand-600" />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity heatmap */}
      <Card className="border-none shadow-[0_8px_30px_rgba(10,15,28,0.02)] ring-1 ring-slate-200 bg-white">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <CardTitle className="font-display text-xl text-slate-900">Activity</CardTitle>
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
    <Card className="border-none shadow-[0_4px_20px_rgba(10,15,28,0.03)] ring-1 ring-slate-200 bg-white hover:shadow-md transition-shadow">
      <CardContent className="space-y-2 p-6">
        <div className="flex items-center justify-between">
          <div className="text-xs font-sans font-bold uppercase tracking-wider text-slate-500">
            {label}
          </div>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
            {icon}
          </span>
        </div>
        <div className="font-display text-4xl font-bold text-slate-900 tracking-tight">{value}</div>
        <div className="text-xs font-sans font-medium text-slate-500">{sub}</div>
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
      <p className="text-sm text-slate-600 font-sans leading-relaxed">
        Nothing yet. Pick a free problem and submit your first design — even 30% on the
        first attempt teaches you more than reading 3 articles.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {free.map((p) => (
          <Link
            key={p.slug}
            href={`/problems/${p.slug}`}
            className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-white hover:border-brand-300 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-sans font-semibold text-slate-900 truncate mr-2">{p.title}</span>
              <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-sans text-[10px] font-bold uppercase tracking-wider shrink-0">Free</Badge>
            </div>
            <div className="mt-2 text-xs font-sans text-slate-500">
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
              ? '#F1F5F9' // slate-100
              : `hsla(235, 66%, 30%, ${0.2 + 0.8 * intensity})` // brand-500 with varying alpha
          return (
            <div
              key={c.date}
              title={`${c.date}: ${c.count} submission${c.count === 1 ? '' : 's'}`}
              className="h-3.5 w-3.5 rounded-sm"
              style={{ backgroundColor: bg }}
            />
          )
        })}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs font-sans font-medium text-slate-500">
        Less
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((v) => (
          <span
            key={v}
            className="h-3.5 w-3.5 rounded-sm"
            style={{ backgroundColor: `hsla(235, 66%, 30%, ${v})` }}
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
