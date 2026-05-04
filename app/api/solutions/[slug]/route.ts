import { NextResponse } from 'next/server'
import { loadSolution } from '@/lib/content/loaders'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  try {
    const data = await loadSolution(slug)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
}
