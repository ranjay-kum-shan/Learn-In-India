import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { AppError, ok, err, type Result } from '@/lib/errors'
import type {
  CriterionRow,
  ProblemRow,
  RubricRow,
  ScoreRow,
  SubmissionRow,
  UserRow,
} from '@/lib/supabase/types'

export type ProblemFull = ProblemRow & {
  rubric: RubricRow & { criteria: CriterionRow[] }
}

/* -------------------------------------------------------------------------- */
/*                                  PROBLEMS                                  */
/* -------------------------------------------------------------------------- */

export async function listProblems(): Promise<Result<ProblemRow[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('problems')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
  if (error) return err(new AppError('db.not_found', error.message))
  return ok(data ?? [])
}

export async function getProblemBySlug(
  slug: string,
): Promise<Result<ProblemFull, AppError>> {
  const supabase = await createClient()
  const { data: p, error } = await supabase
    .from('problems')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (error || !p) return err(new AppError('content.not_found', `Problem ${slug} not found`))

  const { data: rubric, error: rerr } = await supabase
    .from('rubrics')
    .select('*')
    .eq('problem_id', p.id)
    .eq('is_current', true)
    .maybeSingle()
  if (rerr || !rubric)
    return err(new AppError('content.not_found', 'No current rubric for problem'))

  const { data: criteria, error: cerr } = await supabase
    .from('criteria')
    .select('*')
    .eq('rubric_id', rubric.id)
    .order('sort_order', { ascending: true })
  if (cerr) return err(new AppError('db.not_found', cerr.message))

  return ok({ ...p, rubric: { ...rubric, criteria: criteria ?? [] } })
}

/* -------------------------------------------------------------------------- */
/*                                SUBMISSIONS                                 */
/* -------------------------------------------------------------------------- */

export interface CreateSubmissionInput {
  user_id: string
  problem_id: string
  rubric_id: string
  design_json: unknown
  transcript: string
}

export async function createSubmission(
  input: CreateSubmissionInput,
): Promise<Result<SubmissionRow>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('submissions')
    .insert({
      user_id: input.user_id,
      problem_id: input.problem_id,
      rubric_id: input.rubric_id,
      design_json: input.design_json as any,
      transcript: input.transcript,
      status: 'draft',
    })
    .select('*')
    .single()
  if (error || !data) return err(new AppError('db.constraint', error?.message))
  return ok(data)
}

export async function getSubmissionFull(
  submissionId: string,
): Promise<
  Result<{
    submission: SubmissionRow
    scores: (ScoreRow & { criterion: CriterionRow })[]
  }>
> {
  const supabase = await createClient()
  const { data: s, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', submissionId)
    .maybeSingle()
  if (error || !s) return err(new AppError('db.not_found', 'Submission not found'))

  const { data: scores, error: serr } = await supabase
    .from('scores')
    .select('*, criterion:criteria(*)')
    .eq('submission_id', submissionId)
  if (serr) return err(new AppError('db.not_found', serr.message))

  return ok({ submission: s, scores: (scores ?? []) as never })
}

export async function getUserSubmissions(
  userId: string,
  problemId?: string,
): Promise<Result<SubmissionRow[]>> {
  const supabase = await createClient()
  let q = supabase
    .from('submissions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (problemId) q = q.eq('problem_id', problemId)
  const { data, error } = await q
  if (error) return err(new AppError('db.not_found', error.message))
  return ok(data ?? [])
}

/* -------------------------------------------------------------------------- */
/*                                  USERS                                     */
/* -------------------------------------------------------------------------- */

export async function getUserProfile(userId: string): Promise<Result<UserRow>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error || !data) return err(new AppError('db.not_found', 'User not found'))
  return ok(data)
}

/* -------------------------------------------------------------------------- */
/*                                DASHBOARD                                   */
/* -------------------------------------------------------------------------- */

export interface DashboardData {
  user: UserRow
  totals: {
    attempted: number
    graded: number
    avg_score: number
  }
  recent: (SubmissionRow & { problem: Pick<ProblemRow, 'slug' | 'title' | 'difficulty'> })[]
  weakAreas: { category: string; avg_score: number; count: number }[]
  activity: { date: string; count: number }[]
}

export async function getUserDashboard(
  userId: string,
): Promise<Result<DashboardData>> {
  const supabase = await createClient()

  const userRes = await getUserProfile(userId)
  if (!userRes.ok) return userRes

  const { data: submissions } = await supabase
    .from('submissions')
    .select('*, problem:problems(slug,title,difficulty)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const subs = submissions ?? []
  const graded = subs.filter((s) => s.status === 'graded' && s.overall_score != null)
  const avg =
    graded.length > 0
      ? Math.round(
          graded.reduce((acc, s) => acc + (s.overall_score ?? 0), 0) / graded.length,
        )
      : 0

  const { data: weak } = await supabase
    .from('scores')
    .select('score, criterion:criteria(category)')
    .in('submission_id', graded.map((s) => s.id))
  const byCat = new Map<string, { sum: number; n: number }>()
  for (const row of weak ?? []) {
    const cat = (row.criterion as unknown as { category?: string })?.category
    if (!cat) continue
    const cur = byCat.get(cat) ?? { sum: 0, n: 0 }
    cur.sum += row.score
    cur.n += 1
    byCat.set(cat, cur)
  }
  const weakAreas = Array.from(byCat.entries())
    .map(([category, { sum, n }]) => ({ category, avg_score: sum / n, count: n }))
    .filter((w) => w.avg_score < 2)
    .sort((a, b) => a.avg_score - b.avg_score)
    .slice(0, 5)

  const activityMap = new Map<string, number>()
  for (const s of subs) {
    const date = s.created_at.slice(0, 10)
    activityMap.set(date, (activityMap.get(date) ?? 0) + 1)
  }
  const activity = Array.from(activityMap.entries()).map(([date, count]) => ({
    date,
    count,
  }))

  return ok({
    user: userRes.value,
    totals: {
      attempted: subs.length,
      graded: graded.length,
      avg_score: avg,
    },
    recent: subs.slice(0, 8) as never,
    weakAreas,
    activity,
  })
}
