import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { call, createTestDatabase } from './helpers/api'

const session = vi.hoisted(() => ({ email: null as string | null }))
vi.mock('next-auth/next', () => ({
  getServerSession: async () => (session.email ? { user: { email: session.email } } : null),
}))

// Next's data cache only exists inside Next, so the cached read goes straight to the database
vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
  unstable_cache: <T,>(fn: T) => fn,
}))

// The cookies a page sees, for pageHasAccess
const cookieJar = vi.hoisted(() => ({} as Record<string, string>))
vi.mock('next/headers', () => ({
  cookies: async () => ({ get: (name: string) => (name in cookieJar ? { name, value: cookieJar[name] } : undefined) }),
}))

// No test ever sends a real email
vi.mock('@/server/email', async (original) => ({
  ...(await original<typeof import('@/server/email')>()),
  sendEmail: vi.fn(async () => {}),
}))

import { access } from '@/config/access'
import { ACCESS_COOKIE, ACCESS_PARAM, accessLink } from '@/features/access/constants'
import { defaultSiteConfig } from '@/features/site-config/schema'
import { POST as setSiteConfig } from '@/app/api/modify/setSiteConfig/route'
import checkAccess from '@/pages/api/retrieve/checkAccess'
import setSupervisorApplication from '@/pages/api/modify/setSupervisorApplication'
import { pageHasAccess } from '@/server/page-access'
import { getLatestSiteConfig, getSiteConfig, getSiteConfigSections } from '@/server/site-config'

const ADMIN = 'admin@test.com'
const TEACHER = 'teacher@test.com'
const NEW_PASSWORD = 'a brand new password'

let database: Awaited<ReturnType<typeof createTestDatabase>>

beforeAll(async () => {
  database = await createTestDatabase()
  vi.stubEnv('TURSO_DATABASE_URL', database.url)
  await database.db.batch([
    `INSERT INTO users (email, password, isGoogleUser, isAdmin) VALUES ('${ADMIN}', 'x', 0, 1)`,
    `INSERT INTO users (email, password, isGoogleUser) VALUES ('${TEACHER}', 'x', 0)`,
  ], 'write')
})

afterAll(() => {
  database.cleanup()
  vi.unstubAllEnvs()
})

beforeEach(async () => {
  session.email = ADMIN
  for (const name of Object.keys(cookieJar)) delete cookieJar[name]
  await database.db.execute('DELETE FROM site_config')
})

async function save(section: string, value: unknown) {
  const expectedUpdatedAt = (await getSiteConfigSections())[section as 'access'].updatedAt
  const response = await setSiteConfig(
    new Request('http://localhost/api/modify/setSiteConfig', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save', section, value, expectedUpdatedAt }),
    })
  )
  return { status: response.status, data: (await response.json()) as Record<string, unknown> }
}

const isValid = async (key: unknown) => {
  session.email = null
  const result = await call(checkAccess, { body: { key } })
  expect(result.status).toBe(200)
  return result.data.valid
}

const pageParams = (params: Record<string, string | string[]>) => Promise.resolve(params)

describe('the access link', () => {
  it('works with the default password until an admin changes it', async () => {
    expect(access.password).toBe('IWannaApplyForPlismun')
    expect(await isValid('IWannaApplyForPlismun')).toBe(true)
  })

  it('doesn’t work with anything else', async () => {
    expect(await isValid('iwannaapplyforplismun')).toBe(false)
    expect(await isValid('IWannaApplyForPlismun ')).toBe(false)
    expect(await isValid('')).toBe(false)
    expect(await isValid(undefined)).toBe(false)
    expect(await isValid(['IWannaApplyForPlismun'])).toBe(false)
  })

  it('stops working with the old password as soon as an admin changes it', async () => {
    expect((await save('access', { password: NEW_PASSWORD })).status).toBe(200)
    expect(await isValid('IWannaApplyForPlismun')).toBe(false)
    expect(await isValid(NEW_PASSWORD)).toBe(true)
  })

  it('needs a password that can’t be guessed easily', async () => {
    const result = await save('access', { password: 'short' })
    expect(result.status).toBe(400)
    expect((result.data.issues as { path: unknown[] }[]).map((issue) => issue.path)).toEqual([['password']])
  })

  it('is copied from the Settings page with its password in the address', () => {
    expect(accessLink('https://plismun.com/', 'a b&c')).toBe(`https://plismun.com/?${ACCESS_PARAM}=a%20b%26c`)
    expect(new URL(accessLink('https://plismun.com', NEW_PASSWORD)).searchParams.get(ACCESS_PARAM)).toBe(NEW_PASSWORD)
  })
})

describe('the access link’s password', () => {
  it('is never in the settings that pages are given, which every visitor gets', async () => {
    await save('access', { password: NEW_PASSWORD })

    for (const config of [await getSiteConfig(), await getLatestSiteConfig()]) {
      expect(config).not.toHaveProperty('access')
      expect(JSON.stringify(config)).not.toContain(NEW_PASSWORD)
    }
  })

  it('is shown to admins on the Settings page', async () => {
    await save('access', { password: NEW_PASSWORD })
    expect((await getSiteConfigSections()).access.value).toEqual({ password: NEW_PASSWORD })
    expect((await getSiteConfigSections()).access.defaultValue).toEqual(defaultSiteConfig.access)
  })
})

describe('pages under /user with the access link', () => {
  it('take the password from the address first, then the cookie', async () => {
    expect(await pageHasAccess(pageParams({}))).toBe(false)
    expect(await pageHasAccess(pageParams({ [ACCESS_PARAM]: access.password }))).toBe(true)
    expect(await pageHasAccess(pageParams({ [ACCESS_PARAM]: [access.password, 'x'] }))).toBe(true)

    cookieJar[ACCESS_COOKIE] = access.password
    expect(await pageHasAccess(pageParams({}))).toBe(true)
    // A wrong password in the address isn't rescued by the cookie, the same as in the browser
    expect(await pageHasAccess(pageParams({ [ACCESS_PARAM]: 'wrong password' }))).toBe(false)
  })
})

describe('a supervisor application while they’re closed', () => {
  const application = {
    name: 'Test Teacher',
    birth: '1985-01-15',
    phone: '+420 123 456 789',
    nationality: 'Czechia',
    diet: 'Vegan',
    notes: 'Head of the MUN club',
    existing: false,
    delegation: 'Late School',
    country: 'Czechia',
    students: 4,
  }

  beforeEach(async () => {
    await save('stages', { ...defaultSiteConfig.stages, supervisorApplication: false })
    session.email = TEACHER
  })

  it('is turned down without the access link, or with an old one', async () => {
    expect((await call(setSupervisorApplication, { body: application })).status).toBe(403)
    const wrong = await call(setSupervisorApplication, { body: application, cookies: { [ACCESS_COOKIE]: 'not the password' } })
    expect(wrong.status).toBe(403)
    expect(wrong.data.message).toContain('closed')
  })

  it('goes through with the access link', async () => {
    const result = await call(setSupervisorApplication, { body: application, cookies: { [ACCESS_COOKIE]: access.password } })
    expect(result.status).toBe(200)
    expect(Number(result.data.supervisorId)).toBeGreaterThan(0)
  })
})
