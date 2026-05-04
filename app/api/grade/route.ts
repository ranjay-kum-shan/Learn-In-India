import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { fetchProblem } from '@/lib/data/problems'
import { gradeSubmission } from '@/lib/grading/grade'
import { DesignJSON } from '@/lib/content/schemas'
import { env, isAnthropicConfigured, isSupabaseConfigured } from '@/lib/env'
import { getUser } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const Body = z.object({
  problemSlug: z.string(),
  problemId: z.string().optional(),
  rubricId: z.string().optional(),
  designJson: DesignJSON,
  transcript: z.string().default(''),
})

export async function POST(req: NextRequest) {
  let parsed
  try {
    parsed = Body.parse(await req.json())
  } catch (e: unknown) {
    return errorResponse(400, e instanceof Error ? e.message : 'Invalid request body')
  }

  // Optional auth — allowed without it when MOCK_GRADING is on or Supabase isn't configured
  const requireAuth = isSupabaseConfigured && !env.MOCK_GRADING
  const user = isSupabaseConfigured ? await getUser() : null
  if (requireAuth && !user) {
    return errorResponse(401, 'Unauthenticated')
  }

  const problem = await fetchProblem(parsed.problemSlug)
  if (!problem) return errorResponse(404, `Problem not found: ${parsed.problemSlug}`)

  // If grading is real but key missing, fall through to mock without crashing
  const willMock = !isAnthropicConfigured || env.MOCK_GRADING

  // SSE stream
  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder()
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`))
      }
      send({ phase: 'queued', progress: 5 })

      // Create submission row if persistence is wired up
      let submissionId: string | null = null
      if (
        isSupabaseConfigured &&
        user &&
        parsed.problemId &&
        parsed.rubricId
      ) {
        try {
          const sb = createServiceClient()
          const { data, error } = await sb
            .from('submissions')
            .insert({
              user_id: user.id,
              problem_id: parsed.problemId,
              rubric_id: parsed.rubricId,
              design_json: parsed.designJson as never,
              transcript: parsed.transcript,
              status: 'grading',
            })
            .select('id')
            .single()
          if (!error && data) submissionId = data.id
        } catch {
          // non-fatal
        }
      }

      send({ phase: 'thinking', progress: 25 })

      try {
        // Yield to the runtime so the SSE flushes
        await new Promise((r) => setTimeout(r, 50))

        // willMock just signals to the client when we're skipping Claude;
        // gradeSubmission detects mock mode internally via env + isAnthropicConfigured.
        if (willMock) {
          send({ phase: 'thinking', progress: 50 })
        }
        const result = await gradeSubmission({
          problemTitle: problem.title,
          problemBody: problem.body,
          rubric: problem.rubric,
          designJson: parsed.designJson,
          transcript: parsed.transcript,
        })

        send({ phase: 'scoring', progress: 80 })

        // Persist scores
        if (submissionId && isSupabaseConfigured && parsed.rubricId) {
          try {
            const sb = createServiceClient()
            // Resolve criterion external_id → criterion id
            const { data: criteria } = await sb
              .from('criteria')
              .select('id, external_id')
              .eq('rubric_id', parsed.rubricId)

            const idByExt = new Map<string, string>()
            for (const c of criteria ?? []) idByExt.set(c.external_id, c.id)

            const rows = result.criteria
              .map((c) => {
                const id = idByExt.get(c.criterion_id)
                if (!id) return null
                return {
                  submission_id: submissionId!,
                  criterion_id: id,
                  score: c.score,
                  evidence: c.evidence,
                  suggestion: c.suggestion,
                }
              })
              .filter(Boolean) as never[]

            if (rows.length > 0) await sb.from('scores').insert(rows)

            await sb
              .from('submissions')
              .update({
                status: 'graded',
                overall_score: result.overall.score,
                overall_summary: result.overall.summary,
                graded_at: new Date().toISOString(),
              })
              .eq('id', submissionId)
          } catch (e) {
            console.error('Persistence failed:', e)
          }
        }

        send({ phase: 'done', progress: 100, result })
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Grading failed'
        send({ phase: 'error', error: message })
        if (submissionId && isSupabaseConfigured) {
          try {
            const sb = createServiceClient()
            await sb
              .from('submissions')
              .update({ status: 'error', error_message: message })
              .eq('id', submissionId)
          } catch {
            // ignore
          }
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}

function errorResponse(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
