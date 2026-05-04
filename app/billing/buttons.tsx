'use client'

import { Loader2 } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { startCheckout, openBillingPortal } from './actions'
import { toast } from '@/components/ui/toast'

export function CheckoutButtons() {
  const [busy, setBusy] = React.useState<string | null>(null)
  return (
    <div className="flex flex-wrap gap-2">
      <FormButton plan="pro_monthly" busy={busy} setBusy={setBusy} variant="gradient">
        Upgrade to Pro · $24/mo
      </FormButton>
      <FormButton plan="pro_annual" busy={busy} setBusy={setBusy} variant="outline">
        Annual · $199/yr
      </FormButton>
      <FormButton plan="student_monthly" busy={busy} setBusy={setBusy} variant="ghost">
        Student · $12/mo
      </FormButton>
    </div>
  )
}

function FormButton({
  plan,
  children,
  variant,
  busy,
  setBusy,
}: {
  plan: 'pro_monthly' | 'pro_annual' | 'student_monthly'
  children: React.ReactNode
  variant: 'gradient' | 'outline' | 'ghost'
  busy: string | null
  setBusy: (s: string | null) => void
}) {
  return (
    <form
      action={async () => {
        setBusy(plan)
        try {
          await startCheckout(plan)
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : 'Could not start checkout'
          toast({ title: 'Checkout failed', description: message, variant: 'destructive' })
        } finally {
          setBusy(null)
        }
      }}
    >
      <Button type="submit" variant={variant} disabled={!!busy}>
        {busy === plan ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {children}
      </Button>
    </form>
  )
}

export function ManageBillingButton() {
  const [busy, setBusy] = React.useState(false)
  return (
    <form
      action={async () => {
        setBusy(true)
        try {
          await openBillingPortal()
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : 'Could not open portal'
          toast({ title: 'Portal failed', description: message, variant: 'destructive' })
        } finally {
          setBusy(false)
        }
      }}
    >
      <Button type="submit" variant="outline" disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Manage billing
      </Button>
    </form>
  )
}
