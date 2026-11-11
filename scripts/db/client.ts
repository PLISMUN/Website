import { createClient, type Client } from '@libsql/client'

/** Reads .env.local and .env the way Next.js does: variables that are already set win, then .env.local, then .env. */
function loadEnvFiles() {
  for (const file of ['.env.local', '.env']) {
    try {
      process.loadEnvFile(file)
    } catch {
      // No such file, which is fine
    }
  }
}

/**
 * Connects to the database in TURSO_DATABASE_URL. Refuses to touch a remote database, which
 * could be production, unless the command was run with --yes.
 */
export function connect(): { db: Client; isLocal: boolean } {
  loadEnvFiles()

  const url = process.env.TURSO_DATABASE_URL
  if (!url) throw new Error('TURSO_DATABASE_URL is not set. Copy .env.example to .env to get started.')

  const isLocal = url.startsWith('file:')
  if (!isLocal && !process.argv.includes('--yes')) {
    throw new Error(`TURSO_DATABASE_URL points at a remote database (${new URL(url).host}). If that's what you want, run this again with --yes.`)
  }

  console.log(`Database: ${isLocal ? url : new URL(url).host}`)
  return { db: createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN }), isLocal }
}

/** Runs a script's main function and exits with a clear message if it fails. */
export function run(main: () => Promise<void>) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err)
    process.exit(1)
  })
}
