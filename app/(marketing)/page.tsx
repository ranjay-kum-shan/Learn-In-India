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
    <div className="bg-slate-50 text-slate-900 font-serif selection:bg-brand-500/20">
      <Hero />
      <SocialProof />
      <FeaturesSection />
      <HowItWorks />
      <CourseCurriculum />
      <TestimonialsSection />
      <PricingTeaser />
      <CTASection />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    HERO                                    */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-grid-faint opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black,transparent)]" />
      <div className="container relative pb-24 pt-16 md:pt-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge variant="outline" className="mb-6 gap-1.5 py-1.5 text-xs font-sans text-brand-500 border-brand-500/30 bg-brand-500/5">
            <Globe className="h-3.5 w-3.5" />
            The Premier Gateway to Intellectual Excellence
          </Badge>
          <h1 className="text-balance font-display text-5xl font-bold tracking-tight text-brand-500 md:text-7xl">
            Learn in India. <br />
            <span className="text-brand-600">Lead the World.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600 md:text-xl font-serif">
            A modern academic platform bridging the prestige of traditional Indian education with cutting-edge learning technology.
            Access world-class courses, master your craft, and build your digital heritage.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="text-base bg-brand-500 hover:bg-brand-500/90 text-white rounded-lg shadow-sm hover:shadow-md transition-all px-8">
              <Link href="/login?intent=signup" className="font-sans font-semibold">
                Submit Application
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base font-sans rounded-lg border-slate-300 text-brand-500 hover:bg-slate-50 px-8">
              <Link href="/problems">Explore Courses</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500 font-sans font-medium">
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
      <Check className="h-4 w-4 text-brand-600" />
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
    <section className="border-y border-slate-200 bg-white py-12">
      <div className="container">
        <p className="text-center text-xs font-sans font-semibold uppercase tracking-widest text-slate-400">
          Partnered with India's most prestigious institutions
        </p>
        <div className="mt-8 grid grid-cols-3 gap-8 opacity-60 md:grid-cols-6">
          {logos.map((l) => (
            <div
              key={l}
              className="flex items-center justify-center font-display text-xl font-bold tracking-wide text-slate-400 grayscale hover:grayscale-0 transition-all cursor-default"
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
    <section className="bg-slate-50 py-24 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-brand-500 md:text-5xl">
            Academic rigor meets modern efficiency.
          </h2>
          <p className="mt-6 text-lg text-slate-600 font-serif leading-relaxed">
            Our platform is designed to minimize cognitive load and maximize intellectual growth, combining authoritative content with an accessible, distraction-free environment.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
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
      className={`relative overflow-hidden rounded-xl border-none shadow-[0_16px_50px_rgba(10,15,28,0.04)] bg-white transition-transform hover:-translate-y-1 duration-300 ${
        featured ? 'ring-2 ring-brand-400 ring-offset-2' : ''
      }`}
    >
      {featured && (
        <div className="absolute top-0 right-0 p-4">
          <Badge className="bg-brand-600 hover:bg-brand-600/90 text-white font-sans text-[10px] uppercase tracking-wider">Premium</Badge>
        </div>
      )}
      <CardContent className="space-y-5 p-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
          {icon}
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-slate-900">{title}</h3>
          <p className="mt-4 text-base leading-relaxed text-slate-600 font-serif">
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
    <section className="border-t border-slate-200 bg-white py-24 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-brand-500 md:text-5xl">
            Your path to mastery.
          </h2>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="relative rounded-xl border border-slate-100 bg-slate-50/50 p-8 transition-colors hover:bg-white hover:border-slate-200 hover:shadow-sm"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-sans text-sm font-bold text-slate-400">
                  STEP {s.n}
                </span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-400/10 text-brand-400">
                  {s.icon}
                </span>
              </div>
              <h3 className="mb-3 font-display text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="text-base leading-relaxed text-slate-600 font-serif">{s.text}</p>
              {i < steps.length - 1 ? (
                <div className="absolute top-1/2 right-0 hidden h-px w-8 translate-x-4 bg-slate-200 lg:block" />
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
    <section className="bg-slate-50 py-24">
      <div className="container">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-brand-500 md:text-4xl">
              Explore Our Catalog
            </h2>
            <p className="mt-4 text-lg text-slate-600 font-serif">
              Carefully curated subjects designed to push the boundaries of your knowledge.
              Filter by discipline and enroll today.
            </p>
          </div>
          <Button asChild variant="outline" className="font-sans border-slate-300 text-brand-500">
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
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(10,15,28,0.02)] transition-all hover:border-brand-400/50 hover:shadow-[0_8px_30px_rgba(10,15,28,0.06)]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md bg-slate-100 text-brand-500 font-sans text-xs font-semibold">
                    {p.tag}
                  </span>
                  {p.free && (
                    <span className="inline-flex px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 font-sans text-[10px] font-bold uppercase tracking-wider">
                      Free Preview
                    </span>
                  )}
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-brand-500 transition-colors">
                  {p.title}
                </h3>
              </div>
              
              <div className="mt-8 flex items-center justify-between">
                <span className="font-sans text-sm font-medium text-slate-500">
                  {p.level}
                </span>
                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-500 transition-colors">
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
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
    <section className="border-y border-slate-200 bg-white py-24 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-brand-500 md:text-5xl">
            Success stories.
          </h2>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="bg-slate-50 border-none shadow-sm">
              <CardContent className="space-y-6 p-8">
                <Quote className="h-8 w-8 text-brand-600 opacity-50" />
                <p className="text-lg leading-relaxed text-slate-700 font-serif italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <Separator className="bg-slate-200" />
                <div>
                  <div className="font-sans font-bold text-slate-900">{t.name}</div>
                  <div className="font-sans text-sm text-slate-500 mt-1">{t.role}</div>
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
    <section className="bg-slate-50 py-24 md:py-32">
      <div className="container">
        <div className="mx-auto grid max-w-5xl items-center gap-16 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-brand-500 md:text-4xl">
              Invest in your intellectual future.
            </h2>
            <p className="mt-6 text-lg text-slate-600 font-serif leading-relaxed">
              Unlock the entire library of courses, premium mentorship, and verified certificates. 
              Join a community of scholars and professionals dedicated to excellence.
            </p>
            <div className="mt-10 flex gap-4">
              <Button asChild className="bg-brand-500 hover:bg-brand-500/90 text-white font-sans px-8 py-6 text-base">
                <Link href="/login?intent=signup">Enroll Now</Link>
              </Button>
              <Button asChild variant="outline" className="font-sans text-brand-500 border-slate-300 px-8 py-6 text-base">
                <Link href="/problems">View Free Content</Link>
              </Button>
            </div>
          </div>
          <Card className="border-none shadow-[0_20px_60px_rgba(26,35,126,0.08)] bg-white ring-1 ring-slate-200">
            <CardContent className="space-y-8 p-10">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-display font-bold text-slate-900">₹1,999</span>
                    <span className="text-slate-500 font-sans font-medium">/ month</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-500 font-sans">
                    Premium Academic Access
                  </p>
                </div>
                <Badge className="bg-brand-600 text-white font-sans uppercase tracking-wider text-[10px]">Popular</Badge>
              </div>
              
              <ul className="space-y-4 text-slate-600 font-sans text-sm">
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
    <li className="flex items-center gap-3">
      <div className="rounded-full bg-emerald-50 p-1">
        <Check className="h-3 w-3 text-emerald-600" />
      </div>
      <span className="font-medium text-slate-700">{children}</span>
    </li>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    CTA                                     */
/* -------------------------------------------------------------------------- */

function CTASection() {
  return (
    <section className="bg-brand-500 py-24">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl bg-brand-500 p-10 text-center md:p-20 border border-brand-400/30">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl text-balance">
              Begin your journey today.
            </h2>
            <p className="mt-6 text-lg text-brand-100 font-serif">
              Join thousands of students and professionals who are shaping the future.
              Your digital heritage starts here.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-brand-600 hover:bg-brand-600/90 text-white font-sans text-base px-10 h-14 rounded-lg shadow-lg">
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
