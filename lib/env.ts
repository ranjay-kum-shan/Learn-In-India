import { z } from 'zod'

/**
 * Server-side env. Validated at boot.
 * Anything required to start without crashing should be optional + checked at use site.
 */
const ServerEnv = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_NAME: z.string().default('SysDesign Gym'),

  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_GRADING_MODEL: z.string().default('claude-sonnet-4-6'),
  ANTHROPIC_REASONING_MODEL: z.string().default('claude-opus-4-6'),

  OPENAI_API_KEY: z.string().optional(),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_PRICE_PRO_MONTHLY: z.string().optional(),
  STRIPE_PRICE_STUDENT_MONTHLY: z.string().optional(),
  STRIPE_PRICE_PRO_ANNUAL: z.string().optional(),

  NEXT_PUBLIC_BYPASS_PAYWALL: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  MOCK_GRADING: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
})

export const env = ServerEnv.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  ANTHROPIC_GRADING_MODEL: process.env.ANTHROPIC_GRADING_MODEL,
  ANTHROPIC_REASONING_MODEL: process.env.ANTHROPIC_REASONING_MODEL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  STRIPE_PRICE_PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY,
  STRIPE_PRICE_STUDENT_MONTHLY: process.env.STRIPE_PRICE_STUDENT_MONTHLY,
  STRIPE_PRICE_PRO_ANNUAL: process.env.STRIPE_PRICE_PRO_ANNUAL,
  NEXT_PUBLIC_BYPASS_PAYWALL: process.env.NEXT_PUBLIC_BYPASS_PAYWALL,
  MOCK_GRADING: process.env.MOCK_GRADING,
})

/**
 * Returns true only when env vars are real values, not the placeholders we ship
 * in `.env.example`. This protects the dev demo flow from breaking when the user
 * has copied .env.example as-is and only filled in some of the keys.
 */
function looksLikePlaceholder(s: string | undefined): boolean {
  if (!s) return true
  return (
    s.includes('YOUR-PROJECT') ||
    s.includes('xxxxxxxxxxxxx') ||
    s.startsWith('sk-ant-xxx') ||
    s.startsWith('sk-xxx') ||
    s.startsWith('sk_test_xxx') ||
    s.startsWith('whsec_xxx') ||
    s.startsWith('pk_test_xxx') ||
    s.startsWith('price_xxx')
  )
}

export const isSupabaseConfigured =
  !looksLikePlaceholder(env.NEXT_PUBLIC_SUPABASE_URL) &&
  !looksLikePlaceholder(env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export const isAnthropicConfigured = !looksLikePlaceholder(env.ANTHROPIC_API_KEY)

export const isStripeConfigured =
  !looksLikePlaceholder(env.STRIPE_SECRET_KEY) &&
  !looksLikePlaceholder(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
