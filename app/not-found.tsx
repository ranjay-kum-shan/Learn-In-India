import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mb-4 font-display text-7xl font-semibold tracking-tight text-gradient-brand">
          404
        </div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          That page didn&apos;t make it onto the rubric.
        </h1>
        <p className="mt-3 text-muted-foreground">
          The URL you tried doesn&apos;t exist. If you think it should, drop us a note.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild variant="gradient">
            <Link href="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/problems">
              <ArrowLeft className="h-4 w-4" />
              Browse problems
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
