import { createServerClient as _create, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'
import { env, isSupabaseConfigured } from '@/lib/env'
import { type SupabaseClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client (RSC, Server Actions, Route Handlers).
 * Uses Next.js cookies() for session.
 */
export async function createClient() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }
  const cookieStore = await cookies()
  return _create<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options: CookieOptions }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // The `setAll` method was called from a Server Component (which can't write cookies).
            // The middleware refreshes sessions on every request, so this is non-fatal.
          }
        },
      },
    },
  ) as any as SupabaseClient<Database>
}

/**
 * Returns the authenticated user, or null if anonymous.
 * Use in RSC / Server Actions / Route Handlers.
 */
export async function getUser() {
  if (!isSupabaseConfigured) return null
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
