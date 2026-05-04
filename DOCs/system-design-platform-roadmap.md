# Roadmap — Interactive System Design Learning Platform

*A 12-month, opinionated plan to ship a website now and a mobile app later. Written for the founder/builder.*

---

## 1. Vision & Positioning

**Vision.** Build the platform where a CS student or working engineer goes to *actually learn* system design — not just watch lectures or read articles, but practice designing systems, get instant expert-quality feedback, and walk into interviews and architecture reviews with real fluency.

**One-sentence pitch.** *"Duolingo + Figma + a senior staff engineer in your pocket — for system design."*

**Who it's for (in priority order).**

| Persona | What they want | Why they pay |
|---|---|---|
| **P1 — Job-switching engineer (mid/senior, 3–10 yrs)** | Pass the system design loop at FAANG/unicorns within 6–12 weeks | Direct ROI: a $30–80K comp bump justifies $24/mo trivially |
| **P2 — CS / bootcamp student (final-year, new-grad)** | Learn architecture concepts not taught in school; prep for new-grad SD rounds | Lower willingness-to-pay; freemium + student plan |
| **P3 — Junior engineer (0–3 yrs) leveling up** | Build intuition for production systems they aren't yet trusted to design | Self-improvement + interview prep blended |
| **P4 — Senior+ brushing up** | Refresh on patterns; explore new domains (e.g. ML systems, data infra) | Lower frequency; price-insensitive once converted |
| **P5 (later) — Engineering teams / L&D** | Standardize architectural literacy across a growing team | B2B seats, $200–400/seat/yr |

Lead with **P1**. They have urgency, money, and a clear "did it work?" signal (got the offer). Everything else is downstream.

**Competitive landscape & wedge.**

| Competitor | What they're great at | What they leave on the table |
|---|---|---|
| **Grokking the System Design Interview (Educative / DesignGurus)** | Comprehensive written content, well-known brand, cheap | Passive reading; no practice; no feedback loop |
| **ByteByteGo (Alex Xu)** | Beautiful diagrams, brand, weekly newsletter | Mostly read/watch; no practice surface |
| **Hello Interview** | Strong interview-focused content, real engineer creators, mocks | Mocks are scarce + expensive; not a daily-driver product |
| **Exponent** | Polished mock interviews, PM/SWE breadth | Generalist, not deeply system-design native |
| **YouTube (Gaurav Sen, Arpit Bhayani, Tech Dummies)** | Free, deep, charismatic | No structure, no practice, no feedback, no progress |
| **LeetCode** | The default for coding prep, network effects | System design is an afterthought there |

**Your wedge: the practice loop.** Reading content is commoditized. Nobody has nailed *"design a system on a canvas → AI grades it against a rubric in 30 seconds → see expert solution + your gaps → drill the weak spot tomorrow."* That's the hole. Own it.

**Three differentiators, in order of importance:**

1. **Interactive design canvas with AI rubric grading.** A first-class drag-drop architecture builder where every submitted design is scored on capacity math, data model, scaling strategy, failure modes, and trade-off articulation — and you get *specific* feedback ("you didn't address hot-key write skew on the leaderboard"), not a thumbs-up.
2. **Adaptive practice + spaced repetition.** Track which sub-skills (consistency models, sharding, queueing, rate limiting, caching strategies, etc.) the learner is weak on, and surface targeted drills the next day.
3. **Real-engineer rubrics, not generic LLM vibes.** Each problem ships with a rubric authored or reviewed by a senior+ engineer who has actually run that interview loop or built that system. The rubric — not the LLM — is the moat.

Avoid being "another curriculum." Be a *practice gym* with curriculum attached.

---

## 2. Core Product Pillars

System design is hard to learn because it's:
- **Open-ended** — there's no single right answer, so self-study has no feedback signal.
- **Tacit** — most knowledge lives in senior engineers' heads.
- **Breadth-heavy** — networks, storage, distributed systems, data modeling, queueing, security, ops.
- **Hard to practice solo** — without a partner or expert, you can't tell if your design is good.

The product attacks each of those problems:

### Pillar 1 — Structured Curriculum (the "textbook")

A single, coherent learning path organized as:

