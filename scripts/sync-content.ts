/**
 * Sync the local /content directory into Supabase.
 * Run with: pnpm content:sync
 *
 * - Upserts problems (slug, title, difficulty, tags, is_free, sort_order)
 * - For each problem, upserts a current rubric row + criteria rows
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (server-only).
 * Env is loaded from .env.local via the script in package.json (tsx --env-file).
 */
import path from 'node:path'
import { promises as fs } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import matter from 'gray-matter'
import YAML from 'yaml'

// Manual env loading from .env.local — works without dotenv dep, in any tsx/node version.
async function loadEnvLocal() {
  try {
    const envPath = path.join(process.cwd(), '.env.local')
    const text = await fs.readFile(envPath, 'utf8')
    for (const rawLine of text.split('\n')) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const eq = line.indexOf('=')
      if (eq === -1) continue
      const key = line.slice(0, eq).trim()
      let value = line.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    // .env.local not present — assume env is already set externally
  }
}
import { ProblemFrontmatter, RubricYAML } from '../lib/content/schemas'

async function main() {
  await loadEnvLocal()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }
  const sb = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const root = process.cwd()
  const problemsDir = path.join(root, 'content', 'problems')
  const rubricsDir = path.join(root, 'content', 'rubrics')

  const files = (await fs.readdir(problemsDir)).filter((f) => f.endsWith('.md'))
  console.log(`Found ${files.length} problems`)

  for (const file of files) {
    const slug = file.replace(/\.md$/, '')
    const md = await fs.readFile(path.join(problemsDir, file), 'utf8')
    const fm = ProblemFrontmatter.parse({ slug, ...matter(md).data })

    const { data: pData, error: pErr } = await sb
      .from('problems')
      .upsert({
        slug: fm.slug,
        title: fm.title,
        difficulty: fm.difficulty,
        tags: fm.tags,
        estimated_minutes: fm.estimated_minutes,
        is_free: fm.is_free,
        is_published: true,
      }, { onConflict: 'slug' })
      .select('id')
      .single()

    if (pErr) {
      console.error(`Failed to upsert problem ${slug}:`, pErr.message)
      continue
    }

    const yamlPath = path.join(rubricsDir, `${slug}.yml`)
    const yamlText = await fs.readFile(yamlPath, 'utf8').catch(() => null)
    if (!yamlText) {
      console.warn(`No rubric for ${slug}, skipping`)
      continue
    }
    const rubric = RubricYAML.parse(YAML.parse(yamlText))

    // Mark older rubrics not-current
    await sb
      .from('rubrics')
      .update({ is_current: false })
      .eq('problem_id', pData.id)

    const { data: rData, error: rErr } = await sb
      .from('rubrics')
      .upsert({
        problem_id: pData.id,
        version: rubric.version,
        yaml: yamlText,
        is_current: true,
      }, { onConflict: 'problem_id,version' })
      .select('id')
      .single()

    if (rErr) {
      console.error(`Failed to upsert rubric for ${slug}:`, rErr.message)
      continue
    }

    // Upsert criteria
    let order = 1
    for (const c of rubric.criteria) {
      const { error: cErr } = await sb.from('criteria').upsert({
        rubric_id: rData.id,
        external_id: c.id,
        title: c.title,
        weight: c.weight,
        category: c.category,
        signals: c.signals,
        anti_signals: c.anti_signals,
        sort_order: order++,
      }, { onConflict: 'rubric_id,external_id' })
      if (cErr) {
        console.error(`Failed to upsert criterion ${c.id} for ${slug}:`, cErr.message)
      }
    }

    console.log(`✓ ${slug}: ${rubric.criteria.length} criteria`)
  }

  console.log('Done.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
