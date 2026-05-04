import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/env'

export async function POST(req: NextRequest) {
  if (isSupabaseConfigured) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }
  return NextResponse.redirect(new URL('/', req.url), { status: 303 })
}

export async function GET(req: NextRequest) {
  return POST(req)
}
