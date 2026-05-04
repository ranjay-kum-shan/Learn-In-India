'use client'

import { create } from 'zustand'
import type { DesignJSON, DesignNode, DesignEdge, DesignNote } from '@/lib/content/schemas'
import { SHAPES, type ShapeType } from './shape-defs'

interface CanvasState {
  nodes: DesignNode[]
  edges: DesignEdge[]
  notes: DesignNote[]
  selectedId: string | null
  /** which node we're currently dragging an edge from */
  edgeDraftFrom: string | null

  /* CRUD */
  addNode: (type: ShapeType, position: { x: number; y: number }) => string
  updateNodePosition: (id: string, position: { x: number; y: number }) => void
  updateNodeProps: (id: string, props: Record<string, unknown>) => void
  removeNode: (id: string) => void
  addEdge: (from: string, to: string, label?: string) => void
  removeEdge: (id: string) => void
  updateEdge: (id: string, patch: Partial<DesignEdge>) => void
  setSelected: (id: string | null) => void
  startEdge: (from: string) => void
  cancelEdge: () => void

  /* Canvas-level */
  clear: () => void
  load: (json: DesignJSON) => void
  toJSON: () => DesignJSON
}

let _id = 0
const nextId = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${(_id++).toString(36)}`

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  notes: [],
  selectedId: null,
  edgeDraftFrom: null,

  addNode: (type, position) => {
    const id = nextId(type)
    if (type === 'note') {
      set((s) => ({
        notes: [...s.notes, { id, position, text: 'capacity / note' }],
        selectedId: id,
      }))
      return id
    }
    set((s) => ({
      nodes: [
        ...s.nodes,
        { id, type, position, props: { ...SHAPES[type].defaultProps } },
      ],
      selectedId: id,
    }))
    return id
  },

  updateNodePosition: (id, position) => {
    set((s) => ({
      nodes: s.nodes.map((n) => (n.id === id ? { ...n, position } : n)),
      notes: s.notes.map((n) => (n.id === id ? { ...n, position } : n)),
    }))
  },

  updateNodeProps: (id, props) => {
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, props: { ...n.props, ...props } } : n,
      ),
      notes: s.notes.map((n) =>
        n.id === id && typeof props.text === 'string' ? { ...n, text: props.text } : n,
      ),
    }))
  },

  removeNode: (id) => {
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      notes: s.notes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.from !== id && e.to !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    }))
  },

  addEdge: (from, to, label) => {
    if (from === to) return
    if (get().edges.some((e) => e.from === from && e.to === to)) return
    set((s) => ({
      edges: [...s.edges, { id: nextId('e'), from, to, label }],
      edgeDraftFrom: null,
    }))
  },

  removeEdge: (id) => {
    set((s) => ({ edges: s.edges.filter((e) => e.id !== id) }))
  },

  updateEdge: (id, patch) => {
    set((s) => ({
      edges: s.edges.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }))
  },

  setSelected: (id) => set({ selectedId: id }),
  startEdge: (from) => set({ edgeDraftFrom: from }),
  cancelEdge: () => set({ edgeDraftFrom: null }),

  clear: () =>
    set({ nodes: [], edges: [], notes: [], selectedId: null, edgeDraftFrom: null }),

  load: (json) =>
    set({
      nodes: json.nodes,
      edges: json.edges,
      notes: json.notes,
      selectedId: null,
      edgeDraftFrom: null,
    }),

  toJSON: () => ({ nodes: get().nodes, edges: get().edges, notes: get().notes }),
}))
