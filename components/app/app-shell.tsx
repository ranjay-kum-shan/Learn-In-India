'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Layers,
  BookOpen,
  CreditCard,
  LogOut,
  User as UserIcon,
} from 'lucide-react'
import { Logo } from '@/components/marketing/logo'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown'
import { Badge } from '@/components/ui/badge'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/problems', label: 'Problems', icon: Layers },
  { href: '/lessons', label: 'Lessons', icon: BookOpen },
  { href: '/billing', label: 'Billing', icon: CreditCard },
]

export function AppShell({
  children,
  user,
  plan,
}: {
  children: React.ReactNode
  user?: { email: string; display_name?: string | null; avatar_url?: string | null } | null
  plan?: 'free' | 'pro' | 'student' | 'annual'
}) {
  const pathname = usePathname()
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = pathname?.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="flex items-center gap-3">
            {plan ? (
              <Badge variant={plan === 'free' ? 'secondary' : 'default'} className="hidden md:inline-flex">
                {plan === 'free' ? 'Free' : plan === 'pro' ? 'Pro' : plan === 'student' ? 'Student' : 'Annual'}
              </Badge>
            ) : null}
            <UserMenu user={user} />
          </div>
        </div>

        {/* mobile nav */}
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-border/40 px-2 py-2 md:hidden">
          {NAV.map((item) => {
            const active = pathname?.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium',
                  active
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}

function UserMenu({
  user,
}: {
  user?: { email: string; display_name?: string | null; avatar_url?: string | null } | null
}) {
  if (!user) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/login">Sign in</Link>
      </Button>
    )
  }
  const display = user.display_name || user.email.split('@')[0]
  const initial = (display || '?').slice(0, 1).toUpperCase()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-semibold text-white">
          {initial}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{display}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">
            <UserIcon className="h-4 w-4" />
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/billing">
            <CreditCard className="h-4 w-4" />
            Billing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/auth/logout">
            <LogOut className="h-4 w-4" />
            Sign out
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
