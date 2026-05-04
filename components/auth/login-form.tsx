'use client'

import * as React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toast'
import { createClient } from '@/lib/supabase/browser'
import { isSupabaseConfigured } from '@/lib/env'

export function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') ?? '/dashboard'
  const intent = params.get('intent') === 'signup' ? 'signup' : 'signin'
  const [email, setEmail] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [sent, setSent] = React.useState(false)

  if (!isSupabaseConfigured) {
    return <NotConfiguredCard next={next} />
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      })
      if (error) throw error
      setSent(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not send magic link'
      toast({ title: 'Sign-in failed', description: message, variant: 'destructive' })
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogle() {
    setBusy(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      })
      if (error) throw error
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed'
      toast({ title: 'Sign-in failed', description: message, variant: 'destructive' })
      setBusy(false)
    }
  }

  if (sent) {
    return (
      <div className="space-y-3 text-center">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
          <Mail className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a magic link to{' '}
          <span className="font-medium text-foreground">{email}</span>. Click it to sign
          in.
        </p>
        <Button variant="ghost" onClick={() => setSent(false)}>
          Use a different email
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight">
          {intent === 'signup' ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {intent === 'signup'
            ? 'Two problems free, no credit card.'
            : 'Sign in to keep your streak going.'}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogle}
        disabled={busy}
      >
        <GoogleIcon className="h-4 w-4" />
        Continue with Google
      </Button>

      <div className="relative text-center text-xs text-muted-foreground">
        <span className="relative z-10 bg-background px-3">or</span>
        <div className="absolute left-0 right-0 top-1/2 -z-0 h-px bg-border" />
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" variant="gradient" disabled={busy}>
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Send magic link
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        By continuing, you agree to our{' '}
        <Link href="/terms" className="underline">Terms</Link> and{' '}
        <Link href="/privacy" className="underline">Privacy Policy</Link>.
      </p>

      {/* Manual fallback for "skip auth" scenarios — go to /problems
          which middleware never gates, regardless of supabase config state */}
      <div className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/problems')}
          className="text-xs text-muted-foreground"
        >
          Skip — try the demo
        </Button>
      </div>
    </div>
  )
}

function NotConfiguredCard({ next }: { next: string }) {
  return (
    <div className="space-y-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 text-sm">
      <h2 className="font-semibold">Auth not configured</h2>
      <p className="text-muted-foreground">
        Set <code className="rounded bg-muted px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
        <code className="rounded bg-muted px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in
        your <code className="rounded bg-muted px-1">.env.local</code> to enable
        authentication. You can still explore the demo without signing in.
      </p>
      <Button asChild variant="outline" className="w-full">
        <Link href={next}>Continue to demo</Link>
      </Button>
    </div>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.6 12.227c0-.708-.064-1.39-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.995 3.018v2.51h3.232c1.89-1.741 2.981-4.305 2.981-7.351z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.964-.895 6.62-2.422l-3.233-2.51c-.895.6-2.04.954-3.387.954-2.605 0-4.81-1.76-5.595-4.123H3.064v2.59A9.996 9.996 0 0 0 12 22z"
        fill="#34A853"
      />
      <path
        d="M6.405 13.9a5.99 5.99 0 0 1 0-3.8V7.51H3.064a9.996 9.996 0 0 0 0 8.98l3.341-2.59z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.977c1.468 0 2.787.504 3.823 1.495l2.868-2.868C16.96 2.99 14.695 2 12 2A9.996 9.996 0 0 0 3.064 7.51l3.341 2.59C7.19 7.738 9.395 5.977 12 5.977z"
        fill="#EA4335"
      />
    </svg>
  )
}
