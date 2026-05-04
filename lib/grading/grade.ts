import 'server-only'
import { getAnthropicClient } from './anthropic'
import { buildGradingPrompt } from './prompt'
import { GradingResult, GradingResultJSONSchema, type GradingResult as TGR } from './schemas'
import type { RubricYAML, DesignJSON } from '@/lib/content/schemas'
import { env, isAnthropicConfigured } from '@/lib/env'
import { AppError } from '@/lib/errors'

interface GradeArgs {
  problemTitle: string
  problemBody: string
  rubric: RubricYAML
  designJson: DesignJSON
  transcript: string
}

export async function gradeSubmission(args: GradeArgs): Promise<TGR> {
  // Mock if explicitly enabled or Anthropic isn't configured
  if (env.MOCK_GRADING || !isAnthropicConfigured) {
    return mockGrade(args.rubric)
  }

  const client = getAnthropicClient()
  const { system, user } = buildGradingPrompt(args)

  const tool = {
    name: 'submit_grade',
    description: 'Submit a structured grading of the system design.',
    input_schema: GradingResultJSONSchema as never,
  }

  const res = await client.messages.create({
    model: env.ANTHROPIC_GRADING_MODEL,
    max_tokens: 4096,
    temperature: 0.2,
    system,
    messages: [{ role: 'user', content: user }],
    tools: [tool],
    tool_choice: { type: 'tool', name: 'submit_grade' },
  })

  const block = res.content.find((b) => b.type === 'tool_use')
  if (!block || block.type !== 'tool_use') {
    throw new AppError('grading.no_tool_use', 'Claude did not call the grading tool')
  }

  const parsed = GradingResult.safeParse(block.input)
  if (!parsed.success) {
    // Retry once with the reasoning model
    const retry = await client.messages.create({
      model: env.ANTHROPIC_REASONING_MODEL,
      max_tokens: 4096,
      temperature: 0.2,
      system,
      messages: [
        { role: 'user', content: user },
        {
          role: 'assistant',
          content: [{ type: 'tool_use', id: block.id, name: block.name, input: block.input }],
        },
        {
          role: 'user',
          content: `Your tool input did not validate. Errors:\n${JSON.stringify(parsed.error.format(), null, 2)}\nPlease re-emit the tool call with corrected fields.`,
        },
      ],
      tools: [tool],
      tool_choice: { type: 'tool', name: 'submit_grade' },
    })
    const retryBlock = retry.content.find((b) => b.type === 'tool_use')
    if (!retryBlock || retryBlock.type !== 'tool_use') {
      throw new AppError('grading.invalid_response', 'Retry produced no tool_use block')
    }
    const retryParsed = GradingResult.safeParse(retryBlock.input)
    if (!retryParsed.success) {
      throw new AppError(
        'grading.invalid_response',
        `Grading retry still invalid: ${JSON.stringify(retryParsed.error.format())}`,
      )
    }
    return retryParsed.data
  }

  return parsed.data
}

/* -------------------------------------------------------------------------- */
/*                              Mock grading                                  */
/* -------------------------------------------------------------------------- */

function mockGrade(rubric: RubricYAML): TGR {
  const criteria = rubric.criteria.map((c) => {
    const score = pseudoRandomInt(c.id, 1, 3)
    return {
      criterion_id: c.id,
      score,
      evidence:
        score >= 2
          ? `Cited node addressing ${c.title.toLowerCase()}.`
          : `Did not clearly address ${c.title.toLowerCase()} in the design.`,
      suggestion:
        score === 3 ? '' : `Discuss ${c.signals[0] ?? 'the topic'} more explicitly.`,
    }
  })
  const totalWeight = rubric.criteria.reduce((s, c) => s + c.weight, 0)
  const weightedScore = criteria.reduce((acc, c) => {
    const w = rubric.criteria.find((r) => r.id === c.criterion_id)?.weight ?? 0
    return acc + (c.score / 3) * w
  }, 0)
  const overall = Math.round((weightedScore / totalWeight) * 100)
  return {
    overall: {
      score: overall,
      summary:
        '[Mock grading] Set MOCK_GRADING=false and provide ANTHROPIC_API_KEY in your .env.local for real Claude-powered feedback.',
    },
    criteria,
    strong_areas: criteria
      .filter((c) => c.score >= 2)
      .slice(0, 3)
      .map((c) => c.criterion_id),
    missing_concepts: criteria
      .filter((c) => c.score <= 1)
      .slice(0, 3)
      .map((c) => c.criterion_id),
  }
}

function pseudoRandomInt(seed: string, min: number, max: number) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const n = (h >>> 0) % (max - min + 1)
  return min + n
}
