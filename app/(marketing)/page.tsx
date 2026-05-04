import Link from 'next/link'
import {
  ArrowRight,
  Check,
  Sparkles,
  Workflow,
  Brain,
  Layers,
  Trophy,
  Quote,
  Zap,
  Target,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CanvasPreview } from '@/components/marketing/canvas-preview'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <SocialProof />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <CurriculumSection />
      <TestimonialsSection />
      <PricingTeaser />
      <FaqSection />
      <CTASection />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    HERO                                    */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-spotlight">
      <div className="absolute inset-0 bg-grid-faint opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black,transparent)]" />
      <div className="container relative pb-24 pt-16 md:pt-28">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Badge variant="info" className="mb-6 gap-1.5 py-1 text-xs">
            <Sparkles className="h-3 w-3" />
            v0 launch — 2 problems free, no credit card
          </Badge>
          <h1 className="text-balance font-display text-5xl font-semibold tracking-tight md:text-7xl">
            Practice system design <br />
            <span className="text-gradient-brand">like Duolingo.</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Drag-drop architectures on an interactive canvas. Get rubric-graded by an AI
            staff engineer in 30 seconds. Walk into your interview fluent.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="gradient" className="text-base">
              <Link href="/login?intent=signup">
                Start practicing free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base">
              <Link href="/problems">Browse problems</Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <CheckBullet>10 hand-curated FAANG-style problems</CheckBullet>
            <CheckBullet>Instant AI feedback &lt; 30s</CheckBullet>
            <CheckBullet>Reference solutions side-by-side</CheckBullet>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <CanvasPreview />
        </div>
      </div>
    </section>
  )
}

