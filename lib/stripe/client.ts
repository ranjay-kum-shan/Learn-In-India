import 'server-only'
import Stripe from 'stripe'
import { env, isStripeConfigured } from '@/lib/env'

let _stripe: Stripe | null = null

export function getStripe() {
  if (!isStripeConfigured) {
    throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY.')
  }
  if (!_stripe) {
    _stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-09-30.acacia' as Stripe.LatestApiVersion,
      typescript: true,
    })
  }
  return _stripe
}

export type PlanKey = 'pro_monthly' | 'student_monthly' | 'pro_annual'

export function priceIdFor(plan: PlanKey): string | undefined {
  switch (plan) {
    case 'pro_monthly':
      return env.STRIPE_PRICE_PRO_MONTHLY
    case 'student_monthly':
      return env.STRIPE_PRICE_STUDENT_MONTHLY
    case 'pro_annual':
      return env.STRIPE_PRICE_PRO_ANNUAL
  }
}

export function planKeyFromPriceId(priceId: string | null | undefined):
  | 'pro'
  | 'student'
  | 'annual'
  | 'free' {
  if (!priceId) return 'free'
  if (priceId === env.STRIPE_PRICE_PRO_MONTHLY) return 'pro'
  if (priceId === env.STRIPE_PRICE_STUDENT_MONTHLY) return 'student'
  if (priceId === env.STRIPE_PRICE_PRO_ANNUAL) return 'annual'
  // Unknown price id — log + safest fallback (don't silently grant access)
  console.warn(`Unknown Stripe price id: ${priceId}, defaulting to free`)
  return 'free'
}
