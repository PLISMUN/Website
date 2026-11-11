import 'server-only'
import { createClient, type Client } from '@libsql/client'
import { getEnv } from '@/server/env'

declare global {
  var __globalTurso__: Client | undefined
}

// This function creates a Turso client and caches it globally to avoid creating multiple instances straining DB bandiwdth limits
export function getTursoClient(): Client {
  if (!global.__globalTurso__) {
    const env = getEnv()
    global.__globalTurso__ = createClient({
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    })
  }
  return global.__globalTurso__
}
