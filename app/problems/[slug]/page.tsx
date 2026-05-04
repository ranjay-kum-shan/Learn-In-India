import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Clock, Lock, Tag, BookOpen } from 'lucide-react'
import { fetchProblem } from '@/lib/data/problems'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Markdown } from '@/components/markdown'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProblemWorkbench } from '@/components/canvas/problem-workbench'
import { getUser } from '@/lib/supabase/server'
import { isSupabaseConfigured, env } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const p = await fetchProblem(slug)
  return { title: p?.title ?? 'Problem' }
}

export default async function ProblemDetailPage({ params }: Props) {
  const { slug } = await params
  const problem = await fetchProblem(slug)
  if (!problem) notFound()

  // Paywall gate: non-free problems require an authed pro user.
  let plan: 'free' | 'pro' | 'student' | 'annual' = 'free'
  let userEmail: string | null = null
  if (isSupabaseConfigured) {
    const u = await getUser()
    if (u) {
      userEmail = u.email ?? null
      try {
        const sb = await createClient()
        const { data } = await sb.from('users').select('plan').eq('id', u.id).maybeSingle()
        plan = (data?.plan as typeof plan) ?? 'free'
      } catch {
        plan = 'free'
      }
    }
  }
  const bypass = env.NEXT_PUBLIC_BYPASS_PAYWALL
  const locked = !problem.is_free && plan === 'free' && !bypass

  if (locked && isSupabaseConfigured && !userEmail) {
    redirect(`/login?next=/problems/${slug}`)
  }

  return (
    <div className="container py-6">
      <header className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/problems" className="hover:text-foreground">
              Problems
            </Link>
            <span>/</span>
            <span>{problem.slug}</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">
            {problem.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
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
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {problem.estimated_minutes} min
            </span>
            {problem.tags.map((t) => (
              <Badge key={t} variant="outline" className="text-[10px]">
                <Tag className="h-2.5 w-2.5 opacity-60" />
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      {locked ? (
        <PaywallGate />
      ) : (
        <Tabs defaultValue="brief" className="w-full">
          <TabsList>
            <TabsTrigger value="brief">Brief</TabsTrigger>
            <TabsTrigger value="canvas">Canvas + Submit</TabsTrigger>
            <TabsTrigger value="rubric">Rubric</TabsTrigger>
          </TabsList>

          <TabsContent value="brief" className="space-y-4">
            <Card>
              <CardContent className="p-7">
                <Markdown>{problem.body}</Markdown>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="canvas">
            <ProblemWorkbench
              slug={problem.slug}
              title={problem.title}
              problemId={problem.problem_id}
              rubricId={problem.rubric_id}
              brief={problem.body}
            />
          </TabsContent>

          <TabsContent value="rubric">
            <Card>
              <CardContent className="space-y-4 p-7">
                <div className="text-sm text-muted-foreground">
                  How your design will be scored. Each criterion is weighted; the AI
                  grader returns 0-3 per criterion with cited evidence and named gaps.
                </div>
                <div className="space-y-3">
                  {problem.rubric.criteria.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-lg border border-border/60 bg-card/40 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{c.title}</div>
                          <div className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
                            {c.category}
                          </div>
                        </div>
                        <Badge variant="default">weight {c.weight}</Badge>
                      </div>
                      {c.signals.length > 0 ? (
                        <div className="mt-3 space-y-1 text-sm">
                          <div className="text-xs font-semibold text-emerald-500">
                            Signals
                          </div>
                          <ul className="list-disc pl-5 text-foreground/80">
                            {c.signals.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {c.anti_signals.length > 0 ? (
                        <div className="mt-3 space-y-1 text-sm">
                          <div className="text-xs font-semibold text-rose-500">
                            Anti-signals
                          </div>
                          <ul className="list-disc pl-5 text-foreground/70">
                            {c.anti_signals.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

function PaywallGate() {
  return (
    <Card className="overflow-hidden border-brand-500/30 bg-gradient-to-br from-brand-500/5 to-transparent">
      <CardContent className="space-y-4 p-10 text-center">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
          <Lock className="h-5 w-5" />
        </div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          This problem is part of Pro
        </h2>
        <p className="mx-auto max-w-md text-muted-foreground">
          Two problems are free forever. Upgrade to unlock all 10 problems, unlimited AI
          grading, and reference solutions.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button asChild variant="gradient" size="lg">
            <Link href="/pricing">See plans</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/problems">
              <BookOpen className="h-4 w-4" />
              Browse free problems
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
