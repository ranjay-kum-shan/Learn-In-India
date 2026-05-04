# SysDesign Gym

> **Practice system design like Duolingo.** Drag-drop architectures on an interactive canvas. Get rubric-graded by an AI staff engineer in 30 seconds. Walk into your interview fluent.

[![Next.js 14](https://img.shields.io/badge/Next.js-14-000)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ecf8e)](https://supabase.com)

This is the v0 (MVP) of the platform described in [`DOCs/system-design-platform-roadmap.md`](DOCs/system-design-platform-roadmap.md). It implements the full MVP scope from §3 of that doc:

- Stunning marketing landing + pricing
- Email + Google auth (Supabase)
- 10 hand-curated problems with rubrics + reference solutions
- Interactive design canvas with typed shapes (Service, DB, Cache, Queue, etc.)
- AI rubric grading via Claude with tool-use (server-side, SSE-streamed)
- Reference solution viewer with read-only diagram
- Personalized dashboard (stats, weak areas, activity)
- Stripe paywall (free / Pro / Student / Annual) — runs in **mock mode** when keys aren't configured

---

## Quick start (local)

You can run the app **with zero configuration** — auth and payments will be skipped, the AI grader will fall back to a deterministic mock, and content is read directly from `/content`. Perfect for exploring the UI.

```bash
pnpm install        # or npm install / yarn
cp .env.example .env.local      # edit with your keys (or leave blank)
pnpm dev
# open http://localhost:3000
```

The first thing you'll see is the landing page. Hit "Start practicing free", then "Skip — try the demo" on the login screen to enter the app without auth.

### Required Node version

Node 20+. Run `nvm use 20` if you have nvm.

---

## What you need to wire up to go to production

### 1. Supabase (auth + database)

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and paste/run [`supabase/schema.sql`](supabase/schema.sql).
3. Then run [`supabase/seed.sql`](supabase/seed.sql) to populate problem metadata.
4. Project Settings → API → copy the URL, anon key, and service-role key into `.env.local`.
5. Authentication → Providers → enable Google (optional), set the redirect URL to `https://your-domain.com/auth/callback`.
6. Run the content sync to upsert rubrics + criteria into the DB:

```bash
pnpm content:sync
```

### 2. Anthropic Claude (AI grading)

1. Get an API key from [console.anthropic.com](https://console.anthropic.com).
2. Set `ANTHROPIC_API_KEY` in `.env.local`.
3. Defaults: `claude-sonnet-4-6` for grading, `claude-opus-4-6` for retry. Override via `ANTHROPIC_GRADING_MODEL` / `ANTHROPIC_REASONING_MODEL`.

If `ANTHROPIC_API_KEY` is unset, the grader falls back to a deterministic mock so the UI demo works without spend.

### 3. Stripe (payments)

Stripe is **optional** for development. The paywall is bypassed in local dev when `NEXT_PUBLIC_BYPASS_PAYWALL=true` is set, or when Stripe keys are missing.

For production:

1. Stripe Dashboard → Products. Create:
   - **Pro** — $24/mo recurring → copy price id to `STRIPE_PRICE_PRO_MONTHLY`.
   - **Student** — $12/mo recurring → `STRIPE_PRICE_STUDENT_MONTHLY`.
   - **Annual** — $199/yr recurring → `STRIPE_PRICE_PRO_ANNUAL`.
2. Developers → API keys → secret key into `STRIPE_SECRET_KEY`, publishable into `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Developers → Webhooks → add endpoint `https://your-domain.com/api/stripe/webhook`. Copy signing secret into `STRIPE_WEBHOOK_SECRET`. Subscribe to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Local testing — forward webhooks with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Project structure

```
.
├── app/                         Next.js 14 App Router
│   ├── (marketing)/             public landing, pricing, about
│   ├── auth/                    callback + logout routes
│   ├── login/                   sign-in page
│   ├── dashboard/               authed dashboard
│   ├── problems/                listing + detail (canvas workbench)
│   ├── lessons/                 fundamentals lessons
│   ├── billing/                 plan + checkout
│   ├── api/
│   │   ├── grade/               SSE-streamed AI grading endpoint
│   │   ├── solutions/[slug]/    reference solution loader
│   │   └── stripe/webhook/      Stripe webhook
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                      shadcn-style primitives
│   ├── marketing/               landing components
│   ├── auth/                    login form
│   ├── app/                     app shell
│   └── canvas/                  design canvas + workbench
├── content/                     authored content (markdown + yaml + json)
│   ├── problems/                10 problem briefs
│   ├── rubrics/                 10 yaml rubrics
│   ├── solutions/               10 reference solutions (md + json)
│   └── lessons/                 fundamentals lessons
├── lib/
│   ├── content/                 loaders + zod schemas
│   ├── data/                    DB-backed read layer with FS fallback
│   ├── db/                      typed query helpers
│   ├── grading/                 anthropic + prompt + zod schemas
│   ├── stripe/                  client + price-id mapping
│   └── supabase/                server / browser / service clients
├── scripts/
│   ├── sync-content.ts          upsert problems+rubrics+criteria into Supabase
│   └── validate-content.ts      validate /content against zod schemas
├── supabase/
│   ├── schema.sql               full DDL + RLS
│   └── seed.sql                 problems metadata
└── middleware.ts                Supabase session refresh + route gating
```

---

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start the Next.js dev server |
| `pnpm build` | Production build |
| `pnpm typecheck` | Strict TS check |
| `pnpm content:validate` | Validate every problem/rubric/solution against zod |
| `pnpm content:sync` | Upsert content into your Supabase project |

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. [vercel.com/new](https://vercel.com/new) → import the repo.
3. Framework: Next.js (auto-detected).
4. Add every env var from `.env.example` in **Project Settings → Environment Variables** (production + preview).
5. Set the Supabase auth redirect URL to your Vercel domain: `https://<project>.vercel.app/auth/callback`.
6. Set the Stripe webhook endpoint to `https://<project>.vercel.app/api/stripe/webhook`.
7. Deploy.

The first deploy will succeed even with placeholder values; the demo flow works without Supabase/Stripe/Anthropic configured.

---

## Adding a new problem

1. Create `content/problems/<slug>.md` with frontmatter (slug, title, difficulty, tags, etc.).
2. Create `content/rubrics/<slug>.yml` with 8–12 criteria.
3. Create `content/solutions/<slug>.md` (narrative) and `content/solutions/<slug>.json` (DesignJSON).
4. Add the slug to `supabase/seed.sql`.
5. Run `pnpm content:validate` then `pnpm content:sync`.

The new problem appears at `/problems/<slug>` immediately.

---

## Architecture notes

- **Single-app structure (not monorepo).** The roadmap suggests `pnpm + Turborepo` once team size grows. For v0, a single Next.js app ships faster. Refactor later — paths and module boundaries are kept clean (`lib/grading/`, `lib/content/`, `components/canvas/`).
- **Canvas.** v0 uses a custom React canvas (drag-drop, click-to-connect) instead of tldraw. Reasoning: zero dep weight, full control over the DesignJSON serialization, no commercial-license question. Swappable to tldraw later by replacing `components/canvas/design-canvas.tsx`; the store/serializer interface stays.
- **Grading.** Uses Anthropic SDK tool-use forced output (`tool_choice: { type: 'tool' }`). Validated by zod; one retry on Opus if Sonnet output fails the schema.
- **Persistence is optional.** Without Supabase, content reads from the filesystem; submissions don't persist. With Supabase, submissions and scores write to Postgres via service-role client from the grade route.

---

## Roadmap (next 3 months)

See [`DOCs/system-design-platform-roadmap.md`](DOCs/system-design-platform-roadmap.md) for the full 12-month plan. The short version:

- **Phase 2:** AI mock interviewer (voice), spaced-repetition flashcards, skill tree, 25 problems.
- **Phase 3:** peer review, public design gallery, weekly newsletter, referral program.
- **Phase 4:** React Native mobile companion (lessons + flashcards + audio mock interviewer; no canvas).
- **Phase 5:** B2B teams, custom rubrics, SSO.

---

## License

Proprietary. © 2026 SysDesign Gym.
