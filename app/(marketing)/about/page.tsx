import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Target, Compass, Users, Sparkles } from 'lucide-react'

export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div>
      <section className="bg-spotlight">
        <div className="container py-20 md:py-28">
          <div className="mx-auto max-w-3xl">
            <Badge className="mb-4">Our story</Badge>
            <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl text-balance">
              Built by engineers who got tired of pretending to read books.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              We&apos;ve all been there: you watch ByteByteGo, you read every Grokking
              chapter, you nod along confidently — and then you draw a blank during a
              loop. Knowledge without practice is theatre. We built the practice gym.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            What we believe
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <PrincipleCard
              icon={<Target className="h-5 w-5" />}
              title="Practice beats reading"
              text="Every system design lesson on this site supports a drill. Reading without doing is forbidden."
            />
            <PrincipleCard
              icon={<Compass className="h-5 w-5" />}
              title="Rubrics > vibes"
              text="The grader is constrained by a senior engineer's rubric. The LLM doesn't decide what matters — the rubric does."
            />
            <PrincipleCard
              icon={<Users className="h-5 w-5" />}
              title="Engineers first"
              text="No popups, no ads, no growth-hack dark patterns. We sell a tool to people who can tell the difference."
            />
            <PrincipleCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Quality over breadth"
              text="10 problems with deep rubrics beats 100 with thin ones. We add slowly and obsessively."
            />
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            Want to talk?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Feature ideas, content corrections, partnerships, or just to share your
            offer story — we read everything.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild variant="gradient">
              <Link href="mailto:hello@sysdesign.gym">Email us</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login?intent=signup">Try the product</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function PrincipleCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <Card className="bg-card/60">
      <CardContent className="space-y-3 p-7">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  )
}
