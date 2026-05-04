import 'server-only'
import { createClient as _create } from '@supabase/supabase-js'
import type { Database } from './types'
import { env } from '@/lib/env'

/**
 * Service-role client. Bypasses RLS — use ONLY for:
 *  - Stripe webhook handlers
 *  - Cron / background jobs
 *  - Server-side AI grading writes
 *
 * Never import this from client-bundled code.
 */
export function createServiceClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'Service-role Supabase is not configured. Set SUPABASE_SERVICE_ROLE_KEY.',
    )
  }
  return _create<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
