import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { createTestDatabase } from './helpers/api'

const session = vi.hoisted(() => ({ email: null as string | null }))
vi.mock('next-auth/next', () => ({
  getServerSession: async () => (session.email ? { user: { email: session.email } } : null),
}))

// Next's data cache only exists inside Next: here cached reads go straight to the database
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

import { committeeFromRow, committeeToColumns, parseCommittee, type CommitteeInput } from '@/features/committees/schema'
import { parseCommitteeRoles } from '@/features/committees/types'
import { COMMITTEES_TAG, getCommittees, getCommitteesForAdmin } from '@/server/committees'
import { POST as setCommittee } from '@/app/api/modify/setCommittee/route'

const ADMIN = 'admin@test.com'

let database: Awaited<ReturnType<typeof createTestDatabase>>

beforeAll(async () => {
  database = await createTestDatabase()
  vi.stubEnv('TURSO_DATABASE_URL', database.url)
  await database.db.execute(`INSERT INTO users (id, email, password, isGoogleUser, isAdmin) VALUES (1, '${ADMIN}', 'x', 0, 1), (2, 'student@test.com', 'x', 0, 0)`)
})

afterAll(() => {
  database.cleanup()
  vi.unstubAllEnvs()
})

beforeEach(async () => {
  session.email = ADMIN
  nextCache.revalidateTag.mockClear()
  await database.db.execute('DELETE FROM applications')
  await database.db.execute('DELETE FROM committees')
})

const who: CommitteeInput = {
  name: 'World Health Organisation (WHO)',
  shorthand: 'WHO',
  description: 'Public health.',
  difficulty: 'Beginner',
  icon: '/icons/WHO.jpg',
  roles: [
    { role: 'France', difficulty: 'Beginner' },
    { role: 'Kenya', difficulty: 'Intermediate' },
  ],
  topics: [
    { name: 'Vaccines', description: 'First topic' },
    { name: 'Pandemics', description: 'Second topic' },
  ],
}

async function call(body: unknown) {
  const response = await setCommittee(
    new Request('http://localhost/api/modify/setCommittee', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  )
  return { status: response.status, data: (await response.json()) as Record<string, unknown> }
}

describe('a committee as the admin page edits it', () => {
  it('is stored in the format the rest of the site reads', () => {
    const { roles, topics } = committeeToColumns(who)
    expect(parseCommitteeRoles(roles)).toEqual(who.roles)
    // The cards on the public pages show topic1 and topic2
    expect(JSON.parse(topics)).toEqual({ topic1: who.topics[0], topic2: who.topics[1] })
  })

  it('reads back what was stored', () => {
    const row = { id: 1, ...who, ...committeeToColumns(who) }
    expect(committeeFromRow(row)).toEqual(who)
  })

  it('copes with committees added by hand', () => {
    const topics = Object.fromEntries(Array.from({ length: 11 }, (_, i) => [`topic${i + 1}`, { name: `T${i + 1}`, description: '' }]))
    const row = { ...committeeToColumns(who), ...who, id: 1, roles: '["France", {"role": "Kenya"}]', topics: JSON.stringify(topics), icon: '' }
    const read = committeeFromRow(row)
    expect(read.roles).toEqual([
      { role: 'France', difficulty: 'Beginner' },
      { role: 'Kenya', difficulty: 'Beginner' },
    ])
    expect(read.topics.map((topic) => topic.name)).toEqual(['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11'])
    expect(committeeFromRow({ ...row, roles: 'not json', topics: 'null' })).toMatchObject({ roles: [], topics: [] })
  })

  it('needs a known difficulty and no role twice', () => {
    const result = parseCommittee({ ...who, difficulty: 'Hard', roles: [...who.roles, { role: ' france ', difficulty: 'Advanced' }] })
    expect(!result.success && result.issues.map((issue) => issue.path)).toEqual([['difficulty'], ['roles', 2, 'role']])
  })

  it('only takes an icon that is a file, a link or nothing', () => {
    expect(parseCommittee({ ...who, icon: '' }).success).toBe(true)
    expect(parseCommittee({ ...who, icon: 'javascript:alert(1)' }).success).toBe(false)
  })
})

describe('changing committees', () => {
  it('creates, changes and deletes one, clearing the cached committees each time', async () => {
    const created = await call({ action: 'create', committee: who })
    expect(created.status).toBe(200)
    const id = created.data.id as number
    expect((await getCommittees()).map((c) => c.name)).toEqual([who.name])

    expect((await call({ action: 'update', id, committee: { ...who, shorthand: 'OMS' } })).status).toBe(200)
    expect((await getCommittees())[0].shorthand).toBe('OMS')

    expect((await call({ action: 'delete', id })).status).toBe(200)
    expect(await getCommittees()).toEqual([])
    expect(nextCache.revalidateTag).toHaveBeenCalledTimes(3)
    expect(nextCache.revalidateTag).toHaveBeenCalledWith(COMMITTEES_TAG)
  })

  it('says what to fix, and leaves the cache alone', async () => {
    const result = await call({ action: 'create', committee: { ...who, name: '' } })
    expect(result.status).toBe(400)
    expect(result.data.issues).toEqual([{ path: ['name'], message: expect.any(String) }])
    expect(nextCache.revalidateTag).not.toHaveBeenCalled()
  })

  it('turns down a second committee with the same name or shorthand', async () => {
    await call({ action: 'create', committee: who })
    const sameShorthand = await call({ action: 'create', committee: { ...who, name: 'Something else' } })
    expect(sameShorthand.status).toBe(400)
    expect(sameShorthand.data.issues).toEqual([{ path: ['shorthand'], message: expect.stringContaining('shorthand') }])
  })

  it('won’t delete a committee people have applied for, which would hide their applications', async () => {
    const { id } = (await call({ action: 'create', committee: who })).data
    await database.db.execute({ sql: `INSERT INTO applications (type, userId, committeeId, role) VALUES ('delegate', 2, ?, 'France')`, args: [id as number] })

    expect((await getCommitteesForAdmin())[0].applications).toBe(1)
    const result = await call({ action: 'delete', id })
    expect(result.status).toBe(409)
    expect((await getCommittees()).length).toBe(1)
  })

  it('says so when the committee is gone', async () => {
    expect((await call({ action: 'update', id: 999, committee: who })).status).toBe(404)
    expect((await call({ action: 'delete', id: 999 })).status).toBe(404)
    expect((await call({ action: 'delete', id: 'one' })).status).toBe(400)
  })

  it('is only for admins', async () => {
    session.email = null
    expect((await call({ action: 'create', committee: who })).status).toBe(401)
    session.email = 'student@test.com'
    expect((await call({ action: 'create', committee: who })).status).toBe(403)
    expect(await getCommittees()).toEqual([])
  })

  it('caches what pages read under the committees tag, with an hour as the fallback', () => {
    expect(nextCache.cachedWith).toContainEqual({ keyParts: ['committees'], options: { tags: [COMMITTEES_TAG], revalidate: 3600 } })
  })
})
