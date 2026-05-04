# Copilot Build Guide — Interactive System Design Learning Platform

**Audience:** You (the founder). A competent full-stack engineer who has used GitHub Copilot for autocompletes but has never driven Copilot through a project this large.

**Goal:** Take you from an empty folder to a deployed v0 of the platform — *Duolingo + Figma + a senior staff engineer in your pocket, for system design* — in 8–12 weeks, using GitHub Copilot (chat + agent mode) inside VSCode as your primary co-pilot.

**Stack you are building toward:** Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui + Zustand + React Query, Supabase (Postgres + Auth + Storage), Stripe, tldraw with custom typed shapes, Anthropic Claude (Sonnet for grading, Opus for hard reasoning), Upstash Redis, Resend, Sentry + PostHog, Vercel.

**MVP scope (the "definition of done" for this guide):** 10 hand-curated problems, AI rubric grading, reference solution viewer, ~15 lessons, auth + Stripe paywall (2 free problems), dashboard, landing page.

---

## 0. How to use Copilot effectively for this project

### 0.1 VSCode setup (do this first, once)

| Extension | Why | Notes |
|---|---|---|
| `GitHub Copilot` | Inline completions | Sign in with the GitHub account that holds your Copilot Pro/Business subscription. |
| `GitHub Copilot Chat` | Side-panel chat, `/` commands, `@workspace` | This is where 80% of your work happens. |
| `GitHub Copilot — Agent mode` | Multi-step file edits, runs commands | Toggle in the Chat panel header (drop-down → "Agent"). Requires a recent VSCode + Copilot version. |
| `Continue` *(optional alt)* | Local + multi-model (Claude, GPT-4o, local) | Keep installed as a fallback when Copilot fumbles a domain it doesn't know — e.g., tldraw shape SDK. |
| `Cursor` *(optional alt)* | Whole-file edits, `Cmd-K`, better long-context | If you find Copilot's context window painful, the entire flow in this doc transfers to Cursor 1:1 — same prompts, same `.cursorrules` instead of `copilot-instructions.md`. |

### 0.2 Settings worth flipping

```jsonc
// .vscode/settings.json
{
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "github.copilot.chat.experimental.codeGeneration.instructionFiles": true,
  "github.copilot.advanced": { "length": 500 },
  "editor.inlineSuggest.enabled": true,
  "editor.formatOnSave": true,
  "typescript.tsserver.maxTsServerMemory": 8192
}
```

### 0.3 When to use which mode

| Mode | Use it for | Don't use it for |
|---|---|---|
| **Inline (`Tab`)** | Finishing a function whose signature is obvious; boilerplate JSX; tests that follow a clear pattern. | Anything new — it'll guess wrong and you'll read garbage. |
| **Chat (side panel)** | Anything that requires *thinking* — schema design, picking a library, debugging, architecture. Also: scaffolding files when you want to read the diff before applying. | One-line completions. |
| **Agent mode** | Multi-file changes (e.g., "wire this new endpoint into the dashboard, the API, and the types package"). Running migrations. Installing deps. | Anything where you don't already have a clear mental model — agent mode is fast at doing the *wrong* thing across 12 files. |

**Rule of thumb:** Chat to design → Inline / Agent to execute. Never the reverse.

### 0.4 Prompting style — the only 5 rules that matter

1. **Always give file paths.** "Add a function" is useless. "In `apps/web/lib/grading/score.ts`, add `scoreSubmission(submission: Submission, rubric: Rubric): Promise<ScoreResult>`" gets correct code.
2. **Paste the schema, not a description of it.** Drop the actual Zod schema, SQL `CREATE TABLE`, or TypeScript type into the prompt. Copilot is terrible at inferring schemas, fantastic at consuming them.
3. **Specify the *shape* of the output.** "Return a server action" vs "return a function" produces wildly different code. Mention: server vs client component, RSC vs route handler, pure function vs hook.
4. **Constrain libraries explicitly.** "Use shadcn `<Card>`, not raw divs. Use `react-hook-form` + Zod resolver, not local `useState`." Copilot defaults to the most popular thing on GitHub, which is rarely your stack.
5. **Reference the instructions file.** When Copilot drifts, paste `@workspace .github/copilot-instructions.md` and add: "follow these conventions exactly."

### 0.5 The single most important file: `.github/copilot-instructions.md`

VSCode Copilot reads this on every chat turn (when `useInstructionFiles` is on, see 0.2). It is your persistent system prompt. Write it once, refine it weekly. Template in §2.

---

## 1. Monorepo structure

Use **pnpm + Turborepo**. Set this up before writing any feature code so Copilot has a sane skeleton to slot files into.

