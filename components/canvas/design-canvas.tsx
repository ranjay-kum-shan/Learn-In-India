'use client'

import * as React from 'react'
import { Trash2, ArrowRight, Plus } from 'lucide-react'
import { useCanvasStore } from './canvas-store'
import { SHAPES, SHAPE_ORDER, type ShapeType } from './shape-defs'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const NODE_W = 170
const NODE_H = 78

export function DesignCanvas() {
  const {
    nodes,
    edges,
    notes,
    selectedId,
    edgeDraftFrom,
    addNode,
    updateNodePosition,
    setSelected,
    addEdge,
    cancelEdge,
    startEdge,
    removeNode,
    removeEdge,
  } = useCanvasStore()

  const containerRef = React.useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = React.useState<{
    id: string
    offset: { x: number; y: number }
  } | null>(null)
  const [pointer, setPointer] = React.useState<{ x: number; y: number } | null>(null)

  const handleDropFromPalette = (type: ShapeType, e: React.DragEvent) => {
    e.preventDefault()
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - NODE_W / 2
    const y = e.clientY - rect.top - NODE_H / 2
    addNode(type, { x: Math.max(8, x), y: Math.max(8, y) })
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    setPointer({ x: px, y: py })
    if (dragging) {
      updateNodePosition(dragging.id, {
        x: Math.max(0, px - dragging.offset.x),
        y: Math.max(0, py - dragging.offset.y),
      })
    }
  }

  const onMouseUp = () => setDragging(null)

  const onCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelected(null)
      cancelEdge()
    }
  }

  const finishEdgeAt = (toId: string) => {
    if (edgeDraftFrom && edgeDraftFrom !== toId) {
      addEdge(edgeDraftFrom, toId)
    }
    cancelEdge()
  }

  return (
    <div className="grid grid-cols-[180px_minmax(0,1fr)_280px] gap-3 h-[640px]">
      {/* Palette */}
      <Palette onDragStart={() => undefined} />

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative overflow-auto rounded-xl border border-border/60 bg-card/40 bg-dotted"
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={() => setDragging(null)}
        onClick={onCanvasClick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const type = e.dataTransfer.getData('text/shape') as ShapeType
          if (!type) return
          handleDropFromPalette(type, e)
        }}
      >
        {/* edges */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="arrow"
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
          {edges.map((e) => {
            const a = nodes.find((n) => n.id === e.from)
            const b = nodes.find((n) => n.id === e.to)
            if (!a || !b) return null
            return (
              <EdgePath
                key={e.id}
                id={e.id}
                a={a.position}
                b={b.position}
                label={e.label}
                onRemove={() => removeEdge(e.id)}
              />
            )
          })}

          {edgeDraftFrom && pointer
            ? (() => {
                const from = nodes.find((n) => n.id === edgeDraftFrom)
                if (!from) return null
                return (
                  <line
                    x1={from.position.x + NODE_W / 2}
                    y1={from.position.y + NODE_H / 2}
                    x2={pointer.x}
                    y2={pointer.y}
                    stroke="hsl(199 89% 55%)"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                  />
                )
              })()
            : null}
        </svg>

        {/* nodes */}
        {nodes.map((n) => (
          <NodeShape
            key={n.id}
            id={n.id}
            type={n.type}
            x={n.position.x}
            y={n.position.y}
            props={n.props}
            selected={selectedId === n.id}
            onMouseDown={(e) => {
              e.stopPropagation()
              if (!containerRef.current) return
              const rect = containerRef.current.getBoundingClientRect()
              const ox = e.clientX - rect.left - n.position.x
              const oy = e.clientY - rect.top - n.position.y
              setSelected(n.id)
              setDragging({ id: n.id, offset: { x: ox, y: oy } })
            }}
            onClick={(e) => {
              e.stopPropagation()
              if (edgeDraftFrom) finishEdgeAt(n.id)
              else setSelected(n.id)
            }}
            onStartEdge={() => startEdge(n.id)}
            onRemove={() => removeNode(n.id)}
          />
        ))}

        {/* notes */}
        {notes.map((nt) => (
          <NoteShape
            key={nt.id}
            id={nt.id}
            x={nt.position.x}
            y={nt.position.y}
            text={nt.text}
            selected={selectedId === nt.id}
            onMouseDown={(e) => {
              e.stopPropagation()
              if (!containerRef.current) return
              const rect = containerRef.current.getBoundingClientRect()
              const ox = e.clientX - rect.left - nt.position.x
              const oy = e.clientY - rect.top - nt.position.y
              setSelected(nt.id)
              setDragging({ id: nt.id, offset: { x: ox, y: oy } })
            }}
            onClick={(e) => {
              e.stopPropagation()
              setSelected(nt.id)
            }}
            onRemove={() => removeNode(nt.id)}
          />
        ))}

        {nodes.length === 0 && notes.length === 0 ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center text-sm text-muted-foreground">
            <Plus className="mb-2 h-5 w-5" />
            Drag a component from the left panel onto the canvas to start designing.
          </div>
        ) : null}
      </div>

      {/* Inspector */}
      <Inspector />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  PALETTE                                   */
