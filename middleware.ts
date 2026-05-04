import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { env, isSupabaseConfigured } from '@/lib/env'

/**
 * Refreshes the Supabase session cookie on every request, and gates app routes:
 *  - /(app)/* requires auth
 *  - /api/grade requires auth
 *
 * Paywall enforcement happens in route logic, not here, because we want to
 * differentiate "redirect to /pricing" (UI) from "401 from API".
 */
export async function middleware(req: NextRequest) {
  let response = NextResponse.next({ request: req })

  if (!isSupabaseConfigured) {
    // In dev without Supabase, just pass through.
    return response
  }

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          response = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = req.nextUrl
  const path = url.pathname

  const isAppRoute =
    path.startsWith('/dashboard') ||
    path.startsWith('/problems/attempt/') ||
    path.startsWith('/billing') ||
    path.startsWith('/account') ||
    path.startsWith('/review')

  if (isAppRoute && !user) {
    const next = encodeURIComponent(path + url.search)
    return NextResponse.redirect(new URL(`/login?next=${next}`, req.url))
  }

  // Redirect signed-in users from /login → /dashboard (unless they're switching plan)
  if (path === '/login' && user && !url.searchParams.get('plan')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     *  - _next (next internals)
     *  - api (we handle auth in route handlers as needed)
     *  - static files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|gif)$).*)',
  ],
}
