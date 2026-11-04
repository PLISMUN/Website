import 'server-only'
import { z } from 'zod'

// Every environment variable the site reads. Anything that isn't a secret, doesn't differ between
// environments and isn't read directly by a library belongs in src/config instead.
const schema = z
  .object({
    TURSO_DATABASE_URL: z.string().min(1),
    // Not needed for a local database (file:local.db)
    TURSO_AUTH_TOKEN: z.string().optional(),
    EMAIL_PASSWORD: z.string().optional(),
  })
  .refine((env) => env.TURSO_DATABASE_URL.startsWith('file:') || Boolean(env.TURSO_AUTH_TOKEN), {
    path: ['TURSO_AUTH_TOKEN'],
    message: 'Required for a remote database',
  })

type Env = z.infer<typeof schema>

let cached: Env | undefined

/** The validated environment. Throws a readable error naming what's wrong, on first use rather than on import. */
export function getEnv(): Env {
  if (cached) return cached

  const result = schema.safeParse(process.env)
  if (!result.success) {
    const problems = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    throw new Error(`Invalid environment variables (see .env.example)\n  ${problems.join('\n  ')}`)
  }

  cached = result.data
  return cached
}

// The site runs without these, but part of it won't work
const OPTIONAL_FEATURES: Record<string, string> = {
  AUTH_SECRET: 'signing in',
  NEXTAUTH_URL: 'signing in',
  GOOGLE_CLIENT_ID: 'signing in with Google',
  GOOGLE_CLIENT_SECRET: 'signing in with Google',
  EMAIL_PASSWORD: 'sending emails',
  BLOB_READ_WRITE_TOKEN: 'uploading documents',
}

/** Logs what's missing when the server starts, so a misconfiguration isn't first noticed on a failed request. */
export function reportEnvProblems() {
  try {
    getEnv()
  } catch (err) {
    console.error(err instanceof Error ? err.message : err)
  }

  const missing = Object.entries(OPTIONAL_FEATURES).filter(([name]) => !process.env[name])
  if (missing.length) {
    console.warn(
      `Missing environment variables:\n${missing.map(([name, feature]) => `  ${name} (needed for ${feature})`).join('\n')}`
    )
  }
}
