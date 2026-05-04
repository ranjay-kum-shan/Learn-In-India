export type ErrorCode =
  | 'auth.unauthenticated'
  | 'auth.forbidden'
  | 'paywall.required'
  | 'content.not_found'
  | 'content.invalid'
  | 'grading.no_tool_use'
  | 'grading.invalid_response'
  | 'grading.rate_limited'
  | 'db.not_found'
  | 'db.constraint'
  | 'stripe.not_configured'
  | 'stripe.unknown'
  | 'unknown'

export class AppError extends Error {
  code: ErrorCode
  status: number
  cause?: unknown

  constructor(code: ErrorCode, message?: string, opts?: { status?: number; cause?: unknown }) {
    super(message ?? code)
    this.code = code
    this.status = opts?.status ?? 500
    if (opts?.cause) this.cause = opts.cause
  }

  static is(err: unknown): err is AppError {
    return err instanceof AppError
  }

  toJSON() {
    return { error: this.code, message: this.message }
  }
}

export type Result<T, E = AppError> = { ok: true; value: T } | { ok: false; error: E }

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}
