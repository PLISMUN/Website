import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { call, createTestDatabase } from './helpers/api'

const session = vi.hoisted(() => ({ email: null as string | null }))
vi.mock('next-auth/next', () => ({
  getServerSession: async () => (session.email ? { user: { email: session.email } } : null),
}))

import { ApiError, withApi, type ApiAuth } from '@/server/with-api'

let database: Awaited<ReturnType<typeof createTestDatabase>>

beforeAll(async () => {
  database = await createTestDatabase()
  vi.stubEnv('TURSO_DATABASE_URL', database.url)
  await database.db.execute(`INSERT INTO users (email, password, isGoogleUser, isAdmin) VALUES
    ('admin@test.com', 'x', 0, 1), ('student@test.com', 'x', 0, 0)`)
})

afterAll(() => {
  database.cleanup()
  vi.unstubAllEnvs()
})

beforeEach(() => {
  session.email = null
})

// A route that records whether its handler ran
function routeFor(auth: ApiAuth) {
  const handler = vi.fn(async ({ res }) => res.status(200).json({ ok: true }))
  return { route: withApi({ auth }, handler), handler }
}

describe('who can call a route', () => {
  it.each([
    // auth, signed in as, body.email, expected status
    ['public', null, undefined, 200],
    ['user', null, undefined, 401],
    ['user', 'student@test.com', undefined, 200],
    ['admin', null, undefined, 401],
    ['admin', 'student@test.com', undefined, 403],
    ['admin', 'admin@test.com', undefined, 200],
    ['admin', 'nobody@test.com', undefined, 404],
    ['adminOrSelf', null, 'student@test.com', 401],
    ['adminOrSelf', 'student@test.com', 'student@test.com', 200],
    ['adminOrSelf', 'student@test.com', 'admin@test.com', 403],
    ['adminOrSelf', 'admin@test.com', 'student@test.com', 200],
  ] as const)('%s, signed in as %s, for %s: %i', async (auth, signedInAs, email, status) => {
    session.email = signedInAs
    const { route, handler } = routeFor(auth)

    const result = await call(route, { body: { email } })

    expect(result.status).toBe(status)
    // The important part: a rejected request never reaches the handler
    expect(handler).toHaveBeenCalledTimes(status === 200 ? 1 : 0)
  })

  it('no longer accepts the old ?password= master login', async () => {
    const { route, handler } = routeFor('admin')
    const result = await route(
      { method: 'POST', body: {}, url: '/test', query: { password: process.env.INTERNAL_API_PASSWORD ?? 'x' }, headers: {}, cookies: {} } as never,
      { status: () => ({ json: () => undefined }), headersSent: false } as never
    )
    expect(result).toBeUndefined()
    expect(handler).not.toHaveBeenCalled()
  })
})

describe('the request and its errors', () => {
  it('rejects the wrong method without running the handler', async () => {
    const { route, handler } = routeFor('public')
    const result = await call(route, { method: 'GET' })
    expect(result.status).toBe(405)
    expect(handler).not.toHaveBeenCalled()
  })

  it('can be told to expect a different method', async () => {
    const route = withApi({ auth: 'public', method: 'GET' }, async ({ res }) => res.status(200).json({ ok: true }))
    expect((await call(route, { method: 'GET' })).status).toBe(200)
    expect((await call(route, { method: 'POST' })).status).toBe(405)
  })

  it('answers with the status of an ApiError', async () => {
    const route = withApi({ auth: 'public' }, async () => {
      throw new ApiError(404, 'User not found')
    })
    expect(await call(route)).toEqual({ status: 404, data: { message: 'User not found' } })
  })

  it('turns anything else thrown into a 500', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const route = withApi({ auth: 'public' }, async () => {
      throw new Error('Database is on fire')
    })
    expect(await call(route)).toEqual({ status: 500, data: { message: 'Database is on fire' } })
    consoleError.mockRestore()
  })
})
