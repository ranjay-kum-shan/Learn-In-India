'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Markdown } from '@/components/markdown'
import { Skeleton } from '@/components/ui/skeleton'
import type { DesignJSON } from '@/lib/content/schemas'
import { SHAPES } from './shape-defs'

interface SolutionResp {
  body: string
  design: DesignJSON | null
}

export function SolutionViewer({ slug }: { slug: string }) {
  const [data, setData] = React.useState<SolutionResp | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let mounted = true
    fetch(`/api/solutions/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        if (mounted) {
          setData(d)
          setLoading(false)
        }
      })
      .catch((e) => {
        if (mounted) {
          setError(typeof e === 'number' ? `HTTP ${e}` : 'Failed to load')
          setLoading(false)
        }
      })
    return () => {
      mounted = false
    }
  }, [slug])

  if (loading) {
    return (
      <Card>
        <CardContent className="space-y-3 p-6">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    )
  }
  if (error || !data) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Could not load reference solution{error ? ` (${error})` : ''}.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <Tabs defaultValue="narrative">
          <TabsList>
            <TabsTrigger value="narrative">Narrative</TabsTrigger>
            <TabsTrigger value="diagram" disabled={!data.design}>
              Diagram
            </TabsTrigger>
          </TabsList>
          <TabsContent value="narrative">
            <Markdown>{data.body}</Markdown>
          </TabsContent>
          <TabsContent value="diagram">
            {data.design ? <ReadOnlyDiagram design={data.design} /> : null}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function ReadOnlyDiagram({ design }: { design: DesignJSON }) {
  // bounding box
  const all = [...design.nodes.map((n) => n.position), ...design.notes.map((n) => n.position)]
  const minX = Math.min(0, ...all.map((p) => p.x))
  const minY = Math.min(0, ...all.map((p) => p.y))
  const maxX = Math.max(800, ...all.map((p) => p.x + 180))
  const maxY = Math.max(500, ...all.map((p) => p.y + 100))
  const width = maxX - minX + 40
  const height = maxY - minY + 40

  const nodeMap = new Map(design.nodes.map((n) => [n.id, n]))

  return (
    <div className="overflow-auto rounded-xl border border-border/60 bg-card/40 bg-dotted p-4">
      <div className="relative" style={{ width, height }}>
        <svg className="pointer-events-none absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker
              id="ref_arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(199 89% 55%)" />
            </marker>
          </defs>
          {design.edges.map((e) => {
            const a = nodeMap.get(e.from)
            const b = nodeMap.get(e.to)
            if (!a || !b) return null
            const ax = a.position.x - minX + 20 + 85
            const ay = a.position.y - minY + 20 + 39
            const bx = b.position.x - minX + 20 + 85
            const by = b.position.y - minY + 20 + 39
            const mx = (ax + bx) / 2
            return (
              <g key={e.id}>
                <path
                  d={`M ${ax} ${ay} C ${mx} ${ay} ${mx} ${by} ${bx} ${by}`}
                  fill="none"
                  stroke="hsl(199 89% 55%)"
                  strokeOpacity={0.7}
                  strokeWidth={1.5}
                  markerEnd="url(#ref_arrow)"
                />
                {e.label ? (
                  <foreignObject x={(ax + bx) / 2 - 60} y={(ay + by) / 2 - 12} width={120} height={24}>
                    <div className="text-center">
                      <span className="rounded bg-background/80 px-1.5 py-0.5 text-[10px] text-foreground/80 backdrop-blur">
                        {e.label}
                      </span>
                    </div>
                  </foreignObject>
                ) : null}
              </g>
            )
          })}
        </svg>
        {design.nodes.map((n) => {
          const def = SHAPES[n.type]
          const Icon = def.icon
          const name = (n.props.name as string) ?? def.label
          return (
            <div
              key={n.id}
              className="absolute flex items-center gap-2 rounded-xl border-2 p-2.5"
              style={{
                left: n.position.x - minX + 20,
                top: n.position.y - minY + 20,
                width: 170,
                height: 78,
                background: `hsl(${def.accent} / 0.08)`,
                borderColor: `hsl(${def.accent} / 0.55)`,
              }}
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ background: `hsl(${def.accent} / 0.18)`, color: `hsl(${def.accent})` }}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {Object.entries(n.props)
                    .filter(([k]) => k !== 'name')
                    .slice(0, 2)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(' · ')}
                </div>
              </div>
            </div>
          )
        })}
        {design.notes.map((nt) => (
          <div
            key={nt.id}
            className="absolute max-w-[220px] rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs leading-snug text-foreground/90"
            style={{ left: nt.position.x - minX + 20, top: nt.position.y - minY + 20 }}
          >
            {nt.text}
          </div>
        ))}
      </div>
    </div>
  )
}