```
sysdesign-gym/
├── .github/
│   ├── copilot-instructions.md      ← read by Copilot on every turn
│   └── workflows/ci.yml
├── .vscode/settings.json
├── apps/
│   └── web/                          ← Next.js 14 App Router
│       ├── app/
│       │   ├── (marketing)/          ← landing, pricing, /about
│       │   ├── (app)/                ← authed: /problems, /problems/[slug], /dashboard
│       │   ├── api/
│       │   │   ├── grade/route.ts
│       │   │   ├── stripe/webhook/route.ts
│       │   │   └── auth/callback/route.ts
│       │   └── layout.tsx
│       ├── components/               ← app-specific only; reusable goes to packages/ui
│       ├── lib/
│       │   ├── supabase/             ← server + browser clients
│       │   ├── stripe/
│       │   ├── grading/              ← prompt templates, scoring, eval fixtures
│       │   └── content/              ← problem + lesson loaders
│       ├── middleware.ts             ← auth + paywall gates
│       └── content/                  ← markdown problems + YAML rubrics
│           ├── problems/url-shortener.md
│           ├── rubrics/url-shortener.yml
│           └── lessons/01-latency-vs-throughput.md
├── packages/
│   ├── db/                           ← Supabase schema, migrations, generated types
│   │   ├── schema.sql
│   │   ├── migrations/
│   │   └── types.ts                  ← `supabase gen types typescript`
│   ├── ai/                           ← Anthropic client, prompt templates, schemas
│   │   ├── client.ts
│   │   ├── prompts/grade.ts
│   │   └── schemas.ts                ← Zod schemas for Claude tool-use
│   ├── canvas/                       ← tldraw custom shapes + serialization
│   │   ├── shapes/                   ← Service, Database, Cache, Queue, LB, Client, Storage
│   │   ├── serialize.ts              ← canvas → DesignJSON
│   │   └── index.ts
│   ├── ui/                           ← shadcn primitives + cross-app components
│   └── config/                       ← tsconfig, eslint, tailwind, prettier
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

**Why this matters for Copilot:** When you ask Copilot to "add a custom shape," it can read `packages/canvas/shapes/service.ts` as a template and produce a matching file. With a flat repo, Copilot guesses.

---

## 2. The `.github/copilot-instructions.md` template

Paste this verbatim into `.github/copilot-instructions.md`. Edit the **Domain Glossary** as the product evolves.

```markdown
# Project: SysDesign Gym

You are a senior full-stack TypeScript engineer pairing with the founder.
Be concise. Show diffs, not full files, unless asked.