1. **Fundamentals.** Latency vs throughput, CAP, ACID/BASE, networking primer, OS basics, back-of-envelope math.
2. **Building Blocks.** Load balancers, caches (Redis/Memcached), databases (RDBMS, KV, document, wide-column, search, time-series), queues/streams (Kafka, SQS), CDNs, API gateways, rate limiters, consensus (Raft, Paxos at the conceptual level).
3. **Patterns.** Sharding, replication, leader election, idempotency, eventual consistency, saga, CQRS, event sourcing, write-ahead logging, gossip.
4. **Case Studies.** ~25–40 canonical designs: URL shortener, rate limiter, distributed cache, news feed, chat (WhatsApp), video streaming (Netflix/YouTube), ride-share (Uber), payments, search autocomplete, notification system, ad click tracker, distributed file storage (Dropbox), collaborative editor (Google Docs), metrics system, leaderboard, etc.
5. **Mock Interviews.** End-to-end 45-min sessions on case-study problems with the AI interviewer.

Each unit is **lesson + drill + design exercise**. Reading without doing is forbidden.

### Pillar 2 — Interactive Design Canvas

The signature feature. A drag-drop whiteboard where the learner builds an architecture:
- **Component library:** clients, LBs, gateways, services, DBs (typed: SQL/KV/doc/etc.), caches, queues, workers, CDNs, object storage, search, analytics.
- **Typed connections:** sync RPC, async event, pub/sub, CDC. Connection types matter for grading.
- **Annotation layer:** capacity numbers, partitioning keys, replication factors, consistency choices, on each component.
- **"Compile" button:** runs the rubric grader (Pillar 3).
- **Replay / snapshot:** every state is versioned so the learner can compare attempts.

Build on **tldraw** (canvas + multiplayer-ready) with a custom shape library, *not* Excalidraw (too freeform; we want typed nodes the grader can parse).

### Pillar 3 — AI-Powered Feedback (the moat)

Every problem has a structured rubric authored by an engineer:

```yaml
problem: design_a_url_shortener
rubric:
  - id: capacity_math
    weight: 10
    criteria: "Estimates QPS and storage within 1 order of magnitude of stated assumptions"
  - id: id_generation
    weight: 15
    criteria: "Addresses uniqueness, length, collision strategy"
  - id: read_path
    weight: 15
    criteria: "Reads served from cache; cache miss falls through to KV store; mentions TTL"
  - id: write_path
    weight: 10
  - id: hot_key_handling
    weight: 10
  - id: analytics_pipeline
    weight: 10
  - id: failure_modes
    weight: 15
  - id: tradeoffs_articulated
    weight: 15
```

Submission flow:
1. Learner's canvas is serialized to JSON (nodes, edges, annotations) + their written explanation.
2. Claude is called with: rubric + serialized design + reference solution + grading prompt.
3. Claude returns a per-criterion score, specific feedback, and named gaps.
4. Gaps feed the spaced-repetition queue (Pillar 5).

Why this works: the rubric constrains the LLM, so feedback is consistent and defensible. The LLM isn't deciding *what* matters — the rubric is.

### Pillar 4 — AI Mock Interviewer

A 45-min voice/text session that:
- Asks the problem, lets the learner clarify requirements (and pushes back like a real interviewer).
- Watches the canvas evolve live; asks probing questions ("what happens when this DB falls over?", "how do you handle a celebrity user?").
- Grades end-to-end on rubric + communication.
- Generates a written debrief: strengths, gaps, what to study tomorrow.

This is the **closer** — the feature people screenshot and post on LinkedIn.

### Pillar 5 — Spaced Repetition for Concepts

Anki-style flashcards generated from the curriculum, but smarter: weak rubric criteria from past designs feed the deck. If the learner consistently misses "hot-key handling," they get drills on consistent hashing, write-coalescing, and request fan-out the next day.

### Pillar 6 — Gamification (light, not Duolingo-cringe)

- **XP** per design submitted (weighted by difficulty + score).
- **Streaks** (daily practice).
- **Skill tree** showing mastery across ~30 sub-skills (caching, sharding, etc.) — tasteful, RPG-style.
- **Leagues** (weekly cohorts) — *only* in Phase 3+, and optional. Public leaderboards backfire for senior engineers.

### Pillar 7 — Community & Peer Review

- Submit your design to the community; others rate and comment.
- Curated weekly "design of the week" with expert breakdown.
- Discussion threads attached to each problem.
- Reputation system; top reviewers get free Pro.

### Pillar 8 — Real-World Case Studies

