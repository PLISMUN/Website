import { createClient, Client } from '@libsql/client'

declare global {
  // eslint-disable-next-line no-var
  var __globalTurso__: Client | undefined
}

// This function creates a Turso client and caches it globally to avoid creating multiple instances, straining DB bandiwdth limits
export function getTursoClient(): Client {
  if (!global.__globalTurso__) {
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
      throw new Error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN environment variables')
    }
    global.__globalTurso__ = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  }
  return global.__globalTurso__
}