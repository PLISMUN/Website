import { readFileSync, mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { createClient, type Client } from '@libsql/client'
import type { NextApiRequest, NextApiResponse } from 'next'

type Route = (req: NextApiRequest, res: NextApiResponse) => unknown

/** Calls an API route as if a request had come in, and returns its response. */
export async function call(route: Route, { method = 'POST', body = {} }: { method?: string; body?: unknown } = {}) {
  const result = { status: 0, data: undefined as unknown as Record<string, unknown> }
  const res = {
    headersSent: false,
    status(code: number) {
      result.status = code
      return res
    },
    json(data: Record<string, unknown>) {
      result.data = data
      res.headersSent = true
      return res
    },
    setHeader() {
      return res
    },
  }
  await route({ method, body, url: '/test', headers: {}, cookies: {}, query: {} } as unknown as NextApiRequest, res as unknown as NextApiResponse)
  return result
}

/** A throwaway database with today's schema. The app connects to it through TURSO_DATABASE_URL. */
export async function createTestDatabase(): Promise<{ db: Client; url: string; cleanup: () => void }> {
  const dir = mkdtempSync(join(tmpdir(), 'plismun-test-'))
  const url = `file:${join(dir, 'test.db')}`
  const db = createClient({ url })
  await db.executeMultiple(readFileSync(join(process.cwd(), 'scripts/db/schema.sql'), 'utf8'))
  return {
    db,
    url,
    cleanup: () => {
      db.close()
      rmSync(dir, { recursive: true, force: true })
    },
  }
}
