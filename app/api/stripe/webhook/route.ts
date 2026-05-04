import { type NextRequest } from 'next/server'
import type Stripe from 'stripe'
import { getStripe, planKeyFromPriceId } from '@/lib/stripe/client'
import { createServiceClient } from '@/lib/supabase/service'
import { env, isStripeConfigured, isSupabaseConfigured } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!isStripeConfigured || !isSupabaseConfigured) {
    return new Response('Stripe or Supabase not configured', { status: 501 })
  }

  const sig = req.headers.get('stripe-signature')
  if (!sig) return new Response('missing signature', { status: 400 })

  const stripe = getStripe()
  const raw = await req.text()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(raw, sig, env.STRIPE_WEBHOOK_SECRET!)
  } catch (e) {
    console.error('Webhook signature verification failed:', e)
    return new Response('bad signature', { status: 400 })
  }

  const sb = createServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const obj = event.data.object as Stripe.Checkout.Session | Stripe.Subscription
        let sub: Stripe.Subscription | null = null
        if ('subscription' in obj && typeof obj.subscription === 'string') {
          sub = await stripe.subscriptions.retrieve(obj.subscription)
        } else if (event.type !== 'checkout.session.completed') {
          sub = obj as Stripe.Subscription
        }
        if (!sub) break
        const priceId = sub.items.data[0]?.price.id ?? null
        const plan = planKeyFromPriceId(priceId)
        await sb
          .from('users')
          .update({ plan })
          .eq('stripe_customer_id', sub.customer as string)
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await sb
          .from('users')
          .update({ plan: 'free' })
          .eq('stripe_customer_id', sub.customer as string)
        break
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        // Could mark plan or send an email; minimal handling for now.
        console.warn('Payment failed for customer', invoice.customer)
        break
      }
      default:
        // ignore other event types
        break
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return new Response('error', { status: 500 })
  }

  return Response.json({ received: true })
}
