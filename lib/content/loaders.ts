import 'server-only'
import path from 'node:path'
import { promises as fs } from 'node:fs'
import matter from 'gray-matter'
import YAML from 'yaml'
import {
  ProblemFrontmatter,
  RubricYAML,
  LessonFrontmatter,
  DesignJSON,
  type DesignJSON as TDesignJSON,
} from './schemas'
import { AppError } from '@/lib/errors'

const ROOT = process.cwd()
const PROBLEMS_DIR = path.join(ROOT, 'content', 'problems')
const RUBRICS_DIR = path.join(ROOT, 'content', 'rubrics')
const SOLUTIONS_DIR = path.join(ROOT, 'content', 'solutions')
const LESSONS_DIR = path.join(ROOT, 'content', 'lessons')

export async function loadProblem(slug: string) {
  const md = await safeRead(path.join(PROBLEMS_DIR, `${slug}.md`))
  if (!md) throw new AppError('content.not_found', `Problem ${slug} not found`)
  const parsed = matter(md)
  const frontmatter = ProblemFrontmatter.parse({ slug, ...parsed.data })

  const yamlText = await safeRead(path.join(RUBRICS_DIR, `${slug}.yml`))
  if (!yamlText) throw new AppError('content.not_found', `Rubric ${slug} not found`)
  const rubric = RubricYAML.parse(YAML.parse(yamlText))

  return { frontmatter, body: parsed.content, rubric }
}

export async function loadSolution(slug: string): Promise<{
  body: string
  design: TDesignJSON | null
}> {
  const md = await safeRead(path.join(SOLUTIONS_DIR, `${slug}.md`))
  const json = await safeRead(path.join(SOLUTIONS_DIR, `${slug}.json`))
  if (!md) throw new AppError('content.not_found', 'Solution not found')

  const body = matter(md).content
  let design: TDesignJSON | null = null
  if (json) {
    try {
      design = DesignJSON.parse(JSON.parse(json))
    } catch (e) {
      throw new AppError('content.invalid', `Solution JSON invalid for ${slug}`, {
        cause: e,
      })
    }
  }
  return { body, design }
}

export async function listProblems() {
  const dir = await fs.readdir(PROBLEMS_DIR).catch(() => [])
  const files = dir.filter((f) => f.endsWith('.md'))
  const out = []
  for (const f of files) {
    const slug = f.replace(/\.md$/, '')
    try {
      const { frontmatter } = await loadProblem(slug)
      out.push(frontmatter)
    } catch {
      // skip invalid
    }
  }
  return out.sort((a, b) => a.title.localeCompare(b.title))
}

export async function loadLesson(slug: string) {
  const md = await safeRead(path.join(LESSONS_DIR, `${slug}.md`))
  if (!md) throw new AppError('content.not_found', `Lesson ${slug} not found`)
  const parsed = matter(md)
  const frontmatter = LessonFrontmatter.parse({ slug, ...parsed.data })
  return { frontmatter, body: parsed.content }
}

export async function listLessons() {
  const dir = await fs.readdir(LESSONS_DIR).catch(() => [])
  const files = dir.filter((f) => f.endsWith('.md'))
  const out = []
  for (const f of files) {
    const slug = f.replace(/\.md$/, '')
    try {
      const { frontmatter } = await loadLesson(slug)
      out.push(frontmatter)
    } catch {
      // skip
    }
  }
  return out.sort((a, b) => a.sort_order - b.sort_order)
}

async function safeRead(p: string): Promise<string | null> {
  try {
    return await fs.readFile(p, 'utf8')
  } catch {
    return null
  }
}
