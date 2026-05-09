import Link from 'next/link'
import { Sparkles, Check, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckoutButtons, ManageBillingButton } from './buttons'
import { getUser } from '@/lib/supabase/server'
import { isStripeConfigured, isSupabaseConfigured } from '@/lib/env'

export const metadata = { title: 'Billing' }

export default async function BillingPage() {
  let plan: 'free' | 'pro' | 'student' | 'annual' = 'free'
  let email: string | null = null
  if (isSupabaseConfigured) {
    const u = await getUser()
    if (u) {
      email = u.email ?? null
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

  return (
    <div className="container space-y-8 py-10">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-white">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and payment method.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={plan === 'free' ? 'secondary' : 'default'} className="text-sm">
              {plan === 'free' ? 'Free' : plan === 'pro' ? 'Pro' : plan === 'student' ? 'Student' : 'Annual'}
            </Badge>
            {email ? (
              <span className="text-sm text-muted-foreground">{email}</span>
            ) : null}
          </div>

          {plan === 'free' ? (
            <p className="text-sm text-muted-foreground">
              You have access to 2 free problems and all fundamentals lessons. Upgrade to
              unlock all 10 problems, unlimited grading, and reference solutions.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              All Pro features are unlocked. Manage payment, invoices, or cancel via the
              billing portal.
            </p>
          )}

          {!isStripeConfigured ? (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
              <p className="font-medium">Stripe not configured</p>
              <p className="mt-1 text-muted-foreground">
                Add <code className="rounded bg-muted px-1">STRIPE_SECRET_KEY</code> and price
                IDs to <code className="rounded bg-muted px-1">.env.local</code> to enable
                checkout. While Stripe is unconfigured the paywall is skipped in dev.
              </p>
            </div>
          ) : plan === 'free' ? (
            <CheckoutButtons />
          ) : (
            <ManageBillingButton />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What&apos;s included</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm md:grid-cols-2">
            <Feature>All 10 hand-curated problems</Feature>
            <Feature>Unlimited AI rubric grading</Feature>
            <Feature>Reference solutions + diff</Feature>
            <Feature>Personalized weak-area dashboard</Feature>
            <Feature>Spaced-repetition drills</Feature>
            <Feature>Priority grading queue</Feature>
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/pricing">
                <Sparkles className="h-4 w-4" />
                Compare plans
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="mailto:hello@sysdesign.gym">
                <ExternalLink className="h-4 w-4" />
                Contact us
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
      <span>{children}</span>
    </li>
  )
}
