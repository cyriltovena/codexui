/** Narrows `value` to a plain (non-array) object record, or returns `null`. */
function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

/** Returns `true` when `value` is a non-empty string. */
function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

export type CodexErrorCode =
  | 'http_error'
  | 'rpc_error'
  | 'network_error'
  | 'invalid_response'
  | 'unknown_error'

export class CodexApiError extends Error {
  code: CodexErrorCode
  method?: string
  status?: number

  constructor(message: string, options: { code: CodexErrorCode; method?: string; status?: number }) {
    super(message)
    this.name = 'CodexApiError'
    this.code = options.code
    this.method = options.method
    this.status = options.status
  }
}

export function extractErrorMessage(payload: unknown, fallback: string): string {
  const record = asRecord(payload)
  if (!record) return fallback

  const error = record.error
  if (isNonEmptyString(error)) return error

  const nested = asRecord(error)
  if (nested && isNonEmptyString(nested.message)) {
    return nested.message
  }

  return fallback
}

export function normalizeCodexApiError(error: unknown, fallback: string, method?: string): CodexApiError {
  if (error instanceof CodexApiError) {
    return error
  }

  if (error instanceof Error) {
    return new CodexApiError(error.message || fallback, {
      code: 'unknown_error',
      method,
    })
  }

  return new CodexApiError(fallback, {
    code: 'unknown_error',
    method,
  })
}