Long-form, beautifully illustrated breakdowns of how real systems work — Netflix's CDN, Uber's dispatch, WhatsApp's messaging, Stripe's idempotency, Discord's voice, Cloudflare Workers. These are the **content marketing flywheel** as well as a Pro feature.

### Pillar 9 — Hands-On Labs (later, Phase 4+)

Browser-based or container-backed labs:
- Configure an Nginx LB with weighted round-robin.
- Set up a Redis cache with eviction policies; observe hit rates.
- Run a Kafka consumer group; kill a partition leader.
- Stand up a sharded Postgres setup.

These are expensive to build but create deep moat. Punt to Phase 4.

---

## 3. MVP Scope (v0) — Ship in 8–12 Weeks

**Goal.** Get a paying user to say *"this got me ready for my interview better than anything else."*

**In scope:**
1. **10 hand-curated problems** with full rubrics + reference solutions. (URL shortener, rate limiter, news feed, chat, parking lot/ride-share, top-K analytics, distributed cache, notification system, web crawler, leaderboard.)
2. **Interactive canvas** (tldraw + custom typed shapes) with serialize-to-JSON.
3. **AI rubric grading** (Claude API): submit design + writeup → per-criterion score + feedback in <30s.
4. **Reference solution viewer** with a side-by-side "your design vs ours" diff.
5. **Lesson content** for ~15 fundamentals (markdown + diagrams), enough to support the 10 problems.
6. **Auth + paywall** (email + Google login; Stripe subscriptions; 2 free problems, rest behind paywall).
7. **User dashboard** (problems attempted, scores, weak areas).
8. **Landing page** that converts.

**Explicitly out of scope for v0:**
- Mobile app
- Multiplayer canvas / collaboration
- Live mock interviewer (text-based grading is fine for v0)
- Community features
- Spaced repetition flashcards
- Video lessons
- Hands-on labs
- Skill tree / leagues / streaks
- Team plans / B2B

**v0 success criteria (gates to keep building):**
- 200+ signups in first 4 weeks post-launch.
- 10+ paying users at $24/mo by week 8.
- ≥40% of paying users complete ≥3 problems.
- ≥4.0/5.0 average self-reported "feedback was useful" rating.
- At least 3 unprompted public testimonials (Twitter/LinkedIn).

If you don't hit these, *fix the loop before adding features*. Adding mock interviewer to a product nobody is finishing won't save it.

---

## 4. Phased Roadmap

| Phase | Duration | Goal | Headcount | Key features |
|---|---|---|---|---|
| **0 — Discovery** | Wks 1–4 | Validate wedge with 30+ user interviews, build landing page, capture 500 emails | 1 (you) | Landing page, waitlist, interview notes |
| **1 — MVP Web** | Wks 5–16 | Ship paid product; hit 10 paying users | 1–2 | Canvas, 10 problems, AI grading, paywall |
| **2 — AI Mock Interviewer + Curriculum Depth** | Wks 17–28 | Become *the* practice tool | 2–3 | Voice/text mock interviewer, 25 problems, spaced repetition, skill tree |
| **3 — Community & Content Flywheel** | Wks 29–40 | Compounding distribution | 3–4 | Peer review, public design gallery, case study library, weekly newsletter, referral loop |
| **4 — Mobile App** | Wks 41–52 | Daily-habit surface | 4–5 | React Native app: lessons, flashcards, mock interviewer (audio), no canvas |
| **5 — B2B / Enterprise** | M13–18 | Diversify revenue | 5–8 | Team plans, admin dashboard, SSO, custom rubrics, SOC 2 path |

**Phase-by-phase detail:**

### Phase 0 — Discovery & Validation (Weeks 1–4)

- **You (the founder)** book 30 user interviews: 15 with job-switching engineers in active interview prep, 10 with new-grads, 5 with eng managers who hire.
- Ask: *"Walk me through how you prepped for system design last time. Where did you get stuck? What did you wish existed?"* Don't pitch.
- Publish a landing page with the interactive canvas demo (clickable mock, not real) + waitlist.
- Seed it via 5–10 LinkedIn posts, 1–2 r/cscareerquestions and r/leetcode posts, Hacker News "Show HN" of the demo.
- **Exit criteria:** 500 emails captured, 5+ "I would pay for this today" quotes you can use, clarity on the top 10 problems to ship.

### Phase 1 — MVP Web (Weeks 5–16)

