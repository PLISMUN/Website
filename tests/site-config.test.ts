import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Client } from '@libsql/client'
import { call, createTestDatabase } from './helpers/api'

const session = vi.hoisted(() => ({ email: null as string | null }))
vi.mock('next-auth/next', () => ({
  getServerSession: async () => (session.email ? { user: { email: session.email } } : null),
}))

// Next's data cache only exists inside Next. Here the cached read goes straight to the database, and
// what the code asks the cache to do is recorded
const nextCache = vi.hoisted(() => ({
  revalidateTag: vi.fn(),
  cachedWith: [] as { keyParts?: string[]; options?: { tags?: string[]; revalidate?: number | false } }[],
}))
vi.mock('next/cache', () => ({
  revalidateTag: nextCache.revalidateTag,
  unstable_cache: <T,>(fn: T, keyParts?: string[], options?: { tags?: string[]; revalidate?: number | false }) => {
    nextCache.cachedWith.push({ keyParts, options })
    return fn
  },
}))

// No test ever sends a real email
vi.mock('@/server/email', async (original) => ({
  ...(await original<typeof import('@/server/email')>()),
  sendEmail: vi.fn(async () => {}),
}))

import { defaultSiteConfig } from '@/features/site-config/schema'
import { getLatestSiteConfig, getSiteConfig, getSiteConfigSections, SITE_CONFIG_TAG } from '@/server/site-config'
import { POST as setSiteConfig } from '@/app/api/modify/setSiteConfig/route'
import getSiteConfigRoute from '@/pages/api/retrieve/getSiteConfig'
import setPayment from '@/pages/api/modify/setPayment'
import setSupervisorApplication from '@/pages/api/modify/setSupervisorApplication'
import signup from '@/pages/api/modify/signup'

const ADMIN = 'admin@test.com'
const STUDENT = 'student@test.com'

let database: Awaited<ReturnType<typeof createTestDatabase>>

beforeAll(async () => {
  database = await createTestDatabase()
  vi.stubEnv('TURSO_DATABASE_URL', database.url)
  await database.db.execute(`INSERT INTO users (email, password, isGoogleUser, isAdmin) VALUES ('${ADMIN}', 'x', 0, 1)`)
})

afterAll(() => {
  database.cleanup()
  vi.unstubAllEnvs()
})

beforeEach(async () => {
  session.email = ADMIN
  nextCache.revalidateTag.mockClear()
  await database.db.execute('DELETE FROM site_config')
})

const updatedAt = async (section: string) => (await getSiteConfigSections())[section as 'pricing'].updatedAt

