'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { Sparkles, Loader2, FileText, RotateCcw, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/toast'
import { useCanvasStore } from './canvas-store'
import type { GradingResult } from '@/lib/grading/schemas'

// Canvas is purely client-side
const DesignCanvas = dynamic(
  () => import('./design-canvas').then((m) => m.DesignCanvas),
  { ssr: false, loading: () => <CanvasSkeleton /> },
)

const SolutionViewer = dynamic(
  () => import('./solution-viewer').then((m) => m.SolutionViewer),
  { ssr: false, loading: () => null },
)

interface Props {
  slug: string
  title: string
  problemId?: string
  rubricId?: string
  brief: string
}

export function ProblemWorkbench({ slug, title: _title, problemId, rubricId, brief: _brief }: Props) {
  const [transcript, setTranscript] = React.useState('')
  const [grading, setGrading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [phase, setPhase] = React.useState<string>('')
  const [result, setResult] = React.useState<GradingResult | null>(null)
  const [showSolution, setShowSolution] = React.useState(false)

  const { toJSON, clear } = useCanvasStore()

  async function onSubmit() {
    const json = toJSON()
    if (json.nodes.length === 0) {
      toast({
        title: 'Empty design',
        description: 'Drop at least one component before submitting.',
        variant: 'destructive',
      })
      return
    }
    if (transcript.trim().length < 30) {
      toast({
        title: 'Add a writeup',
        description:
          'Write a few sentences about your design choices — capacity, trade-offs, failure modes. The grader reads this alongside the canvas.',
        variant: 'destructive',
      })
      return
    }
    setGrading(true)
    setProgress(5)
    setPhase('queued')
    setResult(null)
    try {
      const res = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemSlug: slug,
          problemId,
          rubricId,
          designJson: json,
          transcript,
        }),
      })
      if (!res.ok || !res.body) {
        const text = await res.text()
        throw new Error(text || `Grading failed (${res.status})`)
      }
      // Stream SSE events
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split('\n\n')
        buffer = events.pop() ?? ''
        for (const ev of events) {
          if (!ev.trim()) continue
          const lines = ev.split('\n')
          const dataLine = lines.find((l) => l.startsWith('data: '))
          if (!dataLine) continue
          try {
            const data = JSON.parse(dataLine.slice(6))
            if (data.phase) setPhase(data.phase)
            if (typeof data.progress === 'number') setProgress(data.progress)
            if (data.result) setResult(data.result as GradingResult)
            if (data.error) {
              toast({
                title: 'Grading failed',
                description: data.error,
                variant: 'destructive',
              })
            }
          } catch {
            // ignore parse errors
          }
        }
      }
      setProgress(100)
      setPhase('done')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast({ title: 'Could not grade', description: message, variant: 'destructive' })
    } finally {
      setGrading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 p-4">
          <DesignCanvas />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-1.5">
            <Label htmlFor="transcript" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Your design writeup
            </Label>
            <p className="text-xs text-muted-foreground">
              Walk through your design like you would in an interview. State capacity,
              trade-offs, and failure modes. The grader reads this alongside the canvas.
            </p>
            <Textarea
              id="transcript"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={`I assumed ~X writes/sec, ~Y reads/sec.\nReads go through Redis (cache hit ~95%); on miss, fall back to KV.\nAnalytics is async via Kafka so it doesn't block the redirect.\n...`}
              rows={8}
              className="font-mono text-xs"
            />
          </div>

          <Separator />

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-xs text-muted-foreground">
              {grading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {labelFor(phase)} — {progress}%
                </span>
              ) : (
                'Submitting calls Claude with the rubric. Typical latency: 15–30s.'
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm('Clear the canvas?')) {
                    clear()
                    setTranscript('')
                    setResult(null)
                  }
                }}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button variant="gradient" onClick={onSubmit} disabled={grading}>
                {grading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Submit & grade
              </Button>
            </div>
          </div>

          {grading || progress > 0 ? <Progress value={progress} /> : null}
        </CardContent>
      </Card>

      {result ? <FeedbackPanel result={result} /> : null}

      {result ? (
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <div className="font-semibold">Reference solution</div>
              <p className="text-sm text-muted-foreground">
                Compare your design with the canonical answer.
              </p>
            </div>
            <Button variant="outline" onClick={() => setShowSolution((v) => !v)}>
              <Eye className="h-4 w-4" />
              {showSolution ? 'Hide' : 'Show'} solution
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {showSolution ? <SolutionViewer slug={slug} /> : null}
    </div>
  )
}

function CanvasSkeleton() {
  return (
    <div className="grid h-[640px] grid-cols-[180px_minmax(0,1fr)_280px] gap-3">
      <div className="rounded-xl border border-border/60 bg-card/30" />
      <div className="rounded-xl border border-border/60 bg-card/30 bg-dotted" />
      <div className="rounded-xl border border-border/60 bg-card/30" />
    </div>
  )
}

function labelFor(p: string) {
  switch (p) {
    case 'queued':
      return 'Queued'
    case 'thinking':
      return 'Reasoning about your design'
    case 'scoring':
      return 'Scoring against rubric'
    case 'done':
      return 'Done'
    default:
      return 'Working'
  }
}

function FeedbackPanel({ result }: { result: GradingResult }) {
  const score = result.overall.score
  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Overall
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-4xl font-semibold tracking-tight">
                {score}
                <span className="text-lg text-muted-foreground"> / 100</span>
              </span>
              <Badge
                variant={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'destructive'}
              >
                {score >= 80 ? 'Strong' : score >= 60 ? 'Solid' : 'Needs work'}
              </Badge>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {result.overall.summary}
            </p>
          </div>
          <Progress value={score} className="w-full md:w-72" />
        </div>

        <Separator />

        <div className="grid gap-3 md:grid-cols-2">
          {result.criteria.map((c) => (
            <CriterionCard key={c.criterion_id} c={c} />
          ))}
        </div>

        {result.strong_areas.length > 0 || result.missing_concepts.length > 0 ? (
          <>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2">
              {result.strong_areas.length > 0 ? (
                <SignalList
                  title="Strong areas"
                  items={result.strong_areas}
                  variant="success"
                />
              ) : null}
              {result.missing_concepts.length > 0 ? (
                <SignalList
                  title="Concepts to drill"
                  items={result.missing_concepts}
                  variant="warning"
                />
              ) : null}
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

function CriterionCard({
  c,
}: {
  c: GradingResult['criteria'][number]
}) {
  const tone =
    c.score >= 3
      ? 'border-emerald-500/30 bg-emerald-500/5'
      : c.score === 2
        ? 'border-sky-500/30 bg-sky-500/5'
        : c.score === 1
          ? 'border-amber-500/30 bg-amber-500/5'
          : 'border-rose-500/30 bg-rose-500/5'
  return (
    <div className={`rounded-lg border p-4 ${tone}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm font-medium">{c.criterion_id}</div>
        <Badge variant={c.score >= 2 ? 'success' : c.score === 1 ? 'warning' : 'destructive'}>
          {c.score} / 3
        </Badge>
      </div>
      {c.evidence ? (
        <div className="mt-2 text-xs text-muted-foreground">
          <span className="font-semibold">Evidence:</span> {c.evidence}
        </div>
      ) : null}
      {c.suggestion ? (
        <div className="mt-2 text-xs text-foreground/80">
          <span className="font-semibold">Suggestion:</span> {c.suggestion}
        </div>
      ) : null}
    </div>
  )
}

function SignalList({
  title,
  items,
  variant,
}: {
  title: string
  items: string[]
  variant: 'success' | 'warning'
}) {
  return (
    <div>
      <div
        className={`mb-2 text-xs font-semibold ${
          variant === 'success' ? 'text-emerald-500' : 'text-amber-500'
        }`}
      >
        {title}
      </div>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {items.map((item, i) => (
          <li key={i} className="text-foreground/80">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
