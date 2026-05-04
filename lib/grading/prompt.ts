import type { RubricYAML, DesignJSON } from '@/lib/content/schemas'

interface BuildArgs {
  problemTitle: string
  problemBody: string
  rubric: RubricYAML
  designJson: DesignJSON
  transcript: string
}

export function buildGradingPrompt(args: BuildArgs) {
  const { problemTitle, problemBody, rubric, designJson, transcript } = args

  const system = `You are a senior staff engineer interviewer. You have been asked to grade a system design submission against a structured rubric.

# Rules

1. The rubric is the single source of truth. Score only the criteria provided. Do not invent extra criteria.
2. Each criterion is scored 0–3:
   - 0 = missing entirely (no signal in design or transcript)
   - 1 = mentioned but superficial / generic
   - 2 = correct and reasoned about (most of the signals present)
   - 3 = excellent, with clear nuance, alternatives discussed, or trade-offs articulated
3. **Cite evidence.** Every criterion's "evidence" field MUST cite a specific node id from the design (when applicable) or quote a fragment of the transcript (≤ 100 chars). If the candidate did not address it, say so.
4. The "suggestion" field gives one specific, actionable improvement — *not* praise. Empty if score=3.
5. The "overall.summary" is 2–4 sentences. Plain English. No bullet points. Speak directly to the candidate.
6. Compute the overall score as a 0–100 weighted average of criterion scores: \`score_pct = sum(weight_i * (criterion_score_i / 3)) / sum(weight_i) * 100\`. Round to integer.
7. Strong-areas: 2–5 concise wins. Missing-concepts: 2–5 short, drillable topics (e.g. "consistent hashing", "request coalescing").
8. Be a generous, fair, technically rigorous grader. Reward correct intuition even when imperfectly articulated.
9. Return your output ONLY by calling the \`submit_grade\` tool. Do not write prose. Do not provide a chat reply.`

  const userParts: string[] = []
  userParts.push(`# Problem: ${problemTitle}`)
  userParts.push(problemBody.trim())
  userParts.push('')
  userParts.push(`# Rubric (version ${rubric.version})`)
  userParts.push('')
  for (const c of rubric.criteria) {
    userParts.push(`## ${c.id} — ${c.title}  (weight ${c.weight}, category ${c.category})`)
    if (c.signals.length > 0) {
      userParts.push('Signals (good):')
      for (const s of c.signals) userParts.push(`  - ${s}`)
    }
    if (c.anti_signals.length > 0) {
      userParts.push('Anti-signals (bad):')
      for (const s of c.anti_signals) userParts.push(`  - ${s}`)
    }
    userParts.push('')
  }

  userParts.push('# Candidate submission')
  userParts.push('')
  userParts.push('## Canvas (DesignJSON)')
  userParts.push('```json')
  userParts.push(JSON.stringify(designJson, null, 2))
  userParts.push('```')
  userParts.push('')
  userParts.push('## Writeup / transcript')
  userParts.push(transcript.trim() || '(empty)')
  userParts.push('')
  userParts.push(
    '# Now: call the `submit_grade` tool with one entry per rubric criterion. Use the criterion ids exactly as listed above.',
  )

  const user = userParts.join('\n')

  return { system, user }
}
