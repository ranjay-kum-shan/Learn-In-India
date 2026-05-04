# Launch checklist

Use this before flipping the production switch. Every box must be checked before a public Show HN / Product Hunt post.

## Infrastructure

- [ ] Vercel project created, repo connected, production branch set
- [ ] Custom domain configured + SSL active
- [ ] Production Supabase project created (separate from dev)
- [ ] `supabase/schema.sql` applied to production DB
- [ ] `supabase/seed.sql` applied
- [ ] `pnpm content:sync` run against production
- [ ] All env vars set in Vercel (Production env): Supabase, Anthropic, Stripe, Site URL

## Auth

- [ ] Supabase Auth → Google provider enabled, redirect URL set to production domain
- [ ] Magic-link email template customized
- [ ] First sign-up creates a row in `public.users` (verified manually)
- [ ] Logout redirects to `/`

## Payments (Stripe)

- [ ] Switched to live keys
- [ ] Products `Pro $24/mo`, `Student $12/mo`, `Annual $199/yr` created in live mode
- [ ] Webhook endpoint registered in live mode → secret stored
- [ ] Test purchase from a clean account → plan flips to `pro` in `public.users`
- [ ] Cancel via Customer Portal → plan flips back to `free`

## Content quality

- [ ] All 10 rubrics reviewed by a senior engineer
- [ ] All 10 reference solutions read end-to-end
- [ ] `pnpm content:validate` passes with zero errors
- [ ] Each problem manually graded with both an "excellent" and "weak" sample design — feedback is sane

## Performance

- [ ] Lighthouse score on landing ≥ 90 (perf, a11y, SEO)
- [ ] First contentful paint < 2s on 3G simulation
- [ ] Canvas page interactive within 3s

## Smoke test (manual, run on prod)

- [ ] Land on home → load animations correct
- [ ] Sign up via Google → land on `/dashboard`
- [ ] Open URL Shortener problem (free) → canvas loads
- [ ] Drop 6 components, wire 4 edges, write a 100-word transcript
- [ ] Click Submit → progress bar streams; result appears < 30s
- [ ] Score visible per criterion; reference solution toggles open
- [ ] Open a Pro problem → paywall gate redirects to `/pricing`
- [ ] Complete Stripe checkout (test card 4242…) → redirected to dashboard with welcome
- [ ] Open same Pro problem → unlocked; submit a design; second submission completes
- [ ] Visit `/billing` → `Manage billing` opens Stripe portal
- [ ] Cancel subscription → on next page load, plan back to free, paywall re-enforced

## Observability

- [ ] Sentry connected (server, client, edge)
- [ ] PostHog identifying users on login
- [ ] First test errors arrive in Sentry
- [ ] Key events firing in PostHog: `problem_viewed`, `submission_created`, `grade_completed`, `paywall_hit`, `checkout_started`

## Legal / trust

- [ ] Privacy policy live
- [ ] Terms of service live
- [ ] Contact email or form working
- [ ] Stripe Tax checked (if applicable)

## Marketing

- [ ] Landing page metadata (OG image, Twitter card) verified via [opengraph.xyz](https://opengraph.xyz)
- [ ] Show HN draft written
- [ ] Product Hunt assets prepared
- [ ] Founder LinkedIn post drafted
- [ ] Twitter thread drafted with the canvas demo GIF
