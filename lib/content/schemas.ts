import { z } from 'zod'

export const ProblemFrontmatter = z.object({
  slug: z.string(),
  title: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string()).default([]),
  estimated_minutes: z.number().int().min(1).max(180).default(45),
  is_free: z.boolean().default(false),
})
export type ProblemFrontmatter = z.infer<typeof ProblemFrontmatter>

export const RubricCriterion = z.object({
  id: z.string(),
  title: z.string(),
  weight: z.number(),
  category: z.string(),
  signals: z.array(z.string()).default([]),
  anti_signals: z.array(z.string()).default([]),
})
export type RubricCriterion = z.infer<typeof RubricCriterion>

export const RubricYAML = z.object({
  problem: z.string(),
  version: z.number().int().min(1).default(1),
  criteria: z.array(RubricCriterion).min(3),
})
export type RubricYAML = z.infer<typeof RubricYAML>

export const LessonFrontmatter = z.object({
  slug: z.string(),
  title: z.string(),
  category: z.string().default('fundamentals'),
  reading_minutes: z.number().int().min(1).max(60).default(8),
  sort_order: z.number().int().default(100),
})
export type LessonFrontmatter = z.infer<typeof LessonFrontmatter>

/* Canvas DesignJSON schemas */

const Position = z.object({ x: z.number(), y: z.number() })

export const DesignNode = z.object({
  id: z.string(),
  type: z.enum([
    'client',
    'gateway',
    'load_balancer',
    'service',
    'database',
    'cache',
    'queue',
    'storage',
    'cdn',
    'note',
    'worker',
  ]),
  position: Position,
  props: z.record(z.unknown()).default({}),
})
export type DesignNode = z.infer<typeof DesignNode>

export const DesignEdge = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  label: z.string().optional(),
  props: z.record(z.unknown()).optional(),
})
export type DesignEdge = z.infer<typeof DesignEdge>

export const DesignNote = z.object({
  id: z.string(),
  position: Position,
  text: z.string(),
})
export type DesignNote = z.infer<typeof DesignNote>

export const DesignJSON = z.object({
  nodes: z.array(DesignNode).default([]),
  edges: z.array(DesignEdge).default([]),
  notes: z.array(DesignNote).default([]),
})
export type DesignJSON = z.infer<typeof DesignJSON>
