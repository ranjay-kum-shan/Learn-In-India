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

export default function LandingPage() {
  return (
    <div className="bg-[#050505] text-foreground font-sans selection:bg-brand-primary/20 min-h-screen relative">
      <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none" />
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
    <section className="relative overflow-hidden pt-24 pb-32">
      <div className="container relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Badge variant="outline" className="mb-8 gap-1.5 py-1.5 text-xs font-display uppercase tracking-widest text-brand-primary border-brand-primary/30 bg-brand-primary/10 backdrop-blur-md rounded-md">
            <Globe className="h-3.5 w-3.5" />
            The Premier Gateway to Intellectual Excellence
          </Badge>
          <h1 className="text-balance font-display text-5xl font-bold tracking-tighter text-white md:text-7xl leading-[1.1]">
            Learn in India. <br />
            <span className="text-brand-primary">Lead the World.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl font-sans">
            A modern academic platform bridging the prestige of traditional Indian education with cutting-edge learning technology.
            Access world-class courses, master your craft, and build your digital heritage.
          </p>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="text-base bg-brand-primary hover:bg-brand-primary/90 text-brand-onPrimary rounded-md font-display tracking-wide px-8 h-14">
              <Link href="/login?intent=signup">
                Submit Application
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base font-display tracking-wide rounded-md border-brand-outline text-white hover:bg-white/5 hover:border-brand-primary/50 px-8 h-14 transition-colors">
              <Link href="/problems">Explore Courses</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground font-display tracking-wider uppercase">
            <CheckBullet>World-class faculty</CheckBullet>
            <CheckBullet>Interactive curriculum</CheckBullet>
            <CheckBullet>Global certification</CheckBullet>
          </div>
        </div>
      </div>
    </section>
  )
}

