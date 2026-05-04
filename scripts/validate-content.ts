/**
 * Validate /content — runs the same parsers as the sync script
 * but prints a report instead of writing to the DB.
 */
import path from 'node:path'
import { promises as fs } from 'node:fs'
import matter from 'gray-matter'
import YAML from 'yaml'
import { ProblemFrontmatter, RubricYAML, DesignJSON } from '../lib/content/schemas'

async function main() {
  const root = process.cwd()
  const problemsDir = path.join(root, 'content', 'problems')
  const rubricsDir = path.join(root, 'content', 'rubrics')
  const solutionsDir = path.join(root, 'content', 'solutions')

  let errors = 0
  const files = (await fs.readdir(problemsDir)).filter((f) => f.endsWith('.md'))

  for (const file of files) {
    const slug = file.replace(/\.md$/, '')
    try {
      const md = await fs.readFile(path.join(problemsDir, file), 'utf8')
      const fm = ProblemFrontmatter.parse({ slug, ...matter(md).data })

      const yamlText = await fs.readFile(path.join(rubricsDir, `${slug}.yml`), 'utf8')
      const r = RubricYAML.parse(YAML.parse(yamlText))
      const totalWeight = r.criteria.reduce((s, c) => s + c.weight, 0)

      const solnMd = await fs
        .readFile(path.join(solutionsDir, `${slug}.md`), 'utf8')
        .catch(() => null)
      const solnJson = await fs
        .readFile(path.join(solutionsDir, `${slug}.json`), 'utf8')
        .catch(() => null)
      if (solnJson) DesignJSON.parse(JSON.parse(solnJson))

      console.log(
        `✓ ${slug}  [${fm.difficulty}, ${r.criteria.length} criteria, weight=${totalWeight}, soln=${solnMd ? 'y' : 'n'}/${solnJson ? 'y' : 'n'}]`,
      )
    } catch (e) {
      errors++
      console.error(`✗ ${slug}:`, (e as Error).message)
    }
  }

  if (errors > 0) {
    console.error(`\n${errors} errors`)
    process.exit(1)
  }
  console.log('\nAll content valid.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
