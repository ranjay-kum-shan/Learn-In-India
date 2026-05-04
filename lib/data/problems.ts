import 'server-only'
import { isSupabaseConfigured } from '@/lib/env'
import { getProblemBySlug as dbGetProblem, listProblems as dbListProblems } from '@/lib/db/queries'
import { listProblems as fsListProblems, loadProblem as fsLoadProblem } from '@/lib/content/loaders'
import type { ProblemFrontmatter, RubricYAML } from '@/lib/content/schemas'
import type { Difficulty } from '@/lib/supabase/types'

export interface ProblemListItem {
  slug: string
  title: string
  difficulty: Difficulty
  tags: string[]
  estimated_minutes: number
  is_free: boolean
  sort_order?: number
}

export interface ProblemDetail {
  slug: string
  title: string
  difficulty: Difficulty
  tags: string[]
  estimated_minutes: number
  is_free: boolean
  body: string
  rubric: RubricYAML
  /** When backed by DB, this is the rubric row id used to attach submissions to a versioned rubric */
  rubric_id?: string
  /** When backed by DB, this is the problem row id used by submissions */
  problem_id?: string
}

export async function fetchProblems(): Promise<ProblemListItem[]> {
  if (isSupabaseConfigured) {
    const r = await dbListProblems()
    if (r.ok) {
      return r.value.map((p) => ({
        slug: p.slug,
        title: p.title,
        difficulty: p.difficulty,
        tags: p.tags,
        estimated_minutes: p.estimated_minutes,
        is_free: p.is_free,
        sort_order: p.sort_order,
      }))
    }
  }
  // FS fallback
  const fs = await fsListProblems()
  return fs.map((f: ProblemFrontmatter) => ({
    slug: f.slug,
    title: f.title,
    difficulty: f.difficulty,
    tags: f.tags,
    estimated_minutes: f.estimated_minutes,
    is_free: f.is_free,
  }))
}

export async function fetchProblem(slug: string): Promise<ProblemDetail | null> {
  // Always need the body + rubric from FS for full content, even if DB is configured.
  let fs
  try {
    fs = await fsLoadProblem(slug)
  } catch {
    return null
  }

  if (isSupabaseConfigured) {
    const r = await dbGetProblem(slug)
    if (r.ok) {
      return {
        slug: r.value.slug,
        title: r.value.title,
        difficulty: r.value.difficulty,
        tags: r.value.tags,
        estimated_minutes: r.value.estimated_minutes,
        is_free: r.value.is_free,
        body: fs.body,
        rubric: fs.rubric,
        rubric_id: r.value.rubric.id,
        problem_id: r.value.id,
      }
    }
  }

  return {
    slug: fs.frontmatter.slug,
    title: fs.frontmatter.title,
    difficulty: fs.frontmatter.difficulty,
    tags: fs.frontmatter.tags,
    estimated_minutes: fs.frontmatter.estimated_minutes,
    is_free: fs.frontmatter.is_free,
    body: fs.body,
    rubric: fs.rubric,
  }
}
