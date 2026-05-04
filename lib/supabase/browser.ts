'use client'

import { createBrowserClient as _create } from '@supabase/ssr'
import type { Database } from './types'
import { env } from '@/lib/env'

let _client: ReturnType<typeof _create<Database>> | null = null

export function createClient() {
  if (_client) return _client
  _client = _create<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  )
  return _client
}
