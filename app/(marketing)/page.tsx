import Link from 'next/link'
import {
  ArrowRight,
  Check,
  BookOpen,
  GraduationCap,
  Globe,
  Award,
  Users,
  Compass,
  Trophy,
  Quote,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Reveal,
  Stagger,
  StaggerItem,
  HoverLift,
  ParallaxBlob,
} from '@/components/marketing/motion'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen surface-1 text-foreground font-sans selection:bg-primary/20">
      <div className="pointer-events-none absolute inset-0 bg-dotted opacity-50" />
      <ParallaxBlob />
      <div className="relative z-10">
        <Hero />
        <SocialProof />
        <FeaturesSection />
        <HowItWorks />
        <CourseCurriculum />
        <TestimonialsSection />
        <PricingTeaser />
        <CTASection />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    HERO                                    */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 bg-spotlight">
      <div className="container relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Reveal delay={0}>
            <Badge
              variant="outline"
              className="mb-8 gap-1.5 rounded-md border-primary/30 bg-primary/10 py-1.5 font-display text-xs uppercase tracking-widest text-primary backdrop-blur-md"
            >
              <Globe className="h-3.5 w-3.5" />
              The Premier Gateway to Intellectual Excellence
            </Badge>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="text-balance font-display text-5xl font-bold leading-[1.1] tracking-tighter md:text-7xl">
              Learn in India. <br />
              <span className="text-gradient-brand">Lead the World.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-8 max-w-2xl text-pretty font-sans text-lg leading-relaxed text-muted-foreground md:text-xl">
              A modern academic platform bridging the prestige of traditional Indian
              education with cutting-edge learning technology. Access world-class courses,
              master your craft, and build your digital heritage.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-md px-8 font-display text-base tracking-wide"
              >
                <Link href="/login?intent=signup">
                  Submit Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-md px-8 font-display text-base tracking-wide hover:border-primary/50"
              >
                <Link href="/problems">Explore Courses</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-display text-sm uppercase tracking-wider text-muted-foreground">
              <CheckBullet>World-class faculty</CheckBullet>
              <CheckBullet>Interactive curriculum</CheckBullet>
              <CheckBullet>Global certification</CheckBullet>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function CheckBullet({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      <Check className="h-4 w-4 text-primary" />
      {children}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Social Proof                                */
/* -------------------------------------------------------------------------- */

function SocialProof() {
  const logos = ['IIT', 'IIM', 'IISc', 'AIIMS', 'NID', 'BITS']
  return (
    <section className="relative z-20 surface-2 border-y border-hairline py-12">
      <div className="container">
        <Reveal>
          <p className="text-center font-display text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Partnered with India&apos;s most prestigious institutions
          </p>
        </Reveal>
        <Stagger delay={0.05} className="mt-8 grid grid-cols-3 gap-8 md:grid-cols-6">
          {logos.map((l) => (
            <StaggerItem key={l}>
              <div className="flex cursor-default items-center justify-center font-display text-2xl font-bold tracking-widest text-foreground/40 transition-all hover:text-primary hover:opacity-100">
                {l}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Features (3 cards)                            */
/* -------------------------------------------------------------------------- */

function FeaturesSection() {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="text-balance font-display text-4xl font-bold tracking-tighter md:text-5xl">
              Academic rigor meets modern efficiency.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 font-sans text-lg leading-relaxed text-muted-foreground">
              Our platform is designed to minimize cognitive load and maximize intellectual
              growth, combining authoritative content with an accessible, distraction-free
              environment.
            </p>
          </Reveal>
        </div>

        <Stagger delay={0.08} className="mt-24 grid gap-8 md:grid-cols-3">
          <StaggerItem>
            <FeatureCard
              icon={<BookOpen className="h-6 w-6" />}
              title="Curated Knowledge"
              description="Access peer-reviewed materials, extensive digital archives, and interactive problem sets designed by industry experts and academic leaders."
            />
          </StaggerItem>
          <StaggerItem>
            <FeatureCard
              icon={<Award className="h-6 w-6" />}
              title="Verified Excellence"
              description="Earn certificates that carry weight. Our grading rubrics are strict, ensuring that your achievements represent true mastery of the subject."
              featured
            />
          </StaggerItem>
          <StaggerItem>
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Global Network"
              description="Connect with a diverse cohort of ambitious peers. Participate in guided discussions, collaborative projects, and live mentoring sessions."
            />
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  featured,
}: {
  icon: React.ReactNode
  title: string
  description: string
  featured?: boolean
}) {
  return (
    <HoverLift>
      <Card
        className={`relative h-full overflow-hidden rounded-lg border surface-3 transition-colors ${
          featured
            ? 'border-primary/50 shadow-[0_0_30px_hsl(var(--primary)/0.12)]'
            : 'border-hairline hover:border-primary/30'
        }`}
      >
        {featured && (
          <div className="absolute top-0 right-0 p-4">
            <Badge className="rounded font-display text-[10px] uppercase tracking-widest">
              Premium
            </Badge>
          </div>
        )}
        <CardContent className="space-y-6 p-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight">{title}</h3>
            <p className="mt-4 font-sans text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </HoverLift>
  )
}

/* -------------------------------------------------------------------------- */
/*                              How it Works                                  */
/* -------------------------------------------------------------------------- */

function HowItWorks() {
  const steps = [
    {
      n: '01',
      icon: <Compass className="h-5 w-5" />,
      title: 'Discover',
      text: 'Browse our extensive catalog of specialized courses and structured learning paths tailored to your career goals.',
    },
    {
      n: '02',
      icon: <BookOpen className="h-5 w-5" />,
      title: 'Engage',
      text: 'Immerse yourself in high-definition video lectures, interactive reading materials, and rigorous practical exercises.',
    },
    {
      n: '03',
      icon: <GraduationCap className="h-5 w-5" />,
      title: 'Master',
      text: 'Submit your assignments for detailed review. Iteratively improve your understanding through personalized feedback.',
    },
    {
      n: '04',
      icon: <Trophy className="h-5 w-5" />,
      title: 'Achieve',
      text: 'Earn your verified credential and join our alumni network of distinguished professionals across the globe.',
    },
  ]

  return (
    <section className="relative z-20 surface-2 border-y border-hairline py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="font-display text-4xl font-bold tracking-tighter md:text-5xl">
              Your path to mastery.
            </h2>
          </Reveal>
        </div>

        <Stagger delay={0.07} className="mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <StaggerItem key={s.n}>
              <HoverLift>
                <div className="relative h-full rounded-lg border border-hairline surface-3 p-8 transition-colors hover:border-primary/30">
                  <div className="mb-8 flex items-center justify-between">
                    <span className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      STEP {s.n}
                    </span>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded border border-primary/20 bg-primary/5 text-primary">
                      {s.icon}
                    </span>
                  </div>
                  <h3 className="mb-4 font-display text-xl font-bold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="font-sans text-base leading-relaxed text-muted-foreground">
                    {s.text}
                  </p>
                  {i < steps.length - 1 ? (
                    <div className="absolute top-1/2 right-0 hidden h-px w-8 translate-x-4 bg-hairline lg:block" />
                  ) : null}
                </div>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Course Curriculum                             */
/* -------------------------------------------------------------------------- */

function CourseCurriculum() {
  const problems = [
    { title: 'Advanced Distributed Systems', tag: 'Computer Science', level: 'Graduate', free: true },
    { title: 'Machine Learning Fundamentals', tag: 'Artificial Intelligence', level: 'Undergrad', free: true },
    { title: 'Financial Engineering', tag: 'Economics', level: 'Professional' },
    { title: 'Modern Indian History', tag: 'Humanities', level: 'Undergrad' },
    { title: 'Quantum Computing Mechanics', tag: 'Physics', level: 'Graduate' },
    { title: 'Sustainable Architecture', tag: 'Design', level: 'Professional' },
  ]
  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal className="max-w-2xl">
            <h2 className="font-display text-4xl font-bold tracking-tighter md:text-5xl">
              Explore Our Catalog
            </h2>
            <p className="mt-6 font-sans text-lg text-muted-foreground">
              Carefully curated subjects designed to push the boundaries of your knowledge.
              Filter by discipline and enroll today.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-md border-hairline px-6 font-display tracking-wide"
            >
              <Link href="/problems">
                View all courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>

        <Stagger delay={0.06} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <StaggerItem key={p.title}>
              <HoverLift>
                <Link
                  href="/problems"
                  className="group flex h-full flex-col justify-between rounded-lg border border-hairline surface-3 p-8 transition-colors hover:border-primary/30"
                >
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <span className="inline-flex rounded border border-hairline bg-muted/40 px-2.5 py-1 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {p.tag}
                      </span>
                      {p.free && (
                        <span className="inline-flex rounded border border-primary/30 bg-primary/10 px-2 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-primary">
                          Free Preview
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-bold tracking-tight transition-colors group-hover:text-primary">
                      {p.title}
                    </h3>
                  </div>

                  <div className="mt-12 flex items-center justify-between border-t border-hairline pt-6">
                    <span className="font-sans text-sm font-medium text-muted-foreground">
                      {p.level}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded border border-hairline bg-muted/40 transition-colors group-hover:border-primary/50 group-hover:bg-primary/10">
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                  </div>
                </Link>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
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
        'The depth of the curriculum and the quality of the mentorship transformed my career trajectory. It truly feels like an Ivy League experience online.',
      name: 'Aditi Sharma',
      role: 'Lead Data Scientist',
    },
    {
      quote:
        'A perfectly structured learning environment. The focus on fundamentals combined with modern application makes this platform unmatched.',
      name: 'Vikram Patel',
      role: 'Senior Architect',
    },
    {
      quote:
        "I was able to transition into a new field seamlessly. The platform's intuitive design kept me focused on what mattered most: the content.",
      name: 'Neha Gupta',
      role: 'Product Manager',
    },
  ]
  return (
    <section className="relative z-20 surface-2 border-y border-hairline py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="font-display text-4xl font-bold tracking-tighter md:text-5xl">
              Success stories.
            </h2>
          </Reveal>
        </div>

        <Stagger delay={0.07} className="mt-24 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <HoverLift>
                <Card className="h-full rounded-lg border-hairline surface-3">
                  <CardContent className="space-y-8 p-8">
                    <Quote className="h-8 w-8 text-primary opacity-60" />
                    <p className="font-sans text-lg leading-relaxed text-muted-foreground">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <Separator className="bg-hairline" />
                    <div>
                      <div className="font-display font-bold tracking-wide">{t.name}</div>
                      <div className="mt-1 font-sans text-sm text-muted-foreground">
                        {t.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Pricing teaser                                */
/* -------------------------------------------------------------------------- */

function PricingTeaser() {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto grid max-w-5xl items-center gap-16 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-4xl font-bold tracking-tighter md:text-5xl">
              Invest in your intellectual future.
            </h2>
            <p className="mt-6 font-sans text-lg leading-relaxed text-muted-foreground">
              Unlock the entire library of courses, premium mentorship, and verified
              certificates. Join a community of scholars and professionals dedicated to
              excellence.
            </p>
            <div className="mt-12 flex gap-4">
              <Button
                asChild
                className="rounded-md px-8 py-6 font-display text-base tracking-wide"
              >
                <Link href="/login?intent=signup">Enroll Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-md border-hairline px-8 py-6 font-display text-base tracking-wide"
              >
                <Link href="/problems">View Free Content</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <HoverLift>
              <Card className="relative overflow-hidden rounded-lg border-hairline surface-3 shadow-[0_20px_60px_hsl(var(--foreground)/0.12)]">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
                <CardContent className="space-y-8 p-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-5xl font-bold tracking-tighter">
                          ₹1,999
                        </span>
                        <span className="font-display text-sm uppercase tracking-widest text-muted-foreground">
                          / month
                        </span>
                      </div>
                      <p className="mt-4 font-sans text-sm text-muted-foreground">
                        Premium Academic Access
                      </p>
                    </div>
                    <Badge className="rounded font-display text-[10px] uppercase tracking-widest">
                      Popular
                    </Badge>
                  </div>

                  <ul className="space-y-5 font-sans text-sm text-muted-foreground">
                    <CheckLine>Unlimited access to all course materials</CheckLine>
                    <CheckLine>Verified certificates upon completion</CheckLine>
                    <CheckLine>1-on-1 career mentoring sessions</CheckLine>
                    <CheckLine>Exclusive alumni network access</CheckLine>
                    <CheckLine>Offline viewing capabilities</CheckLine>
                  </ul>
                </CardContent>
              </Card>
            </HoverLift>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function CheckLine({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-4">
      <div className="rounded border border-primary/30 bg-primary/10 p-1">
        <Check className="h-3 w-3 text-primary" />
      </div>
      <span className="font-medium text-foreground/85">{children}</span>
    </li>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    CTA                                     */
/* -------------------------------------------------------------------------- */

function CTASection() {
  return (
    <section className="relative z-20 py-32">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-lg border border-hairline surface-3 p-12 text-center shadow-[0_0_50px_hsl(var(--primary)/0.08)] md:p-24">
            <div className="absolute inset-0 bg-spotlight opacity-60" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-balance font-display text-4xl font-bold tracking-tighter md:text-5xl">
                Begin your journey today.
              </h2>
              <p className="mt-6 font-sans text-lg text-muted-foreground">
                Join thousands of students and professionals who are shaping the future.
                Your digital heritage starts here.
              </p>
              <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-14 rounded-md px-10 font-display text-base tracking-wide"
                >
                  <Link href="/login?intent=signup">Submit Application</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