/** Calls the App Router route that saves the Settings page, as a request from the browser would. */
async function callSettingsRoute(body: unknown) {
  const response = await setSiteConfig(
    new Request('http://localhost/api/modify/setSiteConfig', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  )
  return { status: response.status, data: (await response.json()) as Record<string, unknown> }
}

const save = (section: string, value: unknown, expectedUpdatedAt: string | null = null) =>
  callSettingsRoute({ action: 'save', section, value, expectedUpdatedAt })

describe('the site settings', () => {
  it('are the defaults from src/config until an admin changes them', async () => {
    expect(await getSiteConfig()).toEqual(defaultSiteConfig)
  })

  it('show a section an admin saved, and who saved it', async () => {
    const pricing = { ...defaultSiteConfig.pricing, delegate: { czk: 2000, eur: 80 } }
    expect((await save('pricing', pricing)).status).toBe(200)

    expect((await getSiteConfig()).pricing).toEqual(pricing)
    const sections = await getSiteConfigSections()
    expect(sections.pricing.updatedBy).toBe(ADMIN)
    expect(sections.pricing.defaultValue).toEqual(defaultSiteConfig.pricing)
    // The other sections are untouched
    expect(sections.stages.updatedAt).toBeNull()
  })

  it('can only be read and changed by admins', async () => {
    session.email = null
    expect((await call(getSiteConfigRoute)).status).toBe(401)
    expect((await save('stages', defaultSiteConfig.stages)).status).toBe(401)

    await database.db.execute(`INSERT OR IGNORE INTO users (email, password, isGoogleUser) VALUES ('${STUDENT}', 'x', 0)`)
    session.email = STUDENT
    expect((await call(getSiteConfigRoute)).status).toBe(403)
    expect((await save('stages', { ...defaultSiteConfig.stages, accountCreation: false })).status).toBe(403)
    expect((await getSiteConfig()).stages).toEqual(defaultSiteConfig.stages)
  })

  it('say what needs fixing instead of saving something invalid', async () => {
    const result = await save('pricing', { ...defaultSiteConfig.pricing, chair: { czk: -5, eur: 'forty' } })

    expect(result.status).toBe(400)
    expect((result.data.issues as { path: unknown[] }[]).map((issue) => issue.path)).toEqual([
      ['chair', 'czk'],
      ['chair', 'eur'],
    ])
    expect(await updatedAt('pricing')).toBeNull()
  })

  it('turn down unknown sections and actions', async () => {
    expect((await save('secrets', {})).status).toBe(400)
    expect((await callSettingsRoute({ action: 'delete', section: 'pricing', expectedUpdatedAt: null })).status).toBe(400)
  })

  it('don’t let one admin silently undo another’s change', async () => {
    await save('stages', { ...defaultSiteConfig.stages, chairApplication: true })
    const first = await updatedAt('stages')

    // A second admin who opened the page before that save
    const stale = await save('stages', { ...defaultSiteConfig.stages, paymentsAccepted: false }, null)
    expect(stale.status).toBe(409)
    expect(stale.data.message).toContain(ADMIN)

    const fresh = await save('stages', { ...defaultSiteConfig.stages, paymentsAccepted: false }, first)
    expect(fresh.status).toBe(200)
    expect((await getSiteConfig()).stages.paymentsAccepted).toBe(false)
    expect((await save('stages', defaultSiteConfig.stages, first)).status).toBe(409)
  })

  it('go back to the defaults when a section is reset', async () => {
    await save('about', { ...defaultSiteConfig.about, heading: 'Changed' })
    const saved = await updatedAt('about')

    expect((await callSettingsRoute({ action: 'reset', section: 'about', expectedUpdatedAt: 'stale' })).status).toBe(409)
    expect((await callSettingsRoute({ action: 'reset', section: 'about', expectedUpdatedAt: saved })).status).toBe(200)
    expect((await getSiteConfig()).about).toEqual(defaultSiteConfig.about)
  })

  it('won’t remove a document section that still has documents in it', async () => {
    await database.db.execute(`INSERT INTO documents (groupId, title, description, path) VALUES ('study-guides', 'Guide', 'x', 'documents/study-guides/guide.pdf')`)
    const documents = {
      ...defaultSiteConfig.documents,
      groups: defaultSiteConfig.documents.groups.filter((group) => group.id !== 'study-guides'),
    }

    const result = await save('documents', documents)
    expect(result.status).toBe(400)
    expect(result.data.message).toContain('study-guides')

    await database.db.execute('DELETE FROM documents')
    expect((await save('documents', documents)).status).toBe(200)
  })

  it('fall back to the defaults if what was saved no longer fits', async () => {
    await database.db.execute({
      sql: 'INSERT INTO site_config (section, value, updatedAt, updatedBy) VALUES (?, ?, ?, ?)',
      args: ['pricing', JSON.stringify({ delegate: 'free' }), new Date().toISOString(), ADMIN],
    })
    vi.spyOn(console, 'error').mockImplementation(() => {})

    expect((await getSiteConfig()).pricing).toEqual(defaultSiteConfig.pricing)
    expect((await getSiteConfigSections()).pricing.problem).toContain('delegate')
    vi.restoreAllMocks()
  })

  it('take fields added to a section since it was saved from the defaults', async () => {
    // As if mymun and social.linkedin had been added to src/config after this was saved
    const { mymun, social, ...rest } = { ...defaultSiteConfig.conference, city: 'Brno' }
    const saved = { ...rest, social: { facebook: social.facebook, instagram: social.instagram }, removedSinceItWasSaved: true }
    expect(mymun).toBeDefined()
    await database.db.execute({
      sql: 'INSERT INTO site_config (section, value, updatedAt, updatedBy) VALUES (?, ?, ?, ?)',
      args: ['conference', JSON.stringify(saved), new Date().toISOString(), ADMIN],
    })

    const loaded = (await getSiteConfig()).conference
    expect(loaded.city).toBe('Brno')
    expect(loaded.mymun).toEqual(defaultSiteConfig.conference.mymun)
    expect(loaded.social.linkedin).toBe(defaultSiteConfig.conference.social.linkedin)
    expect(loaded).not.toHaveProperty('removedSinceItWasSaved')
  })

  it('are the defaults on a database that hasn’t been migrated yet', async () => {
    const other = await createTestDatabase()
    await other.db.execute('DROP TABLE site_config')
    vi.stubEnv('TURSO_DATABASE_URL', other.url)
    const cachedClient = global.__globalTurso__
    global.__globalTurso__ = undefined
    try {
      expect(await getSiteConfig()).toEqual(defaultSiteConfig)
    } finally {
      // The client getSiteConfig() made for the other database. TypeScript thinks it's still undefined from above.
      ;(global.__globalTurso__ as Client | undefined)?.close()
      global.__globalTurso__ = cachedClient
      vi.stubEnv('TURSO_DATABASE_URL', database.url)
      other.cleanup()
    }
  })
})

describe('caching the settings', () => {
  it('caches what pages read under a tag, with an hour as the fallback', () => {
    expect(nextCache.cachedWith).toEqual([{ keyParts: ['site-config-rows'], options: { tags: [SITE_CONFIG_TAG], revalidate: 3600 } }])
  })

  it('clears the cache when a section is saved or reset, so pages show it straight away', async () => {
    await save('about', { ...defaultSiteConfig.about, heading: 'Changed' })
    expect(nextCache.revalidateTag).toHaveBeenCalledExactlyOnceWith(SITE_CONFIG_TAG)

    await callSettingsRoute({ action: 'reset', section: 'about', expectedUpdatedAt: await updatedAt('about') })
    expect(nextCache.revalidateTag).toHaveBeenCalledTimes(2)
  })

  it('leaves the cache alone when nothing was saved', async () => {
    await save('pricing', { ...defaultSiteConfig.pricing, chair: { czk: 0, eur: 0 } })
    await save('stages', defaultSiteConfig.stages, 'stale')
    session.email = null
    await save('stages', defaultSiteConfig.stages)
    expect(nextCache.revalidateTag).not.toHaveBeenCalled()
  })

  it('gives API routes the same settings as pages, read fresh', async () => {
    await save('pricing', { ...defaultSiteConfig.pricing, delegate: { czk: 2100, eur: 85 } })
    expect(await getLatestSiteConfig()).toEqual(await getSiteConfig())
    expect((await getLatestSiteConfig()).pricing.delegate.czk).toBe(2100)
  })
})

describe('the API routes that use the settings', () => {
  beforeAll(async () => {
    session.email = null
    await call(signup, { body: { email: STUDENT, password: 'long enough password' } })
  })

  it('charge the prices an admin saved', async () => {
    await save('pricing', { ...defaultSiteConfig.pricing, chair: { czk: 1111, eur: 44 } })

    expect((await call(setPayment, { body: { email: STUDENT, tier: 'chair' } })).status).toBe(200)
    const { rows } = await database.db.execute({
      sql: 'SELECT valueCzk, valueEur FROM payments p JOIN users u ON u.id = p.id WHERE u.email = ?',
      args: [STUDENT],
    })
    expect([Number(rows[0].valueCzk), Number(rows[0].valueEur)]).toEqual([1111, 44])
  })

  it('stop supervisor applications as soon as an admin closes them', async () => {
    await save('stages', { ...defaultSiteConfig.stages, supervisorApplication: false })

    session.email = STUDENT
    const result = await call(setSupervisorApplication, { body: {} })
    expect(result.status).toBe(403)
    expect(result.data.message).toContain('closed')
  })
})
