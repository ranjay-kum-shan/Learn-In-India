import { z } from 'zod'

export const CriterionScore = z.object({
  criterion_id: z.string(),
  score: z.number().int().min(0).max(3),
  evidence: z.string(),
  suggestion: z.string(),
})
export type CriterionScore = z.infer<typeof CriterionScore>

export const GradingResult = z.object({
  overall: z.object({
    score: z.number().int().min(0).max(100),
    summary: z.string(),
  }),
  criteria: z.array(CriterionScore),
  strong_areas: z.array(z.string()).default([]),
  missing_concepts: z.array(z.string()).default([]),
})
export type GradingResult = z.infer<typeof GradingResult>

/**
 * The JSON Schema we hand to Claude as the tool input_schema.
 * Hand-rolled so we don't pull zod-to-json-schema as a dep.
 */
export const GradingResultJSONSchema = {
  type: 'object',
  required: ['overall', 'criteria'],
  properties: {
    overall: {
      type: 'object',
      required: ['score', 'summary'],
      properties: {
        score: {
          type: 'integer',
          minimum: 0,
          maximum: 100,
          description: 'Overall weighted score, 0–100.',
        },
        summary: {
          type: 'string',
          description: 'Two to four sentence prose summary of the design.',
        },
      },
    },
    criteria: {
      type: 'array',
      description:
        'One entry per rubric criterion. Use the criterion external ids exactly.',
      items: {
        type: 'object',
        required: ['criterion_id', 'score', 'evidence', 'suggestion'],
        properties: {
          criterion_id: {
            type: 'string',
            description: 'The rubric criterion `id` field, exactly.',
          },
          score: {
            type: 'integer',
            minimum: 0,
            maximum: 3,
            description: '0=missing, 1=mentioned, 2=correct, 3=excellent.',
          },
          evidence: {
            type: 'string',
            description:
              'Cite specific node ids from the design, or quote the transcript. ≤ 200 chars.',
          },
          suggestion: {
            type: 'string',
            description:
              'Specific, actionable suggestion for improvement, or empty if score=3.',
          },
        },
      },
    },
    strong_areas: {
      type: 'array',
      items: { type: 'string' },
      description: '2–5 concise strengths.',
    },
    missing_concepts: {
      type: 'array',
      items: { type: 'string' },
      description: '2–5 concepts the candidate should drill next.',
    },
  },
} as const