function CheckBullet({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <Check className="h-3.5 w-3.5 text-emerald-500" />
      {children}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Social Proof                                */
/* -------------------------------------------------------------------------- */

function SocialProof() {
  const logos = ['Stanford', 'CMU', 'UIUC', 'Waterloo', 'Berkeley', 'IIT']
  return (
    <section className="border-y border-border/40 bg-card/20 py-10">
      <div className="container">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Trusted by engineers heading to FAANG, unicorns, and beyond
        </p>
        <div className="mt-6 grid grid-cols-3 gap-6 opacity-60 md:grid-cols-6">
          {logos.map((l) => (
            <div
              key={l}
              className="flex items-center justify-center font-semibold tracking-wide text-muted-foreground"
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Problem Pitch                               */
/* -------------------------------------------------------------------------- */

function ProblemSection() {
  return (
    <section className="container py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <Badge variant="default" className="mb-4">
            The problem
          </Badge>
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Reading articles doesn&apos;t make you good at system design.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            You watched ByteByteGo. You read Grokking. You memorized &ldquo;use a CDN.&rdquo; Then
            the interviewer drew a blank box on the whiteboard, asked you to design
            WhatsApp, and your brain stalled.
          </p>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
            System design isn&apos;t a curriculum problem — it&apos;s a{' '}
            <span className="text-foreground font-semibold">practice gap</span>. Without
            a partner, you can&apos;t tell if your design is good or a beautifully drawn mess.
          </p>
        </div>

        <div className="grid gap-4">
          <PainPoint
            label="Passive learning"
            text="No feedback signal — you can't tell what you missed."
          />
          <PainPoint
            label="Mock interviews are expensive"
            text="$150/session, schedule-blocked, hard to drill weak spots."
          />
          <PainPoint
            label="Open-ended problems"
            text="No 'right answer.' Self-study has nowhere to land."
          />
          <PainPoint
            label="Tacit knowledge"
            text="The good stuff lives in senior engineers' heads."
          />
        </div>
      </div>
    </section>
  )
}

function PainPoint({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-5 transition-colors hover:border-border">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1.5 text-foreground/90">{text}</div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Features (3 cards)                            */
/* -------------------------------------------------------------------------- */

function FeaturesSection() {
  return (
    <section className="border-t border-border/40 bg-card/20 py-24 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="default" className="mb-4">
            Three things, done well
          </Badge>
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight md:text-5xl">
            A practice gym, not another textbook.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            We built the missing piece: an environment where you design, get graded, and
            drill the gap. Repeat until fluent.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<Workflow className="h-5 w-5" />}
            title="Interactive design canvas"
            description="Drag-drop services, queues, caches, DBs. Annotate with capacity, replication, sharding strategy. Every node has a typed schema the grader actually reads."
            points={[
              'Typed shapes (LB, KV, queue, cache)',
              'Capacity & consistency annotations',
              'Versioned snapshots',
            ]}
          />
          <FeatureCard
            icon={<Brain className="h-5 w-5" />}
            title="AI rubric grading"
            description="Each problem ships with an 8-12 criterion rubric authored by senior engineers. Submit your design — Claude grades against the rubric, cites your nodes, and names your gaps."
            points={[
              'Per-criterion 0-3 scoring',
              'Evidence cites your design',
              'Specific gaps, not vibes',
            ]}
            featured
          />
          <FeatureCard
            icon={<Eye className="h-5 w-5" />}
            title="Reference solutions"
            description="After your first attempt, unlock the canonical solution. Side-by-side diff highlights what you missed and what you nailed. No more wondering."
            points={[
              'Senior-engineer-authored',
              'Side-by-side diff',
              'Trade-off narratives',
            ]}
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  points,
  featured,
}: {
  icon: React.ReactNode
  title: string
  description: string
  points: string[]
  featured?: boolean
}) {
  return (
    <Card
      className={
        featured
          ? 'relative overflow-hidden border-brand-500/30 bg-gradient-to-b from-brand-500/5 to-transparent'
          : 'bg-card/60'
      }
    >
      {featured ? (
        <div className="absolute -top-px left-0 right-0 mx-auto h-px w-1/3 bg-gradient-to-r from-transparent via-brand-400 to-transparent" />
      ) : null}
      <CardContent className="space-y-4 p-7">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        <ul className="space-y-2 pt-1 text-sm">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-400" />
              <span className="text-foreground/85">{p}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/*                              How it Works                                  */
/* -------------------------------------------------------------------------- */

function HowItWorks() {
  const steps = [
    {
      n: '01',
      icon: <Target className="h-5 w-5" />,
      title: 'Pick a problem',
      text: 'URL shortener. Distributed rate limiter. Newsfeed. Each problem ships with constraints, scale assumptions, and success criteria.',
    },
    {
      n: '02',
      icon: <Workflow className="h-5 w-5" />,
      title: 'Design on the canvas',
      text: 'Drop typed components onto the board. Wire them with sync, async, or pub/sub edges. Annotate with QPS, replicas, sharding key, TTL.',
    },
    {
      n: '03',
      icon: <Zap className="h-5 w-5" />,
      title: 'Submit & get graded',
      text: 'Hit Compile. In under 30s, see per-criterion scores, evidence quoted from your design, and named gaps mapped to drills.',
    },
    {
      n: '04',
      icon: <Layers className="h-5 w-5" />,
      title: 'Drill the gap',
      text: "Weak on hot-key handling? Tomorrow's deck has consistent hashing, request coalescing, and a follow-up problem to retry.",
    },
  ]

  return (
    <section className="container py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="default" className="mb-4">
          The loop
        </Badge>
        <h2 className="text-balance font-display text-3xl font-semibold tracking-tight md:text-5xl">
          Design → grade → drill. Every day.
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">
          The shortest path from &ldquo;I read about caches&rdquo; to &ldquo;I can defend my caching choice
          in front of a staff engineer.&rdquo;
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className="relative rounded-xl border border-border/60 bg-card/40 p-6 transition-colors hover:border-border"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs font-medium text-muted-foreground">
                {s.n}
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                {s.icon}
              </span>
            </div>
            <h3 className="mb-1.5 font-semibold">{s.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            {i < steps.length - 1 ? (
              <div className="absolute top-1/2 right-0 hidden h-px w-6 translate-x-3 bg-border lg:block" />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Curriculum strip                              */
/* -------------------------------------------------------------------------- */

function CurriculumSection() {
  const problems = [
    { title: 'URL Shortener', tag: 'KV · Cache', difficulty: 'Easy', free: true },
    { title: 'Distributed Rate Limiter', tag: 'Token bucket', difficulty: 'Medium', free: true },
    { title: 'News Feed (Twitter-style)', tag: 'Fanout · Cache', difficulty: 'Hard' },
    { title: 'Group Chat (WhatsApp-style)', tag: 'Pub/Sub', difficulty: 'Hard' },
    { title: 'Ride-share Dispatch (Uber)', tag: 'Geohash · MQ', difficulty: 'Hard' },
    { title: 'Top-K Analytics', tag: 'Stream · Heap', difficulty: 'Medium' },
    { title: 'Distributed Cache (memcache)', tag: 'Consistent hash', difficulty: 'Medium' },
    { title: 'Notification System', tag: 'Queues · Workers', difficulty: 'Medium' },
    { title: 'Web Crawler', tag: 'BFS · Politeness', difficulty: 'Medium' },
    { title: 'Real-time Leaderboard', tag: 'Sorted set · TTL', difficulty: 'Easy' },
  ]
  return (
    <section className="border-t border-border/40 bg-card/20 py-24">
      <div className="container">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Badge className="mb-3">Curriculum</Badge>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              10 hand-curated problems. Each with rubric + reference solution.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Authored by senior engineers who have actually run these interview loops.
              Quality over quantity.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/problems">
              View all problems
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <Link
              key={p.title}
              href="/problems"
              className="group flex items-center justify-between rounded-lg border border-border/60 bg-card/60 p-4 transition-all hover:border-brand-500/40 hover:bg-card"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{p.title}</span>
                  {p.free ? (
                    <Badge variant="success" className="text-[10px]">
                      Free
                    </Badge>
                  ) : null}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{p.tag}</div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Badge
                  variant={
                    p.difficulty === 'Easy'
                      ? 'success'
                      : p.difficulty === 'Medium'
                        ? 'warning'
                        : 'destructive'
                  }
                >
                  {p.difficulty}
                </Badge>
                <ArrowRight className="h-4 w-4 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Testimonials                                */
/* -------------------------------------------------------------------------- */

function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Cleared the L5 system design loop at a hyperscaler in 6 weeks. The rubric feedback is the closest thing to a real staff engineer I've ever practiced with.",
      name: 'Priya N.',
      role: 'Senior SWE, ex-Stripe → Big Tech',
    },
    {
      quote:
        "I'd done 20 mock interviews on Hello Interview. SysDesign Gym replaced all of them. The canvas + grading loop is the practice surface that was missing.",
      name: 'Marcus T.',
      role: 'Staff Engineer, late-stage startup',
    },
    {
      quote:
        'New-grad here. Got rejected from every system design round last cycle. Came back this year fluent. The fundamentals + spaced drills made the difference.',
      name: 'Aarav S.',
      role: 'New-grad SWE, FAANG offer',
    },
  ]
  return (
    <section className="container py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <Badge className="mb-4">From the practice mat</Badge>
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
          Engineers shipping offers.
        </h2>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.name} className="bg-card/60">
            <CardContent className="space-y-4 p-7">
              <Quote className="h-6 w-6 text-brand-400" />
              <p className="text-base leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </p>
              <Separator />
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Pricing teaser                                */
/* -------------------------------------------------------------------------- */

function PricingTeaser() {
  return (
    <section className="border-t border-border/40 bg-spotlight py-24">
      <div className="container">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
          <div>
            <Badge className="mb-3">Pricing</Badge>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              $24/mo. Cancel any time. Pays for itself the day you sign the offer.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Less than a single hour of a mock interview. Unlimited grading, all
              problems, all reference solutions. Student plan available with .edu email.
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild variant="gradient" size="lg">
                <Link href="/pricing">See plans</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login?intent=signup">Try free</Link>
              </Button>
            </div>
          </div>
          <Card className="bg-gradient-to-br from-card via-card to-brand-500/5 ring-1 ring-brand-500/30">
            <CardContent className="space-y-6 p-7">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-semibold tracking-tight">$24</span>
                <span className="text-muted-foreground">/ month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Pro plan — full access. Free plan includes 2 problems forever.
              </p>
              <ul className="space-y-2 text-sm">
                <CheckLine>All 10 problems + every new release</CheckLine>
                <CheckLine>Unlimited AI rubric grading</CheckLine>
                <CheckLine>Reference solutions + side-by-side diff</CheckLine>
                <CheckLine>Personalized weak-area analytics</CheckLine>
                <CheckLine>Student plan: $12/mo with .edu</CheckLine>
              </ul>
              <Button asChild variant="default" className="w-full">
                <Link href="/pricing">
                  Compare plans <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

function CheckLine({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
      <span>{children}</span>
    </li>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    FAQ                                     */
/* -------------------------------------------------------------------------- */

function FaqSection() {
  const items = [
    {
      q: 'Is this another video course?',
      a: "No. Reading and watching is what you've already tried. SysDesign Gym is a practice surface — you actually design things and get feedback. Lessons exist only to support the drills.",
    },
    {
      q: 'How is the AI grading not generic?',
      a: 'Each problem has a rubric authored by a senior engineer who has run that interview loop. The AI is constrained to the rubric, must cite specific nodes from your design, and falls back to Claude Opus when the answer is unusual.',
    },
    {
      q: 'How do I know my interview rounds are like your problems?',
      a: 'Our top 10 problems are mined from publicly disclosed FAANG/unicorn loops over the last 3 years. They cover the full breadth: capacity, data modeling, sharding, failure modes, scaling reads.',
    },
    {
      q: 'Can I use it on my phone?',
      a: 'Lessons and dashboard, yes. The full canvas is web-only — drag-drop architecture on a 6-inch screen is masochism. A mobile companion app for flashcards + audio mock interviewer is on the roadmap.',
    },
    {
      q: 'I am already senior. What do I get?',
      a: 'A practice surface for the parts you do not see day-to-day. Most senior engineers have deep expertise in 2-3 system shapes; this lets you drill the long tail before architecture reviews and L6/L7 loops.',
    },
  ]
  return (
    <section className="container py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <Badge className="mb-3">FAQ</Badge>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Things engineers ask
          </h2>
        </div>
        <div className="divide-y divide-border/60 rounded-xl border border-border/60 bg-card/40">
          {items.map((it) => (
            <details key={it.q} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between text-left">
                <span className="font-medium">{it.q}</span>
                <span className="text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {it.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    CTA                                     */
/* -------------------------------------------------------------------------- */

function CTASection() {
  return (
    <section className="container py-24">
      <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-600/15 via-card to-card p-10 md:p-16">
        <div className="absolute inset-0 bg-grid-faint opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
        <div className="relative mx-auto max-w-2xl text-center">
          <Trophy className="mx-auto mb-5 h-10 w-10 text-brand-400" />
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl text-balance">
            Ship the offer.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Two problems free, no credit card. Upgrade only when the loop hooks you —
            and it will.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="gradient">
              <Link href="/login?intent=signup">
                Start practicing now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/pricing">See pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