See MVP Scope above. Specific milestones:
- **Wk 5–6:** auth, payments, canvas POC with 1 problem, end-to-end grading working on that 1 problem.
- **Wk 7–10:** scale to 5 problems; iterate on grading prompt/rubric format with 5 alpha users.
- **Wk 11–12:** add 5 more problems; polish UI; landing page V2; pricing page.
- **Wk 13:** **public launch** — Show HN, Product Hunt, your waitlist, LinkedIn / Twitter campaign.
- **Wk 14–16:** weekly iteration on conversion funnel + grading quality.

**KPIs:** 500 signups, 25 paying users, 60% activation (≥1 problem submitted), $600 MRR.

### Phase 2 — AI Mock Interviewer + Curriculum Depth (Weeks 17–28)

- **AI mock interviewer:** voice in (Whisper) → Claude conversational backbone → voice out (ElevenLabs/OpenAI TTS). Live canvas observation. Final written debrief.
- **Curriculum:** 25 total problems; full fundamentals + building blocks tracks; ~80 lessons.
- **Spaced repetition:** flashcards generated from concept misses; daily review queue.
- **Skill tree:** visual mastery dashboard.
- **Pricing:** introduce annual plan ($199/yr).

**KPIs:** 2K signups, 200 paying users ($4.8K MRR), median 5+ problems/user, 30-day retention ≥35%.

### Phase 3 — Community & Content Flywheel (Weeks 29–40)

- **Peer review:** submit design → 2 reviewers required → mutual feedback. Reputation system.
- **Public design gallery** with upvotes, weekly featured design.
- **Case study library:** 20 polished long-form pieces — also published as SEO content.
- **Newsletter:** weekly system design breakdown — drives top-of-funnel.
- **Referral program:** 1 month free for both sides.
- **Discord** community.

**KPIs:** 8K signups, 600 paying users ($14K MRR), 25% of new signups from referral or organic.

### Phase 4 — Mobile App (Weeks 41–52)

See Section 11. Scoped tightly: lessons, flashcards, audio mock interviewer, progress sync. **No canvas on mobile.**

**KPIs:** 30% of weekly active users active on mobile, +15% on retention vs web-only baseline.

### Phase 5 — B2B / Enterprise (Months 13–18)

- Team admin dashboard (assign problems, track progress).
- SSO (Google Workspace, Okta).
- Custom rubrics (companies upload their own architecture standards as graded problems).
- Annual seat pricing: $300/seat/yr (5-seat min).
- University licensing: flat campus rate; instructor dashboard.
- Begin SOC 2 Type I.

**KPIs:** 3 paying teams, $30K ARR from B2B, first university pilot.

---

## 5. Tech Stack (Recommended, Opinionated)

