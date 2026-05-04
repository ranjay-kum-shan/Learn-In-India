'use server'

import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getStripe, priceIdFor, type PlanKey } from '@/lib/stripe/client'
import { env, isStripeConfigured, isSupabaseConfigured } from '@/lib/env'
import { AppError } from '@/lib/errors'

export async function startCheckout(plan: PlanKey) {
  if (!isStripeConfigured) {
    throw new AppError(
      'stripe.not_configured',
      'Stripe is not configured. Add Stripe keys to .env.local to enable payments.',
    )
  }
  if (!isSupabaseConfigured) {
    throw new AppError('auth.unauthenticated', 'Auth is required for checkout')
  }
  const user = await getUser()
  if (!user) throw new AppError('auth.unauthenticated', 'Sign in to upgrade')

  const sb = createServiceClient()
  const { data: profile } = await sb
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()
  let customerId = profile?.stripe_customer_id ?? null
  const stripe = getStripe()
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { user_id: user.id },
    })
    customerId = customer.id
    await sb.from('users').update({ stripe_customer_id: customerId }).eq('id', user.id)
  }

  const priceId = priceIdFor(plan)
  if (!priceId) {
    throw new AppError('stripe.not_configured', `Missing price id for plan ${plan}`)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard?welcome=1`,
    cancel_url: `${env.NEXT_PUBLIC_SITE_URL}/pricing`,
    allow_promotion_codes: true,
    automatic_tax: { enabled: false },
  })
  if (!session.url) throw new AppError('stripe.unknown', 'No checkout URL returned')
  redirect(session.url)
}

export async function openBillingPortal() {
  if (!isStripeConfigured)
    throw new AppError('stripe.not_configured', 'Stripe is not configured')
  if (!isSupabaseConfigured)
    throw new AppError('auth.unauthenticated', 'Auth required')
  const user = await getUser()
  if (!user) throw new AppError('auth.unauthenticated', 'Sign in')
  const sb = createServiceClient()
  const { data } = await sb
    .from('users')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .maybeSingle()
  if (!data?.stripe_customer_id) {
    throw new AppError('stripe.not_configured', 'No Stripe customer for user')
  }
  const stripe = getStripe()
  const portal = await stripe.billingPortal.sessions.create({
    customer: data.stripe_customer_id,
    return_url: `${env.NEXT_PUBLIC_SITE_URL}/billing`,
  })
  redirect(portal.url)
}