## Stack (do not deviate without asking)
- Next.js 14 App Router, React Server Components by default
- TypeScript strict (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` on)
- Tailwind CSS only — no CSS modules, no styled-components, no inline `style={}`
- shadcn/ui for primitives; lucide-react for icons
- Zustand for client state; React Query for server cache
- Supabase (Postgres + Auth + Storage); use the SSR helpers from `@supabase/ssr`
- Stripe via `stripe` SDK + webhooks; Stripe Customer Portal for plan changes
- tldraw v2 + custom shape SDK (in `packages/canvas`)
- Anthropic SDK (`@anthropic-ai/sdk`); Sonnet for grading, Opus for hard reasoning
- Upstash Redis for rate-limit + grading cache
- Sentry, PostHog, Resend
- Hosted on Vercel; pnpm + Turborepo monorepo

## Conventions
- **No `any`.** Use `unknown` + Zod parse on every external boundary (API in/out, Supabase rows hitting client, Claude responses, env vars).
- **Server-first.** Default to RSC. Add `"use client"` only when you need state, refs, or browser APIs. Justify it in a one-line comment.
- **Server Actions over route handlers** for mutations from the same app. Route handlers only for webhooks, third-party callbacks, and public APIs.
- **Errors:** Throw `AppError` (defined in `packages/ui/lib/errors.ts`) with a stable `code`. Never throw raw `Error` from server code. Always return typed `Result<T, AppError>` from `lib/` functions.
- **Files:** kebab-case. Components: `PascalCase.tsx`. Hooks: `use-thing.ts`. Tests: `*.test.ts` colocated.
- **Imports:** `@/*` alias for `apps/web`, `@db/*`, `@ai/*`, `@canvas/*`, `@ui/*` for packages.
- **Commits:** Conventional Commits (`feat(canvas):`, `fix(grading):`, `chore:`).
- **Tests:** Vitest. Don't write tests unless I ask, but when you do, follow the AAA pattern and use the fixtures in `apps/web/lib/grading/fixtures/`.

## Domain Glossary
- **Problem** — A system design prompt (e.g., "Design TinyURL"). Stored as markdown in `content/problems/`.
- **Rubric** — YAML file enumerating criteria a Problem is graded on.
- **Criterion** — A single rubric line item (`id`, `title`, `weight`, `signals[]`, `anti_signals[]`).
- **Submission** — A user's serialized canvas + transcript at one point in time.
- **DesignJSON** — The serialized canvas: `{ nodes: Node[], edges: Edge[], notes: Note[] }`.
- **Score** — `{ criterion_id, score: 0-3, evidence: string, suggestion: string }[]`.
- **Reference Solution** — A canonical DesignJSON + narrative for each Problem.

## Persistent reminders
- Every Claude call: temperature 0.2, system prompt loaded from `packages/ai/prompts/`, output validated by Zod tool-use schema.
- Every DB query: typed via generated `Database` type. No raw strings unless `// @sql-safe`.
- Every public route: rate-limited via `lib/ratelimit.ts`.
- Never log PII. Never log full Claude prompts (token cost). Log `prompt_hash` instead.
- When unsure, ask before writing. Don't invent file paths or library APIs.
```

---

## 3. The Prompt Playbook

Each prompt below is **a single Copilot Chat turn**. Run them in order. After each, **read the diff before accepting**. If output drifts, push back with the "If Copilot does X" note.

> **Convention:** code blocks marked `prompt` are what you paste into Copilot Chat. Anything else is for you.

---

### Phase A — Bootstrap

#### Prompt A1 — Initialize the monorepo

**Goal:** pnpm + Turborepo skeleton, Next.js app, shared packages.
**Pre:** Empty folder, `pnpm`, Node 20+ installed.

```prompt
Initialize a pnpm + Turborepo monorepo named `sysdesign-gym` with:
- apps/web — Next.js 14 (App Router, TS strict, Tailwind, src-less, ESLint), use `pnpm create next-app@latest`
- packages: db, ai, canvas, ui, config
- Root `tsconfig.base.json` with path aliases `@/*`, `@db/*`, `@ai/*`, `@canvas/*`, `@ui/*`
- Each package: `package.json` (private, `"main": "./index.ts"`), minimal `index.ts`
- Root `turbo.json` with `dev`, `build`, `lint`, `typecheck`, `test` pipelines
- `pnpm-workspace.yaml`
- `.gitignore`, `.editorconfig`, `.nvmrc` (20)
Show the full file tree, then create files. Do not install shadcn or Supabase yet.
```

**Verify:** `pnpm install && pnpm -r typecheck` passes. `pnpm dev` boots Next.js on :3000.
**Pitfall:** Copilot loves to use `npm` or `yarn` workspaces. If it does, reply: "Use pnpm workspaces only. Re-do `package.json` files and root `pnpm-workspace.yaml`."

---

#### Prompt A2 — Tooling: lint, format, hooks, CI

**Goal:** ESLint + Prettier + Husky + lint-staged + GitHub Actions CI.

```prompt
Add to the root:
- ESLint 9 flat config (`eslint.config.mjs`) extending `next/core-web-vitals`, `@typescript-eslint/strict`, with rules: no-explicit-any: error, no-floating-promises: error, consistent-type-imports: error.
- Prettier with Tailwind plugin.
- Husky + lint-staged: pre-commit runs `eslint --fix` + `prettier --write` on staged files; commit-msg enforces Conventional Commits via `@commitlint/config-conventional`.
- `.github/workflows/ci.yml`: matrix Node 20, runs `pnpm install --frozen-lockfile`, `pnpm -r typecheck`, `pnpm -r lint`, `pnpm -r test`.
Don't install Vitest yet — add a placeholder script.
```

**Verify:** Make a bad commit message (`bad`) — it should be rejected.

---

#### Prompt A3 — shadcn + Tailwind tokens + the instructions file

```prompt
In `apps/web`:
1. Install and init shadcn/ui (style: new-york, base color: slate, RSC: yes, CSS vars: yes).
2. Add components: button, card, dialog, input, label, form, tabs, toast, dropdown-menu, separator, badge, skeleton, sheet, tooltip.
3. Set up `tailwind.config.ts` with custom design tokens: `--brand` (#0EA5E9), spacing scale extension, font family `Geist`.
4. Add `apps/web/app/fonts.ts` loading Geist Sans + Mono.

Then at the repo root, create `.github/copilot-instructions.md` with the contents I will paste next. Wait for me before writing it.
```

After Copilot acknowledges, paste the §2 template. Reply: "Save this as `.github/copilot-instructions.md` exactly. Do not modify."

**Verify:** `apps/web/components/ui/` populated. Reload VSCode so Copilot picks up the instructions file.

---

### Phase B — Database

#### Prompt B1 — Supabase project + schema

**Pre:** Create a Supabase project in the dashboard. Get URL + anon + service role keys. Add to `apps/web/.env.local`.

```prompt
In `packages/db/`, create:
1. `schema.sql` defining these tables (Postgres, all UUIDs default `gen_random_uuid()`, all `created_at timestamptz default now()`):
   - `users` — extends `auth.users` via FK; columns: `id` (PK = auth user id), `email`, `display_name`, `stripe_customer_id`, `plan` enum('free','pro','student','annual'), `created_at`.
   - `problems` — `id`, `slug` unique, `title`, `difficulty` enum('easy','medium','hard'), `tags text[]`, `markdown_path`, `is_free boolean default false`, `created_at`.
   - `rubrics` — `id`, `problem_id` FK, `version int`, `yaml text`, `created_at`. Unique on (problem_id, version).
   - `criteria` — `id`, `rubric_id` FK, `external_id text` (matches YAML id), `title`, `weight numeric`, `category text`.
   - `submissions` — `id`, `user_id` FK, `problem_id` FK, `rubric_id` FK, `design_json jsonb`, `transcript text`, `status` enum('draft','grading','graded','error'), `created_at`, `graded_at`.
   - `scores` — `id`, `submission_id` FK, `criterion_id` FK, `score int check (score between 0 and 3)`, `evidence text`, `suggestion text`.
   - `attempts` — view: per-user-per-problem latest submission summary.
2. RLS: enable on every table. Policies: users can SELECT/INSERT/UPDATE only their own rows in `submissions`/`scores`. `problems`/`rubrics`/`criteria` are SELECT-only for authenticated users. `users` row visible only to owner.
3. `migrations/0001_init.sql` containing the same DDL.
4. `README.md` with `supabase db push` and `supabase gen types typescript --local > types.ts` commands.

Do NOT run the migration yet.
```

**Verify:** Read `schema.sql` end-to-end. Confirm RLS is enabled on every table (the most common Copilot miss).

---

#### Prompt B2 — Generated types + typed client

```prompt
After I run `supabase db push` and `supabase gen types typescript --linked > packages/db/types.ts`:

1. In `apps/web/lib/supabase/`, create:
   - `server.ts` — `createServerClient` using `@supabase/ssr` and `cookies()` from `next/headers`.
   - `browser.ts` — `createBrowserClient`.
   - `service.ts` — service-role client for webhooks/cron only. Throws if used in a Server Component.
   All three export `SupabaseClient<Database>` typed with our generated `Database`.
2. In `apps/web/lib/db/queries.ts`, write typed query helpers:
   - `getProblemBySlug(slug)` — join rubrics + criteria, returns `Result<ProblemFull, AppError>`
   - `getUserSubmissions(userId, problemId?)`
   - `createSubmission(input: CreateSubmissionInput)`
   Each one Zod-validates the row before returning.
```

---

### Phase C — Auth

#### Prompt C1 — Supabase Auth (email + Google) + middleware

```prompt
Wire Supabase Auth in `apps/web`:
1. Configure Google OAuth provider in Supabase (assume I've added redirect URLs).
2. `app/(auth)/login/page.tsx` — Server Component shell + Client Component form using shadcn. Magic link email + "Continue with Google" button.
3. `app/api/auth/callback/route.ts` — handles OAuth + magic-link callback, exchanges code, sets cookies via `@supabase/ssr`, redirects to `/dashboard`.
4. `app/(auth)/logout/route.ts` — POST endpoint that signs out and redirects to `/`.
5. `middleware.ts` — for routes matching `/(app)/.*`, ensure session exists; otherwise redirect to `/login?next=...`. Use `updateSession` pattern from Supabase docs.
6. On first sign-in (in the callback), upsert into `public.users` with `id = auth.uid()`, default plan='free'. Use a Postgres trigger if cleaner — show me both options and recommend one.
```

**Verify:** Sign in with email → see `/dashboard` (404 is fine, we build it later). Check `users` row created.

---

### Phase D — Stripe paywall

#### Prompt D1 — Stripe Checkout + webhooks

```prompt
Add Stripe billing:
1. In Stripe dashboard (instructions only, no API calls): create Products `Pro` ($24/mo), `Student` ($12/mo), `Annual` ($199/yr). Capture price IDs into env vars `STRIPE_PRICE_PRO`, `STRIPE_PRICE_STUDENT`, `STRIPE_PRICE_ANNUAL`.
2. `apps/web/lib/stripe/client.ts` — exports `stripe` (server) using `STRIPE_SECRET_KEY`, API version pinned.
3. Server action `createCheckoutSession(priceId)` in `app/(app)/billing/actions.ts`:
   - Requires session.
   - Creates/reuses `stripe_customer_id` on the `users` row (create Customer if missing).
   - Creates a Checkout Session, mode=subscription, success_url=/dashboard?welcome=1, cancel_url=/pricing.
   - Returns the URL; client redirects.
4. `app/(app)/billing/portal/route.ts` — POST creates a Customer Portal session and redirects.
5. `app/api/stripe/webhook/route.ts`:
   - Verifies signature with `STRIPE_WEBHOOK_SECRET`.
   - Handles: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`.
   - On each, derives `plan` from price ID and UPDATES `users.plan` via service-role client. Idempotent.
   - Returns 200 even on no-op; logs to Sentry on errors.
6. Update `middleware.ts`: for `/problems/[slug]` where `is_free=false`, require `plan != 'free'`. Otherwise redirect to `/pricing`.

Show me the exact Stripe CLI command to forward webhooks locally.
```

**Verify:** Run `stripe listen --forward-to localhost:3000/api/stripe/webhook`. Test card 4242. Confirm `users.plan` flips to `pro`.
**Pitfall:** Copilot will sometimes use the *client* Stripe SDK on the server. Reject and demand the Node SDK. Also: it forgets to verify webhook signatures. Always check.

---

### Phase E — Content layer

#### Prompt E1 — Problem + Rubric loaders

```prompt
In `apps/web/lib/content/`:
1. `schemas.ts` — Zod schemas for:
   - `RubricYAML` = `{ problem: string, version: number, criteria: { id, title, weight, category, signals: string[], anti_signals: string[] }[] }`
   - `ProblemFrontmatter` = `{ slug, title, difficulty, tags: string[], is_free: boolean, estimated_minutes: number }`
2. `problem-loader.ts`:
   - `loadProblem(slug): Promise<{ frontmatter, body, rubric }>` — reads `content/problems/{slug}.md` (gray-matter), reads `content/rubrics/{slug}.yml`, validates both with Zod, returns typed result.
3. `lesson-loader.ts` — same pattern for `content/lessons/*.md`.
4. `sync-content.ts` script (in `apps/web/scripts/`):
   - Walks `content/problems/`, upserts into `problems` + `rubrics` + `criteria` tables.
   - Run via `pnpm content:sync`.
5. Add a `pnpm content:validate` script that loads every problem + rubric and prints errors. Use as a pre-commit step.
```

---

### Phase F — Canvas (the hardest part)

#### Prompt F1 — tldraw integration

```prompt
In `packages/canvas/`:
1. Install `tldraw@latest` + `@tldraw/tldraw`. Read the v2 custom shape docs first; do not assume v1 API.
2. Export `<DesignCanvas>` (client component) — wraps `<Tldraw>`, hides the default shape menu, shows our custom shape palette in a left rail.
3. Set up `customShapeUtils` registration scaffold; we'll add shapes in F2.
4. Persist editor state to a Zustand store keyed by `submissionId` so unmount/remount doesn't lose work.
5. Expose `useCanvasInstance(submissionId)` hook that returns `{ editor, exportJSON(), loadJSON(json) }`.

Use the v2 shape API documented at https://tldraw.dev/docs/shapes — verify the API names (`ShapeUtil`, `defineShape`) before generating code. If unsure, ask me to paste the latest docs snippet.
```

#### Prompt F2 — Custom typed shapes

```prompt
In `packages/canvas/shapes/`, create one file per shape using tldraw v2 `ShapeUtil` pattern:
- `service.ts` — props: `{ name: string, language?: string, instances: number }`
- `database.ts` — props: `{ name: string, kind: 'sql'|'nosql'|'kv'|'graph'|'timeseries', replicas: number }`
- `cache.ts` — props: `{ name: string, kind: 'redis'|'memcached'|'cdn', ttl_s?: number }`
- `queue.ts` — props: `{ name: string, kind: 'kafka'|'sqs'|'rabbit'|'pubsub' }`
- `load_balancer.ts` — props: `{ name: string, algorithm: 'round_robin'|'least_conn'|'ip_hash' }`
- `client.ts` — props: `{ kind: 'web'|'mobile'|'iot'|'cli' }`
- `storage.ts` — props: `{ name: string, kind: 's3'|'gcs'|'block'|'file' }`

For each:
- Strict Zod schema for props.
- Custom render: rounded rect, icon (lucide), name, key annotation. Distinct accent color per shape kind.
- Resize handles, default size 180x80.
- Hover tooltip shows full prop sheet.
- Right-side properties panel auto-generated from the Zod schema (use `react-hook-form` + zodResolver).

Then in `serialize.ts`:
- `exportDesignJSON(editor): DesignJSON` — walks shapes + arrows, produces:
  `{ nodes: { id, type, props, position }[], edges: { id, from, to, label?, props? }[], notes: { id, text, position }[] }`
- `importDesignJSON(editor, json)` — reverse.
- Both validated with Zod schema in `schemas.ts`.

Show me one shape (`service.ts`) end-to-end first; I'll review before you generate the rest.
```

**Pitfall:** Copilot's training data has a lot of tldraw v1. If it imports from `@tldraw/tldraw/v1` or uses `defineShape` incorrectly, stop and paste a current v2 example.

---

### Phase G — AI grading

#### Prompt G1 — Anthropic client + grading prompt

```prompt
In `packages/ai/`:
1. `client.ts` — exports `anthropic` (singleton from `@anthropic-ai/sdk`), throws if `ANTHROPIC_API_KEY` missing.
2. `schemas.ts` — Zod schema `GradingResult`:
   ```
   z.object({
     overall: z.object({ score: z.number().min(0).max(100), summary: z.string() }),
     criteria: z.array(z.object({
       criterion_id: z.string(),
       score: z.number().int().min(0).max(3),
       evidence: z.string(),     // quote/cite parts of design_json
       suggestion: z.string(),
     })),
     missing_concepts: z.array(z.string()),
     strong_areas: z.array(z.string()),
   })
   ```
3. `prompts/grade.ts` — exports `buildGradingPrompt({ problem, rubric, designJSON, transcript })` returning `{ system: string, user: string, tool: AnthropicTool }`. The tool is named `submit_grade` and its `input_schema` is the JSON Schema form of `GradingResult`. Use Anthropic tool-use to force structured output; do NOT parse free-text.
4. `grade.ts` — `gradeSubmission(input): Promise<GradingResult>`:
   - Builds the prompt.
   - Calls `claude-sonnet-4-5` with `tool_choice: { type: 'tool', name: 'submit_grade' }`, temperature 0.2, max_tokens 4096.
   - Extracts the tool_use block, validates with Zod, returns.
   - On Zod failure, retry once with model=`claude-opus-4-6` and a "your previous output failed validation; here are the errors" message.

The system prompt should: establish the grader as a staff engineer interviewer; list rubric criteria with weights; instruct to score each (0=missing, 1=mentioned, 2=correct, 3=excellent + nuance); require evidence to cite specific node IDs from the design_json.
```

#### Prompt G2 — `/api/grade` route + rate limit + cache

```prompt
In `apps/web/app/api/grade/route.ts`:
1. POST handler accepting `{ submissionId: string }`.
2. Auth: require session; verify the submission belongs to this user.
3. Rate-limit via `lib/ratelimit.ts` (Upstash sliding window: 10 grades / hour / user). On 429, return JSON with retry-after.
4. Cache key: `sha256(rubric_id + canonicalized(design_json) + transcript)`. If hit in Upstash, return cached `GradingResult` without calling Claude.
5. Update `submissions.status` → `grading`, then call `gradeSubmission`.
6. On success: write `scores` rows, set `status='graded'`, `graded_at=now()`, cache the result for 7 days, return JSON.
7. On error: set `status='error'`, log to Sentry with `prompt_hash`, return 500.
8. Stream progress via SSE: emit `{phase: 'queued'|'thinking'|'scoring'|'done'}` so the UI can show a progress bar.

In `apps/web/components/grading/grading-runner.tsx` (client), consume the SSE stream and render a shadcn skeleton + progress states.
```

**Verify:** Submit a sample design; grading completes in <30s; `scores` rows written; second identical submission hits cache (<200ms).

---

### Phase H — Reference solution viewer + diff

```prompt
In `apps/web/app/(app)/problems/[slug]/`:
1. Add `solution/page.tsx` — gated: only show after the user has submitted at least once for this problem (check `submissions` count). Otherwise show CTA "Submit your design first".
2. Render the reference solution from `content/solutions/{slug}.md` (markdown narrative) + `content/solutions/{slug}.json` (DesignJSON).
3. Build `<DesignDiff userJSON={...} referenceJSON={...} />` in `packages/canvas/diff.tsx`:
   - Side-by-side <DesignCanvas readOnly /> instances.
   - Compute additive/missing/different node sets by `node.props.name` fuzzy match (Levenshtein <=2) plus type equality.
   - Highlight: green (matched), yellow (partial), red (missing in user), blue (extra in user).
   - Below: a textual list of differences grouped by category.
```

---

### Phase I — Dashboard

```prompt
Build `app/(app)/dashboard/page.tsx`:
- Server Component, fetches via `getUserDashboard(userId)` in `lib/db/queries.ts`.
- Sections:
  1. Hero: "X problems attempted, Y graded, avg score Z".
  2. Recent submissions (table): Problem, Score, Status, Graded at, Action (View).
  3. Weak areas: top 5 rubric categories where the user's avg criterion score is < 1.5. Compute from `scores` joined with `criteria.category`. Surface as shadcn `<Card>`s with a "Practice this" CTA linking to filtered problem list.
  4. Streak / activity heatmap (use `react-calendar-heatmap` or build a minimal one).
- All data fetching in one query helper; do not fan out N+1.
```

---

### Phase J — Landing + pricing

```prompt
Build `app/(marketing)/page.tsx` and `app/(marketing)/pricing/page.tsx`:
- Hero copy: "Practice system design like Duolingo. Get rubric-graded by an AI staff engineer." Subhead: "10 hand-curated FAANG-style problems, instant feedback, no fluff."
- Sections: Problem (interview prep is broken), Solution (3 feature cards: Practice gym, AI grading, Reference solutions), Social proof slot (placeholder), Pricing teaser, FAQ, CTA.
- Pricing page: 3-tier shadcn pricing table (Student $12, Pro $24, Annual $199 — "Save $89"). Each tier: feature list, primary CTA → `/login?plan=pro`.
- Use shadcn marketing patterns; lots of whitespace; generous typography (Geist Sans 18px body).
- All copy in `apps/web/content/marketing.ts` so I can iterate without touching JSX.
```

---

### Phase K — Observability + email

```prompt
Add:
1. Sentry: `@sentry/nextjs` wizard, server + client + edge. Wrap `app/api/*/route.ts` errors. Tag with `userId`, `submissionId` where present.
2. PostHog: `posthog-js` for client; identify on login. Track events: `problem_viewed`, `submission_created`, `grade_completed{score, problem_slug}`, `paywall_hit`, `checkout_started`, `subscription_active`. Define typed `track()` wrapper in `lib/analytics.ts` so events can't drift.
3. Resend: send transactional emails via `lib/email/`:
   - `sendWelcomeEmail(user)` on first sign-in
   - `sendGradeReadyEmail(user, submission)` after grading completes (only if grading took >60s — i.e., user likely closed the tab)
   Templates as React Email components in `packages/ui/emails/`.
```

---

### Phase L — Deploy

```prompt
Walk me through deploying to Vercel:
1. Vercel project linked to this repo, build command `pnpm turbo run build --filter=web...`, output dir `apps/web/.next`.
2. Env vars to set in Vercel (list every one we've used; group by Public / Server / Webhook).
3. Supabase: switch to the production project, run `supabase db push`, set redirect URLs to the Vercel domain.
4. Stripe: switch keys to live, create the same Products/Prices in live mode, register the webhook endpoint pointing to the Vercel URL, capture the live `STRIPE_WEBHOOK_SECRET`.
5. Domain + SSL via Vercel.
6. Smoke checklist (must pass before announcing): sign up via email + Google, view a free problem, submit a design, get a grade in <30s, hit paywall, complete Stripe checkout, see plan flip to pro, view dashboard, view reference solution.

Output the checklist as a markdown file `docs/launch-checklist.md`.
```

---

### Phase M — Seed: URL Shortener as the gold standard

```prompt
Create the first fully worked problem as a template for the next 9:

1. `content/problems/url-shortener.md` — front-matter + body (problem statement, functional/non-functional reqs, constraints, scale assumptions, what to focus on).
2. `content/rubrics/url-shortener.yml` — 8–12 criteria across categories: Requirements clarification, API design, Data model, Encoding scheme, Storage choice, Caching, Read/write path, Scaling reads, Analytics, Edge cases. Each criterion has weight, signals, anti_signals.
3. `content/solutions/url-shortener.md` + `.json` — narrative + a DesignJSON with: Client → CDN → LB → ShortenerService (3 instances) → KV (Redis) cache → SQL/NoSQL store; AnalyticsQueue → AnalyticsConsumer → Warehouse.
4. `apps/web/lib/grading/fixtures/url-shortener/` — three fixtures: `excellent.json`, `mediocre.json`, `wrong.json`, each with the expected `GradingResult` (Vitest snapshot) so we can regression-test the grader.
5. Run `pnpm content:sync`. Verify the problem appears at `/problems/url-shortener`, can be submitted, and returns a graded score.
```

---

## 4. Example "good" outputs for the trickiest prompts

### 4.1 Custom shape (`packages/canvas/shapes/service.ts`) — what good looks like

```ts
import { ShapeUtil, T, HTMLContainer, Rectangle2d } from '@tldraw/tldraw'
import { z } from 'zod'

export const ServiceProps = z.object({
  name: z.string().min(1).max(40),
  language: z.string().optional(),
  instances: z.number().int().min(1).max(10_000).default(1),
})
export type ServiceProps = z.infer<typeof ServiceProps>

export class ServiceShapeUtil extends ShapeUtil<{
  type: 'service'; props: ServiceProps & { w: number; h: number }
}> {
  static override type = 'service' as const
  static override props = {
    name: T.string, language: T.string.optional(), instances: T.number,
    w: T.number, h: T.number,
  }
  getDefaultProps() { return { name: 'Service', instances: 1, w: 180, h: 80 } }
  getGeometry(s) { return new Rectangle2d({ width: s.props.w, height: s.props.h, isFilled: true }) }
  component(s) {
    return (
      <HTMLContainer className="rounded-xl border-2 border-sky-400 bg-sky-50 p-3 text-sm">
        <div className="font-semibold">{s.props.name}</div>
        <div className="text-xs text-slate-500">{s.props.language ?? '—'} · ×{s.props.instances}</div>
      </HTMLContainer>
    )
  }
  indicator(s) { return <rect width={s.props.w} height={s.props.h} rx={12} /> }
}
```

If Copilot returns something without `Rectangle2d` geometry or with v1's `defineShape`, stop and re-prompt.

### 4.2 Stripe webhook handler (sketch)

```ts
// app/api/stripe/webhook/route.ts
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')
  if (!sig) return new Response('missing sig', { status: 400 })
  const raw = await req.text()
  let event
  try { event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!) }
  catch (e) { return new Response('bad sig', { status: 400 }) }

  const db = createServiceClient()
  switch (event.type) {
    case 'checkout.session.completed':
    case 'customer.subscription.updated': {
      const sub = event.type === 'checkout.session.completed'
        ? await stripe.subscriptions.retrieve((event.data.object as Stripe.Checkout.Session).subscription as string)
        : event.data.object as Stripe.Subscription
      const plan = priceIdToPlan(sub.items.data[0]?.price.id)
      await db.from('users').update({ plan, stripe_customer_id: sub.customer as string })
        .eq('stripe_customer_id', sub.customer as string)
      break
    }
    case 'customer.subscription.deleted':
      await db.from('users').update({ plan: 'free' }).eq('stripe_customer_id', (event.data.object as Stripe.Subscription).customer as string)
      break
  }
  return Response.json({ received: true })
}
```

Push back if Copilot: doesn't verify signature, parses JSON (must be raw body), or uses the anon client (must be service role).

### 4.3 Claude grading call (skeleton)

```ts
const tool: Anthropic.Tool = {
  name: 'submit_grade',
  description: 'Submit a structured grading of the design.',
  input_schema: zodToJsonSchema(GradingResult) as Anthropic.Tool.InputSchema,
}
const res = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  temperature: 0.2,
  max_tokens: 4096,
  system,
  messages: [{ role: 'user', content: user }],
  tools: [tool],
  tool_choice: { type: 'tool', name: 'submit_grade' },
})
const block = res.content.find((b) => b.type === 'tool_use')
if (!block || block.type !== 'tool_use') throw new AppError('grading.no_tool_use')
return GradingResult.parse(block.input)
```

If Copilot returns "parse the text response with regex," reject hard.

---

## 5. Prompts you should NOT use

| Antipattern | Why it fails | Do this instead |
|---|---|---|
| "Build me the whole app" | Copilot fabricates files, invents API surfaces, hallucinates schemas. | Use the playbook above, one phase at a time. |
| "Add Stripe" | No price IDs, no idea which products, no webhook plan. | Paste the exact products + price names + which env vars. |
| "Make it look nice" | You'll get random Tailwind classes. | "Use shadcn `<Card>` with `bg-muted/30` and `space-y-6`. Hero font `text-5xl tracking-tight`." |
| "Write tests" (alone) | Bloated tests of trivial code. | "Write Vitest tests for `gradeSubmission` against fixtures `excellent.json`, `mediocre.json`, `wrong.json`. Assert overall score within ±5 of expected." |
| "Refactor this file" | Copilot rewrites with different conventions. | "Refactor `route.ts`: extract `parseGradeRequest`, `runGrading`, `persistScores` as pure functions. Keep public signature identical." |
| "Fix the bug" with no repro | Random patches that pass type-check, fix nothing. | Paste the error, the failing input, and the expected output. |
| Pasting your `.env.local` into chat | Leaks secrets to the model provider. | Reference variable names only. |

---

## 6. Eval / quality harness

The AI grader is the product. Treat it like one.

1. **Golden fixtures:** in `apps/web/lib/grading/fixtures/{problem-slug}/`, store at least 3 reference designs per problem: `excellent.json`, `mediocre.json`, `wrong.json`, each with an `expected.json` containing the target `overall.score` (±5 tolerance) and the criteria you expect to score 0 vs 3.

2. **Eval script** (`apps/web/scripts/eval-grader.ts`):

```ts
// Pseudo-shape — ask Copilot to generate the real one
for (const fixture of loadAllFixtures()) {
  const result = await gradeSubmission(fixture.input)
  assertWithinTolerance(result.overall.score, fixture.expected.overall.score, 5)
  for (const c of fixture.expected.criteria) {
    const got = result.criteria.find(x => x.criterion_id === c.criterion_id)!
    assert(Math.abs(got.score - c.score) <= 1, `${c.criterion_id}: expected ${c.score}, got ${got.score}`)
  }
}
```

3. **Run on every PR.** Add to CI as a separate job (`pnpm eval:grader`) that runs only when `packages/ai/**` or `content/rubrics/**` changes. Fail the build on regression.

4. **Prompt iteration loop:** when you tweak `prompts/grade.ts`, run `pnpm eval:grader` locally; if pass rate drops, reject the change.

5. **Tell Copilot about the harness:** when refining the grading prompt, paste the fixtures into the chat: "Here are 3 designs and their expected scores. Iterate on `buildGradingPrompt` until the grader matches within tolerance. Show me the diff and the eval output."

---

## 7. Post-MVP prompt seeds (keep this doc useful past week 12)

```prompt
# Mock interviewer voice loop
Add a voice mode to /problems/[slug]: streams audio via OpenAI Realtime or Anthropic + ElevenLabs.
Interviewer asks clarifying questions in turns; transcript is appended to the submission and graded alongside the canvas.
```

```prompt
# Spaced repetition
Add `srs_cards` table (problem_id, criterion_id, user_id, ease, interval_days, due_at).
Generate cards from rubric criteria the user scored <2 on.
Daily review queue at /review.
```

```prompt
# Peer review
Submissions can be marked public. /community shows recent public ones; users can leave structured feedback (one comment per criterion).
Add Trust & Safety: rate-limit, profanity filter, report button.
```

```prompt
# Adaptive difficulty
After 3 graded submissions, recommend the next problem from a similarity graph (problems x criteria) using the user's weak categories. Surface in dashboard.
```

---

## 8. Cheat-sheet appendix

### Copilot Chat slash commands
| Command | Use |
|---|---|
| `/explain` | Explain selected code. Best on dense regex / SQL / weird type errors. |
| `/fix` | Fix the selected code (uses error context if any). |
| `/tests` | Generate tests for selected function. Vibrate first; rewrite second. |
| `/doc` | Insert JSDoc / TSDoc above selection. |
| `/new` | Scaffold a new project (we used `pnpm` instead — skip). |
| `/clear` | Reset chat context. Do this between phases to avoid drift. |

### Chat references
| Ref | Use |
|---|---|
| `@workspace` | Lets Copilot search your repo. Use whenever asking about existing code. |
| `@workspace path/to/file.ts` | Pin a specific file as context. |
| `@terminal` | Reference last terminal output (great for stack traces). |
| `@vscode` | Ask about VSCode itself. |
| `@github` | Search issues/PRs (Copilot Enterprise). |

### Keyboard shortcuts (macOS; swap `Cmd` → `Ctrl` on Linux/Windows)
| Shortcut | Action |
|---|---|
| `Tab` | Accept inline suggestion |
| `Esc` | Dismiss inline suggestion |
| `Cmd+→` | Accept word-by-word |
| `Cmd+I` | Open inline chat at cursor |
| `Cmd+Shift+I` | Open Copilot Chat panel |
| `Cmd+Enter` (in chat) | Send to agent mode (if enabled) |
| `Ctrl+Enter` | Open Copilot completions panel (10 alternates) |

### When Copilot is stuck — the unstick checklist
1. `/clear` the chat.
2. Open the file you want changed; select the region; use inline chat (`Cmd+I`).
3. Re-paste the relevant section of `.github/copilot-instructions.md`.
4. Switch model in Copilot Chat (Claude Sonnet > GPT-4.1 for code with strict types, in our experience).
5. If still wrong: switch to Continue / Cursor with Claude Opus 4.6 for that one prompt, paste result back into VSCode.

---

## 9. Final checklist before you start

- [ ] Copilot Chat works (`Cmd+Shift+I` opens panel).
- [ ] `useInstructionFiles` setting is on.
- [ ] You have: Supabase project, Stripe account (test mode), Anthropic API key, Vercel account, Resend account, Upstash Redis instance, Sentry project, PostHog project, GitHub repo created and cloned locally.
- [ ] Node 20, pnpm 9 installed.
- [ ] You've read §0 (how to use Copilot) and §5 (what NOT to do).
- [ ] You've committed to running prompts in order, reading every diff, and pushing back when Copilot drifts.

Now run **Prompt A1**. Ship in 12 weeks.