/* -------------------------------------------------------------------------- */

function Palette({ onDragStart }: { onDragStart: () => void }) {
  return (
    <aside className="overflow-auto rounded-xl border border-border/60 bg-card/40 p-3">
      <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Components
      </div>
      <div className="space-y-1.5">
        {SHAPE_ORDER.map((type) => {
          const def = SHAPES[type]
          const Icon = def.icon
          return (
            <div
              key={type}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/shape', type)
                onDragStart()
              }}
              title={def.description}
              className="group flex cursor-grab items-center gap-2 rounded-lg border border-border/40 bg-card p-2 text-sm transition-all hover:border-brand-500/30 hover:bg-card/80 active:cursor-grabbing"
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-md border"
                style={{
                  background: `hsl(${def.accent} / 0.15)`,
                  borderColor: `hsl(${def.accent} / 0.4)`,
                  color: `hsl(${def.accent})`,
                }}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="font-medium">{def.label}</span>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  SHAPE                                     */
/* -------------------------------------------------------------------------- */

function NodeShape({
  id,
  type,
  x,
  y,
  props,
  selected,
  onMouseDown,
  onClick,
  onStartEdge,
  onRemove,
}: {
  id: string
  type: ShapeType
  x: number
  y: number
  props: Record<string, unknown>
  selected: boolean
  onMouseDown: (e: React.MouseEvent) => void
  onClick: (e: React.MouseEvent) => void
  onStartEdge: () => void
  onRemove: () => void
}) {
  const def = SHAPES[type]
  const Icon = def.icon
  const name = (props.name as string) ?? def.label
  const sub = subtitleFor(type, props)

  return (
    <div
      className={cn(
        'absolute flex items-center gap-2 rounded-xl border-2 p-2.5 shadow-sm transition-shadow',
        selected ? 'shadow-lg shadow-brand-500/20 ring-2 ring-brand-500/40' : '',
      )}
      data-id={id}
      style={{
        left: x,
        top: y,
        width: NODE_W,
        height: NODE_H,
        background: `hsl(${def.accent} / 0.08)`,
        borderColor: `hsl(${def.accent} / 0.55)`,
      }}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ background: `hsl(${def.accent} / 0.18)`, color: `hsl(${def.accent})` }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">{name}</div>
        <div className="truncate text-xs text-muted-foreground">{sub}</div>
      </div>

      {/* edge handle */}
      <button
        title="Connect"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          onStartEdge()
        }}
        className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-background p-0.5 opacity-0 transition-opacity hover:opacity-100"
      >
        <ArrowRight className="h-3 w-3 text-brand-500" />
      </button>

      {selected ? (
        <button
          title="Delete"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute -right-2 -top-2 rounded-full border border-border bg-background p-0.5 text-rose-500"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      ) : null}
    </div>
  )
}

function NoteShape({
  id,
  x,
  y,
  text,
  selected,
  onMouseDown,
  onClick,
  onRemove,
}: {
  id: string
  x: number
  y: number
  text: string
  selected: boolean
  onMouseDown: (e: React.MouseEvent) => void
  onClick: (e: React.MouseEvent) => void
  onRemove: () => void
}) {
  return (
    <div
      className={cn(
        'absolute max-w-[220px] rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs leading-snug text-foreground/90',
        selected ? 'ring-2 ring-amber-500/50' : '',
      )}
      style={{ left: x, top: y }}
      data-id={id}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      {text}
      {selected ? (
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute -right-2 -top-2 rounded-full border border-border bg-background p-0.5 text-rose-500"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      ) : null}
    </div>
  )
}

function EdgePath({
  id: _id,
  a,
  b,
  label,
  onRemove,
}: {
  id: string
  a: { x: number; y: number }
  b: { x: number; y: number }
  label?: string
  onRemove: () => void
}) {
  const ax = a.x + NODE_W / 2
  const ay = a.y + NODE_H / 2
  const bx = b.x + NODE_W / 2
  const by = b.y + NODE_H / 2
  const mx = (ax + bx) / 2
  const my = (ay + by) / 2
  const path = `M ${ax} ${ay} C ${mx} ${ay} ${mx} ${by} ${bx} ${by}`
  return (
    <g className="pointer-events-auto">
      <path
        d={path}
        fill="none"
        stroke="hsl(199 89% 55%)"
        strokeOpacity={0.7}
        strokeWidth={1.5}
        markerEnd="url(#arrow)"
      />
      {label ? (
        <foreignObject x={mx - 60} y={my - 12} width={120} height={24}>
          <div className="text-center">
            <span className="rounded bg-background/80 px-1.5 py-0.5 text-[10px] text-foreground/80 backdrop-blur">
              {label}
            </span>
          </div>
        </foreignObject>
      ) : null}
      <circle
        cx={mx}
        cy={my}
        r={6}
        fill="transparent"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="pointer-events-auto cursor-pointer hover:fill-rose-500/40"
      />
    </g>
  )
}

/* -------------------------------------------------------------------------- */
/*                                INSPECTOR                                   */
/* -------------------------------------------------------------------------- */

function Inspector() {
  const { nodes, notes, selectedId, updateNodeProps, removeNode } = useCanvasStore()

  if (!selectedId) {
    return (
      <aside className="overflow-auto rounded-xl border border-border/60 bg-card/40 p-4 text-sm text-muted-foreground">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">
          Inspector
        </div>
        Select a node to edit its properties — or drag a new one from the left panel.
      </aside>
    )
  }

  const node = nodes.find((n) => n.id === selectedId)
  const note = notes.find((n) => n.id === selectedId)

  if (note) {
    return (
      <aside className="space-y-3 overflow-auto rounded-xl border border-border/60 bg-card/40 p-4 text-sm">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Note
        </div>
        <div className="space-y-1">
          <Label htmlFor="note_text">Text</Label>
          <Textarea
            id="note_text"
            value={note.text}
            onChange={(e) => updateNodeProps(note.id, { text: e.target.value })}
            rows={5}
          />
        </div>
        <Button variant="outline" className="w-full" onClick={() => removeNode(note.id)}>
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </aside>
    )
  }

  if (!node) return null
  const def = SHAPES[node.type]
  const Icon = def.icon

  return (
    <aside className="space-y-4 overflow-auto rounded-xl border border-border/60 bg-card/40 p-4 text-sm">
      <div className="flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-md"
          style={{ background: `hsl(${def.accent} / 0.18)`, color: `hsl(${def.accent})` }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="font-medium">{def.label}</span>
      </div>

      <PropertyEditor
        nodeId={node.id}
        type={node.type}
        props={node.props}
        onChange={(patch) => updateNodeProps(node.id, patch)}
      />

      <Button variant="outline" className="w-full" onClick={() => removeNode(node.id)}>
        <Trash2 className="h-4 w-4" />
        Delete node
      </Button>
    </aside>
  )
}

function PropertyEditor({
  type,
  props,
  onChange,
}: {
  nodeId: string
  type: ShapeType
  props: Record<string, unknown>
  onChange: (patch: Record<string, unknown>) => void
}) {
  const fields = FIELD_DEFS[type]
  return (
    <div className="space-y-3">
      {fields.map((f) => (
        <div key={f.key} className="space-y-1.5">
          <Label htmlFor={`p_${f.key}`}>{f.label}</Label>
          {f.kind === 'select' ? (
            <select
              id={`p_${f.key}`}
              value={(props[f.key] as string) ?? ''}
              onChange={(e) => onChange({ [f.key]: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : f.kind === 'number' ? (
            <Input
              id={`p_${f.key}`}
              type="number"
              value={(props[f.key] as number) ?? ''}
              onChange={(e) =>
                onChange({ [f.key]: e.target.value === '' ? undefined : Number(e.target.value) })
              }
            />
          ) : (
            <Input
              id={`p_${f.key}`}
              value={(props[f.key] as string) ?? ''}
              onChange={(e) => onChange({ [f.key]: e.target.value })}
            />
          )}
        </div>
      ))}
    </div>
  )
}

type Field =
  | { key: string; label: string; kind: 'text' }
  | { key: string; label: string; kind: 'number' }
  | { key: string; label: string; kind: 'select'; options: string[] }

const FIELD_DEFS: Record<ShapeType, Field[]> = {
  client: [
    { key: 'name', label: 'Name', kind: 'text' },
    { key: 'kind', label: 'Kind', kind: 'select', options: ['web', 'mobile', 'iot', 'cli'] },
  ],
  gateway: [
    { key: 'name', label: 'Name', kind: 'text' },
    { key: 'auth', label: 'Auth', kind: 'select', options: ['none', 'JWT', 'mTLS', 'OAuth'] },
  ],
  load_balancer: [
    { key: 'name', label: 'Name', kind: 'text' },
    {
      key: 'algorithm',
      label: 'Algorithm',
      kind: 'select',
      options: ['round_robin', 'least_conn', 'ip_hash'],
    },
  ],
  service: [
    { key: 'name', label: 'Name', kind: 'text' },
    { key: 'instances', label: 'Instances', kind: 'number' },
    { key: 'language', label: 'Language', kind: 'text' },
  ],
  database: [
    { key: 'name', label: 'Name', kind: 'text' },
    {
      key: 'kind',
      label: 'Kind',
      kind: 'select',
      options: ['sql', 'nosql', 'kv', 'graph', 'timeseries'],
    },
    { key: 'replicas', label: 'Replicas', kind: 'number' },
  ],
  cache: [
    { key: 'name', label: 'Name', kind: 'text' },
    { key: 'kind', label: 'Kind', kind: 'select', options: ['redis', 'memcached', 'cdn'] },
    { key: 'ttl_s', label: 'TTL (s)', kind: 'number' },
  ],
  queue: [
    { key: 'name', label: 'Name', kind: 'text' },
    {
      key: 'kind',
      label: 'Kind',
      kind: 'select',
      options: ['kafka', 'sqs', 'rabbit', 'pubsub'],
    },
  ],
  storage: [
    { key: 'name', label: 'Name', kind: 'text' },
    { key: 'kind', label: 'Kind', kind: 'select', options: ['s3', 'gcs', 'block', 'file'] },
  ],
  cdn: [
    { key: 'name', label: 'Name', kind: 'text' },
    { key: 'kind', label: 'Kind', kind: 'select', options: ['edge', 'pop'] },
  ],
  worker: [
    { key: 'name', label: 'Name', kind: 'text' },
    { key: 'instances', label: 'Instances', kind: 'number' },
  ],
  note: [{ key: 'text', label: 'Text', kind: 'text' }],
}

function subtitleFor(type: ShapeType, props: Record<string, unknown>): string {
  const k = (key: string) => (props[key] as string | number | undefined) ?? ''
  switch (type) {
    case 'client':
      return String(k('kind') || '')
    case 'gateway':
      return `auth: ${k('auth') || '—'}`
    case 'load_balancer':
      return String(k('algorithm') || '')
    case 'service':
    case 'worker': {
      const lang = k('language')
      const inst = k('instances')
      return [lang, inst ? `× ${inst}` : null].filter(Boolean).join(' · ')
    }
    case 'database': {
      const kind = k('kind')
      const rep = k('replicas')
      return [kind, rep ? `${rep}rep` : null].filter(Boolean).join(' · ')
    }
    case 'cache': {
      const kind = k('kind')
      const ttl = k('ttl_s')
      return [kind, ttl ? `ttl ${ttl}s` : null].filter(Boolean).join(' · ')
    }
    case 'queue':
      return String(k('kind') || '')
    case 'storage':
      return String(k('kind') || '')
    case 'cdn':
      return String(k('kind') || '')
    default:
      return ''
  }
}
