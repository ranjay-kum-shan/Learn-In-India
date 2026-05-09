import { Suspense } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/marketing/logo'
import { LoginForm } from '@/components/auth/login-form'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = { title: 'Sign in' }

export default function LoginPage() {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      {/* Left — quote / brand */}
      <div className="relative hidden overflow-hidden bg-[#050505] text-white lg:flex">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute inset-0 border-r border-[#191A1F]" />
        <div className="relative flex w-full flex-col justify-between p-10">
          <Link href="/" className="text-white">
            <Logo className="text-white" />
          </Link>
          <div className="space-y-3">
            <p className="max-w-md font-display text-2xl font-bold leading-snug tracking-tight">
              &ldquo;The first 30 minutes felt like every senior I&apos;ve ever paired with. The
              feedback was that good.&rdquo;
            </p>
            <p className="text-sm text-muted-foreground">— Senior SWE, recently offered at a hyperscaler</p>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="relative flex items-center justify-center bg-[#131313] p-6 sm:p-10">
        <Link href="/" className="absolute left-6 top-6 lg:hidden">
          <Logo />
        </Link>
        <div className="w-full max-w-sm">
          <Suspense fallback={<Skeleton className="h-72 w-full" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
