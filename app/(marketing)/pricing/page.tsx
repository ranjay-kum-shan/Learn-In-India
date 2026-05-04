import Link from 'next/link'
import { Check, X, Sparkles, Building2, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export const metadata = { title: 'Pricing' }

const tiers = [
  {
    id: 'student',
    name: 'Student',
    price: 12,
    period: '/mo',
    icon: <GraduationCap className="h-5 w-5" />,
    description: '.edu only. The same product, half the price.',
    cta: 'Start with .edu',
    href: '/login?intent=signup&plan=student',
    features: [
      'All 10 problems + future releases',
      'Unlimited AI rubric grading',
      'Reference solutions + diff',
      'Spaced-repetition drills',
      'Community access',
    ],
    notIncluded: ['Mock interviewer (Phase 2)'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 24,
    period: '/mo',
    icon: <Sparkles className="h-5 w-5" />,
    description: 'For job-switching engineers and serious builders.',
    cta: 'Start free trial',
    href: '/login?intent=signup&plan=pro',
    featured: true,
    badge: 'Most popular',
    features: [
      'Everything in Student',
      'AI mock interviewer (when launched)',
      'Personalized weak-area dashboard',
      'Priority grading queue',
      'Cancel any time',
    ],
    notIncluded: [],
  },
  {
    id: 'annual',
    name: 'Pro Annual',
    price: 199,
    period: '/yr',
    icon: <Sparkles className="h-5 w-5" />,
    description: 'Save $89 / year. For multi-cycle prep.',
    cta: 'Save with annual',
    href: '/login?intent=signup&plan=annual',
    features: [
      'Everything in Pro',
      'Save 30% vs monthly',
      'Lock in launch pricing',
      'Two months free',
      'Perfect for the long ramp',
    ],
    notIncluded: [],
  },
]

const teamTier = {
  name: 'Team',
  price: 300,
  period: '/seat / yr',
  description:
    'For engineering orgs standardizing architecture literacy. 5-seat minimum.',
  cta: 'Contact sales',
  href: 'mailto:hello@sysdesign.gym',
  features: [
    'All Pro features for every seat',
    'Admin dashboard, assign problems, track progress',
    'Custom rubrics — upload your own architectures',
    'Google Workspace / Okta SSO',
    'Annual invoicing',
    'Phase 5 — currently in private beta',
  ],
}

export default function PricingPage() {
  return (
    <div className="bg-spotlight">
      <div className="container py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="default" className="mb-4">
            Pricing
          </Badge>
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl text-balance">
            Less than one hour of mock interview.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Two problems free forever — no credit card. Upgrade only when the loop hooks
            you. Every plan includes unlimited AI grading.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={cn(
                'relative flex flex-col bg-card/60',
                tier.featured && 'border-brand-500/50 ring-1 ring-brand-500/30',
              )}
            >
              {tier.badge ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="bg-brand-500 text-white">
                    {tier.badge}
                  </Badge>
                </div>
              ) : null}
              <CardContent className="flex flex-1 flex-col p-7">
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className={cn(
                      'inline-flex h-10 w-10 items-center justify-center rounded-lg',
                      tier.featured
                        ? 'bg-brand-500 text-white'
                        : 'bg-brand-500/10 text-brand-500',
                    )}
                  >
                    {tier.icon}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{tier.name}</h3>
                    <p className="text-xs text-muted-foreground">{tier.description}</p>
                  </div>
                </div>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">
                    ${tier.price}
                  </span>
                  <span className="text-muted-foreground">{tier.period}</span>
                </div>

                <ul className="mb-6 flex-1 space-y-2.5 text-sm">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                  {tier.notIncluded.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-muted-foreground line-through"
                    >
                      <X className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={tier.featured ? 'gradient' : 'outline'}
                  className="w-full"
                  size="lg"
                >
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team tier */}
        <div className="mx-auto mt-10 max-w-6xl">
          <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-card to-card/60">
            <CardContent className="grid gap-6 p-8 md:grid-cols-3 md:p-10">
              <div className="md:col-span-1">
                <div className="mb-3 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold">{teamTier.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{teamTier.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold">${teamTier.price}</span>
                  <span className="text-muted-foreground">{teamTier.period}</span>
                </div>
                <Button asChild variant="outline" className="mt-6">
                  <Link href={teamTier.href}>{teamTier.cta}</Link>
                </Button>
              </div>
              <ul className="grid gap-2 text-sm md:col-span-2 md:grid-cols-2">
                {teamTier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Comparison */}
        <div className="mx-auto mt-20 max-w-3xl">
          <h2 className="mb-6 text-center font-display text-2xl font-semibold tracking-tight">
            Common questions
          </h2>
          <div className="divide-y divide-border/60 rounded-xl border border-border/60 bg-card/40">
            {faqs.map((it) => (
              <details key={it.q} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between text-left">
                  <span className="font-medium">{it.q}</span>
                  <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{it.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const faqs = [
  {
    q: 'Is there a free trial?',
    a: 'Yes — the free plan includes 2 problems forever, plus all fundamentals lessons. No credit card needed.',
  },
  {
    q: 'Can I cancel any time?',
    a: 'Yes. Stripe Customer Portal — one click. Pro-rated refund on annual.',
  },
  {
    q: 'Do you offer student discounts?',
    a: '$12/mo with .edu verification. Same product, half the price.',
  },
  {
    q: 'How does the team plan work?',
    a: '$300 / seat / year, 5-seat minimum, annual invoicing. Includes admin dashboard and custom rubric upload. Currently a private beta — reach out.',
  },
  {
    q: "What's your refund policy?",
    a: "Cancel within 14 days for a full refund, no questions. After that, it's pro-rated for annual; monthly stops billing immediately.",
  },
]