| Layer | Pick | Why |
|---|---|---|
| **Frontend framework** | Next.js 14+ (App Router) + TypeScript | SSR for SEO on case studies, server actions, mature ecosystem, deploys to Vercel cleanly |
| **Styling** | Tailwind + shadcn/ui | Fastest to a polished UI; shadcn keeps you owning the components |
| **Canvas / diagramming** | **tldraw** (with custom shape SDK) | Typed shapes (critical for graders parsing the design); multiplayer ready; React-native; commercial license clear. Excalidraw is freeform — wrong tool for graded diagrams. React Flow is an alternative if tldraw licensing is a concern. |
| **State** | Zustand for client; React Query for server | Boring and reliable |
| **Backend** | Next.js API routes / server actions for v0; extract to a Node service (Hono or Fastify) when grading queue grows | Don't prematurely split; you'll regret a Python service split when you only have 1 engineer |
| **Language** | TypeScript end-to-end | Shared types between frontend, grader payloads, rubric schema. Don't mix Python in until you have a real reason (e.g. ML eval). |
| **DB** | Postgres (via Supabase or Neon) | Boring, transactional, full-text search, JSONB for canvas state. |
| **Auth** | Supabase Auth or Clerk | Both fine. Clerk is faster to ship; Supabase Auth keeps you in one provider. Pick Supabase for v0 to consolidate. |
| **Payments** | Stripe (Checkout + Customer Portal + Stripe Tax) | Default. Use Checkout, not custom forms. |
| **Cache / queue** | Upstash Redis (serverless) → real Redis on AWS later | Serverless Redis is right-sized for v0/v1 |
| **AI layer** | Anthropic Claude API (Sonnet for grading; Opus for mock interviewer + complex rubrics) | Best at structured rubric reasoning; you can swap models per task |
| **Voice (Phase 2)** | Whisper (OpenAI) for STT; ElevenLabs or OpenAI TTS for output | Latency matters for mock interviewer; benchmark both |
| **Vector DB (Phase 2+)** | pgvector in Supabase | Don't add a new datastore; pgvector is enough for retrieval over rubrics + reference solutions |
| **Hosting** | Vercel (web) + Supabase (DB/auth/storage) for v0–v2; AWS (ECS Fargate + RDS) when scale or B2B compliance demands | Don't over-invest in infra early; Vercel + Supabase will get you to $50K MRR easily |
| **Observability** | Sentry + PostHog + Vercel Analytics | Sentry for errors, PostHog for product analytics + session replay |
| **Email** | Resend | Lovely DX; pairs with Next.js |
| **Mobile (Phase 4)** | **React Native + Expo** | Reuse TS types, content pipeline, auth, Stripe; one team can ship both. Native (Swift/Kotlin) only if you hit RN walls (you won't, for this product). |

**The "no" list (resist these):**
- Don't build on Firebase — relational queries get painful for the curriculum/skill graph.
- Don't write a from-scratch canvas. tldraw exists.
- Don't host LLM weights. You're a learning platform, not an ML company.
- Don't pick GraphQL for v0. REST + tRPC if you want type safety.
- Don't introduce microservices before you have 100 paying users.

---

## 6. Team & Resources

### Solo founder path (months 1–6)

You can ship Phase 0 + Phase 1 alone if you're a competent full-stack engineer. Buy time everywhere else:
- **Content:** hire a senior engineer as a contractor to write rubrics + reference solutions. ~$200/problem × 10 = $2K. Worth every dollar.
- **Design:** $1.5–3K to a good Dribbble freelancer for landing page + brand + a component design pass. Don't spend more.
- **Copy:** you write it. Founders write better landing copy than anyone.
- **Total cash to MVP:** $5–15K + Claude API credits + Vercel/Supabase free tiers.

### Small team path (months 4–12)

Hires in this order:
1. **Founding engineer** (full-stack, eng-lead leaning). Wks 12–16.
2. **Content lead / curriculum designer** — senior engineer who has interviewed at FAANG. Part-time → full-time. Wks 16–24.
3. **Designer** (product + brand). Wks 24–32.
4. **Growth / DevRel** — they own the YouTube channel, newsletter, Twitter. Wks 32–40.
5. **Mobile engineer** (RN). Wks 40–44.

**By month 12:** 4–5 people. Don't hire faster.

### Fundraising

You can bootstrap to ~$30K MRR. If you raise, raise a $1.5–2.5M pre-seed *after* MVP traction (10–20 paying users, clear retention). Don't raise on the deck.

---

## 7. Go-To-Market

**Distribution thesis.** Your buyer is a developer who lives on Twitter/X, LinkedIn, YouTube, Reddit (r/cscareerquestions, r/ExperiencedDevs, r/leetcode), and Hacker News. *Be where they are with content that proves you have taste.*

### Content engine (start week 1, never stop)

- **YouTube — long-form (1/wk):** "How [Company] actually built [System]." 12–20 min. Beautiful diagrams. End with a CTA to design it yourself on the platform.
- **Twitter/X (daily):** one diagram, one trade-off, one reply-thread on a hot architecture story.
- **LinkedIn (3×/wk):** founder-narrated post — what you're building, why, what you're learning from users. Ships emails directly into your funnel from senior engineers.
- **Newsletter (weekly):** 8-min read; system design breakdown + one drill problem of the week. Substack or Beehiiv.
- **SEO blog:** case study deep-dives target high-intent queries: *"how does Uber's dispatch work,"* *"system design interview rate limiter,"* etc.
- **Reddit:** participate, don't spam. One post/wk in r/cscareerquestions with a useful free piece + soft mention.

### Launch sequence (Phase 1, week 13)

1. Tease for 2 weeks across all channels with the canvas demo video.
2. **Day 0:** Show HN ("a system design practice gym with AI rubric grading"), Product Hunt, your waitlist email, LinkedIn founder post, Twitter thread.
3. Reach out to 30 micro-influencers (2K–50K followers) in dev-career space; offer free Pro + an affiliate link.
4. Day 7: post your first 10 paying users' wins (with permission) as a results thread.

### Pricing

| Plan | Price | What's included | Target user |
|---|---|---|---|
| **Free** | $0 | 2 problems, fundamentals lessons, limited AI feedback (1/day) | Lead capture |
| **Pro** | **$24 / mo** or **$199 / yr** (~30% off) | All problems, unlimited AI grading, mock interviewer (Phase 2+), spaced repetition, skill tree | P1, P3, P4 |
| **Student** | **$12 / mo** (.edu verification) | Same as Pro | P2 |
| **Team (Phase 5)** | **$300 / seat / yr**, 5-seat min, annual only | Pro + admin dashboard + custom rubrics + SSO + invoicing | Eng L&D |
| **Enterprise** | Custom (~$50K+ ARR floor) | Team + SOC 2 + custom integrations + dedicated CSM | 500+ eng orgs |
| **University** | Flat $5–15K/yr per campus | Pro for students + instructor dashboard | CS departments |

Why $24/mo, not $19 or $29: it's right at the "I don't need to think about it for 1–3 months" threshold for an engineer making $150K+. ByteByteGo is $20, Hello Interview is $30, Educative is bundled at $59. $24 sits in the gap and signals premium without sticker shock.

**Don't discount in launch month.** Discounting trains the market that the price is fake.

### University & community partnerships (Phase 2+)

- 5 target schools first (CMU, Berkeley, UIUC, GA Tech, Waterloo). Free for one course; instructor dashboard in exchange for testimonial + permission to namedrop.
- Partner with 2 bootcamps (Bradfield, Recurse alums, etc.) for affiliate deals.

---

## 8. Monetization

Three revenue streams in priority order:

1. **B2C subscriptions** (Pro / Student) — 80%+ of revenue through Phase 4.
2. **B2B teams** (Phase 5) — higher-margin, longer contracts, lower churn. Target 30% of revenue by month 24.
3. **Content marketplace / expert modules** (Phase 5+, optional) — top engineers author premium modules; rev share 70/30. Don't open this until you have demand pulling for it; it's a distraction otherwise.

Avoid:
- **Ads.** Devs hate them. Margin trap.
- **One-time purchases.** Caps LTV; encourages ship-and-leave.
- **Cohort courses.** High-ops, low-leverage. (Maybe one as marketing, ever.)

**Unit economics target by month 12:**
- ARPU: $20/mo blended.
- Gross margin: 80%+ (Claude API is the largest variable cost; budget $1–3 per active user/mo).
- Payback: <2 months on paid; <1 week on organic.
- Logo churn: <6%/mo on annual, <10%/mo on monthly.

---

## 9. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| **AI grading is inconsistent / wrong** | High | Rubric-constrained prompts; ship a "report bad feedback" button on every grading; weekly review of low-rated graders; calibration set of 50 reference designs + scores |
| **Content quality is shallow** | High (this is the existential risk) | Hire a senior engineer as part-time content lead; do not let LLMs write rubrics; ship fewer problems, deeper |
| **Retention drops after interview** | High | Lean into "level up at work" use cases (Phase 2+ case studies, real system breakdowns), team plans for ongoing relevance |
| **YouTube/free content as substitute** | Medium | Don't compete on info; compete on the practice loop and personalized feedback. Make free content yourself (it's a flywheel, not a competitor) |
| **Whiteboard is hard to build well** | Medium | Use tldraw; commit to ~6 weeks for the canvas + typed shapes + serializer |
| **Claude API cost explodes at scale** | Medium | Caching, prompt compression, route easy graders to Haiku; budget $1–3/MAU; raise prices on Pro before squeezing margin |
| **Competitor (Hello Interview, ByteByteGo) ships practice + AI** | Medium | Move fast; the rubric library compounds; community is moaty |
| **Big tech ships a free version (LinkedIn Learning, etc.)** | Low | Keep the wedge tight (interview+practice loop); they will stay generic |
| **You burn out building solo** | Medium-High | Hire engineer #1 by Wk 16; protect 1 day/wk for non-product (sales, content) |
| **Mobile app distracts from web** | High if rushed | Hold mobile until Wk 40+; protect web roadmap |
| **Cheating / answer-sharing** | Low–Medium | Per-user noise in problem framings; rotate "graded" rubric criteria; don't let the moat be "secret answers" anyway |

