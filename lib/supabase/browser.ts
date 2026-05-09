'use client'

import { createBrowserClient as _create } from '@supabase/ssr'
import type { Database } from './types'
import { env } from '@/lib/env'
import { type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient<Database> | null = null

export function createClient(): SupabaseClient<Database> {
  if (_client) return _client
  // Same cast story as in `./server.ts` — see comment there.
  _client = _create<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  ) as unknown as SupabaseClient<Database>
  return _client
}
