import { AppShell } from '@/components/app/app-shell'
import { getUser } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/env'

export default async function BillingLayout({ children }: { children: React.ReactNode }) {
  let user: { email: string; display_name?: string | null; avatar_url?: string | null } | null = null
  let plan: 'free' | 'pro' | 'student' | 'annual' | undefined = undefined
  if (isSupabaseConfigured) {
    const u = await getUser()
    if (u) {
      user = {
        email: u.email ?? '',
        display_name: u.user_metadata?.full_name ?? null,
        avatar_url: u.user_metadata?.avatar_url ?? null,
      }
      try {
        const { createClient } = await import('@/lib/supabase/server')
        const sb = await createClient()
        const { data } = await sb.from('users').select('plan').eq('id', u.id).maybeSingle()
        plan = (data?.plan as typeof plan) ?? 'free'
      } catch {
        plan = 'free'
      }
    }
  }
  return <AppShell user={user} plan={plan}>{children}</AppShell>
}