The two that will actually kill you: **shallow content** and **inconsistent AI grading**. Spend disproportionate energy on both.

---

## 10. 12-Month Timeline (Concrete Milestones)

| Month | Milestone |
|---|---|
| **M1** | 30 user interviews done. Landing page live. 500 waitlist emails. 1st YouTube video. Niche selected. |
| **M2** | Canvas POC working with 1 problem. Auth + Stripe live. Closed alpha with 10 waitlist users. |
| **M3** | 5 problems live with rubrics + reference solutions. Grading working end-to-end. Closed beta opens, 50 users. |
| **M4** | **Public launch.** 10 problems live. Show HN + Product Hunt. Goal: 25 paying users / $600 MRR by end of month. |
| **M5** | Iterate on conversion + grading quality. 50 paying / $1.2K MRR. 1 viral LinkedIn post. |
| **M6** | Hire engineer #1. AI mock interviewer prototype. 100 paying / $2.4K MRR. |
| **M7** | Mock interviewer (text-based) live. 15 problems. Spaced repetition shipped. 150 paying / $3.6K MRR. |
| **M8** | Mock interviewer (voice) live. Annual plan launches. Hire content lead. 250 paying / $6K MRR. |
| **M9** | Skill tree + dashboard. 20 problems. First university pilot signed (free). 350 paying / $8.5K MRR. |
| **M10** | Community v1: peer review + design gallery. Hire designer. 500 paying / $12K MRR. |
| **M11** | Newsletter at 10K subs. Referral program live. Mobile app dev kickoff. 700 paying / $17K MRR. |
| **M12** | **iOS app TestFlight.** First B2B team contract signed. **$20K+ MRR.** |