function CheckBullet({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      <Check className="h-4 w-4 text-brand-primary" />
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
    <section className="border-y border-brand-outline/30 bg-[#000000] py-12 relative z-20">
      <div className="container">
        <p className="text-center text-xs font-display font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Partnered with India's most prestigious institutions
        </p>
        <div className="mt-8 grid grid-cols-3 gap-8 opacity-40 md:grid-cols-6">
          {logos.map((l) => (
            <div
              key={l}
              className="flex items-center justify-center font-display text-2xl font-bold tracking-widest text-white hover:text-brand-primary hover:opacity-100 transition-all cursor-default"
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
/*                              Features (3 cards)                            */
/* -------------------------------------------------------------------------- */

function FeaturesSection() {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance font-display text-4xl font-bold tracking-tighter text-white md:text-5xl">
            Academic rigor meets modern efficiency.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground font-sans leading-relaxed">
            Our platform is designed to minimize cognitive load and maximize intellectual growth, combining authoritative content with an accessible, distraction-free environment.
          </p>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<BookOpen className="h-6 w-6" />}
            title="Curated Knowledge"
            description="Access peer-reviewed materials, extensive digital archives, and interactive problem sets designed by industry experts and academic leaders."
          />
          <FeatureCard
            icon={<Award className="h-6 w-6" />}
            title="Verified Excellence"
            description="Earn certificates that carry weight. Our grading rubrics are strict, ensuring that your achievements represent true mastery of the subject."
            featured
          />
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="Global Network"
            description="Connect with a diverse cohort of ambitious peers. Participate in guided discussions, collaborative projects, and live mentoring sessions."
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
  featured,
}: {
  icon: React.ReactNode
  title: string
  description: string
  featured?: boolean
}) {
  return (
    <Card
      className={`relative overflow-hidden rounded-lg border bg-[#050505] transition-all duration-300 hover:-translate-y-1 hover:border-[#404040] ${
        featured ? 'border-brand-primary/50 shadow-[0_0_30px_rgba(208,188,255,0.1)]' : 'border-[#191A1F]'
      }`}
    >
      {featured && (
        <div className="absolute top-0 right-0 p-4">
          <Badge className="bg-brand-primary text-brand-onPrimary font-display text-[10px] uppercase tracking-widest rounded">Premium</Badge>
        </div>
      )}
      <CardContent className="space-y-6 p-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
          {icon}
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-white tracking-tight">{title}</h3>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground font-sans">
            {description}
          </p>
        </div>
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
      text: "Earn your verified credential and join our alumni network of distinguished professionals across the globe.",
    },
  ]

  return (
    <section className="border-t border-brand-outline/20 bg-[#000000] py-32 relative z-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tighter text-white md:text-5xl">
            Your path to mastery.
          </h2>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="relative rounded-lg border border-[#191A1F] bg-[#050505] p-8 transition-colors hover:border-[#404040]"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-display text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  STEP {s.n}
                </span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded border border-brand-primary/20 bg-brand-primary/5 text-brand-primary">
                  {s.icon}
                </span>
              </div>
              <h3 className="mb-4 font-display text-xl font-bold text-white tracking-tight">{s.title}</h3>
              <p className="text-base leading-relaxed text-muted-foreground font-sans">{s.text}</p>
              {i < steps.length - 1 ? (
                <div className="absolute top-1/2 right-0 hidden h-px w-8 translate-x-4 bg-[#404040] lg:block" />
              ) : null}
            </div>
          ))}
        </div>
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
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-bold tracking-tighter text-white md:text-5xl">
              Explore Our Catalog
            </h2>
            <p className="mt-6 text-lg text-muted-foreground font-sans">
              Carefully curated subjects designed to push the boundaries of your knowledge.
              Filter by discipline and enroll today.
            </p>
          </div>
          <Button asChild variant="outline" className="font-display tracking-wide rounded-md border-brand-outline text-white hover:bg-white/5 h-12 px-6">
            <Link href="/problems">
              View all courses
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <Link
              key={p.title}
              href="/problems"
              className="group flex flex-col justify-between rounded-lg border border-[#191A1F] bg-[#050505] p-8 transition-all hover:border-[#404040] hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex px-2.5 py-1 rounded border border-brand-outline/30 bg-white/5 text-muted-foreground font-display text-xs font-semibold tracking-wider uppercase">
                    {p.tag}
                  </span>
                  {p.free && (
                    <span className="inline-flex px-2 py-1 rounded border border-brand-primary/30 bg-brand-primary/10 text-brand-primary font-display text-[10px] font-bold uppercase tracking-widest">
                      Free Preview
                    </span>
                  )}
                </div>
                <h3 className="font-display text-xl font-bold text-white group-hover:text-brand-primary transition-colors tracking-tight">
                  {p.title}
                </h3>
              </div>
              
              <div className="mt-12 flex items-center justify-between border-t border-[#191A1F] pt-6">
                <span className="font-sans text-sm font-medium text-muted-foreground">
                  {p.level}
                </span>
                <div className="h-8 w-8 rounded bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-brand-primary/50 group-hover:bg-brand-primary/10 transition-colors">
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brand-primary transition-colors" />
                </div>
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
        "The depth of the curriculum and the quality of the mentorship transformed my career trajectory. It truly feels like an Ivy League experience online.",
      name: 'Aditi Sharma',
      role: 'Lead Data Scientist',
    },
    {
      quote:
        "A perfectly structured learning environment. The focus on fundamentals combined with modern application makes this platform unmatched.",
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
    <section className="border-y border-brand-outline/20 bg-[#000000] py-32 relative z-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tighter text-white md:text-5xl">
            Success stories.
          </h2>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="bg-[#050505] border-[#191A1F] rounded-lg">
              <CardContent className="space-y-8 p-8">
                <Quote className="h-8 w-8 text-brand-primary opacity-50" />
                <p className="text-lg leading-relaxed text-muted-foreground font-sans">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <Separator className="bg-[#191A1F]" />
                <div>
                  <div className="font-display font-bold text-white tracking-wide">{t.name}</div>
                  <div className="font-sans text-sm text-muted-foreground mt-1">{t.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
          <div>
            <h2 className="font-display text-4xl font-bold tracking-tighter text-white md:text-5xl">
              Invest in your intellectual future.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground font-sans leading-relaxed">
              Unlock the entire library of courses, premium mentorship, and verified certificates. 
              Join a community of scholars and professionals dedicated to excellence.
            </p>
            <div className="mt-12 flex gap-4">
              <Button asChild className="bg-brand-primary hover:bg-brand-primary/90 text-brand-onPrimary font-display tracking-wide px-8 py-6 text-base rounded-md">
                <Link href="/login?intent=signup">Enroll Now</Link>
              </Button>
              <Button asChild variant="outline" className="font-display tracking-wide text-white border-brand-outline hover:bg-white/5 px-8 py-6 text-base rounded-md">
                <Link href="/problems">View Free Content</Link>
              </Button>
            </div>
          </div>
          <Card className="border-[#404040] shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-[#050505] rounded-lg relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-50" />
            <CardContent className="space-y-8 p-10">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-display font-bold text-white tracking-tighter">₹1,999</span>
                    <span className="text-muted-foreground font-display text-sm tracking-widest uppercase">/ month</span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground font-sans">
                    Premium Academic Access
                  </p>
                </div>
                <Badge className="bg-brand-primary text-brand-onPrimary font-display uppercase tracking-widest text-[10px] rounded">Popular</Badge>
              </div>
              
              <ul className="space-y-5 text-muted-foreground font-sans text-sm">
                <CheckLine>Unlimited access to all course materials</CheckLine>
                <CheckLine>Verified certificates upon completion</CheckLine>
                <CheckLine>1-on-1 career mentoring sessions</CheckLine>
                <CheckLine>Exclusive alumni network access</CheckLine>
                <CheckLine>Offline viewing capabilities</CheckLine>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

function CheckLine({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-4">
      <div className="rounded border border-brand-primary/30 bg-brand-primary/10 p-1">
        <Check className="h-3 w-3 text-brand-primary" />
      </div>
      <span className="font-medium text-slate-300">{children}</span>
    </li>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    CTA                                     */
/* -------------------------------------------------------------------------- */

function CTASection() {
  return (
    <section className="py-32 relative z-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-lg bg-[#050505] p-12 text-center md:p-24 border border-[#404040] shadow-[0_0_50px_rgba(208,188,255,0.05)]">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary via-transparent to-transparent" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-4xl font-bold tracking-tighter text-white md:text-5xl text-balance">
              Begin your journey today.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground font-sans">
              Join thousands of students and professionals who are shaping the future.
              Your digital heritage starts here.
            </p>
            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-onPrimary font-display tracking-wide text-base px-10 h-14 rounded-md">
                <Link href="/login?intent=signup">
                  Submit Application
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