If you're hitting these, you're on a clear path to $10M ARR by year 3. If by M6 you're under $2K MRR, *stop adding features and fix the wedge.*

---

## 11. Mobile App Considerations (Phase 4, Month 10+)

### What ships on mobile

The phone is for **micro-sessions** (5–15 min), not deep work. Scope ruthlessly:

| Feature | Mobile? | Why |
|---|---|---|
| Lessons (read + watch) | ✅ | Perfect commute / lunch surface |
| Flashcards / spaced repetition | ✅ | The killer mobile feature; rivals Anki for this niche |
| Audio mock interviewer | ✅ | Hands-free; great on a walk; uses earbuds mic |
| Progress / skill tree | ✅ | Quick check-ins, push notifications for streaks |
| Quizzes / multiple-choice drills | ✅ | Tap-friendly, 60-sec format |
| Community feed (read) | ✅ | Browse-only; no posting on mobile in v1 |
| **Interactive design canvas** | ❌ | Drag-drop architecture on a phone is awful. Don't fight it. |
| Peer review submissions | ❌ (v1) | Same — needs canvas |
| Hands-on labs | ❌ | Not phone-appropriate |

The framing for the user: *"Practice on web, drill on mobile."*

### React Native vs native

**Pick React Native + Expo.** Reasoning:
- 90% of the mobile UI is content + lists + audio + simple forms — RN handles this superbly.
- One TypeScript codebase, shared types and content pipeline with web. Massive velocity win for a small team.
- Expo's OTA updates and EAS Build remove most of the historical RN ops pain.
- Native (Swift/Kotlin) only buys you something if the canvas were in scope. It isn't.
- If voice/audio mock interviewer needs deep native APIs, RN's audio modules + small native bridges cover it.

**Build sequence (Wks 41–52):**
- Wks 41–44: RN scaffold, auth + Stripe sync, content sync from Postgres, dark mode, push.
- Wks 45–48: Lessons + flashcards + dashboard. TestFlight + Play internal.
- Wks 49–52: Audio mock interviewer (record → upload → server-side STT/LLM/TTS). Public release.

Ship iOS first (~70% of paying engineer audience is on iOS in the US/EU markets you're targeting). Android within 4 weeks of iOS GA.

---

## TL;DR — The Plan in 6 Sentences

1. The wedge is **a practice gym with AI rubric-graded designs**, not another curriculum.
2. Ship a v0 in 12 weeks: tldraw canvas + 10 hand-curated problems + Claude grading + Stripe paywall.
3. Stack: Next.js + TypeScript + Supabase + Stripe + Claude on Vercel — boring, fast, deployable solo.
4. Get to 25 paying users at $24/mo by month 4; AI mock interviewer + 25 problems by month 8.
5. Mobile (RN, no canvas) lands month 10–12; B2B opens in month 13+.
6. The two existential risks are **shallow content** and **bad AI feedback** — over-invest there from day one.

---

*Edit this document as you learn. The plan is a hypothesis, not a contract. Ship, measure, adjust.*
