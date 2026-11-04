import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { call, createTestDatabase } from './helpers/api'

const session = vi.hoisted(() => ({ email: null as string | null }))
vi.mock('next-auth/next', () => ({
  getServerSession: async () => (session.email ? { user: { email: session.email } } : null),
}))

// No test ever sends a real email
const sendEmail = vi.hoisted(() => vi.fn(async () => {}))
vi.mock('@/server/email', async (original) => ({
  ...(await original<typeof import('@/server/email')>()),
  sendEmail,
}))

import { pricing } from '@/config/pricing'
import acceptApplication from '@/pages/api/modify/acceptApplication'
import acceptPayment from '@/pages/api/modify/acceptPayment'
import setApplication from '@/pages/api/modify/setApplication'
import setPayment from '@/pages/api/modify/setPayment'
import setPeopleInfo from '@/pages/api/modify/setPeopleInfo'
import setSupervisorApplication from '@/pages/api/modify/setSupervisorApplication'
import signup from '@/pages/api/modify/signup'
import getApplications from '@/pages/api/retrieve/getApplications'
import getAllApplications from '@/pages/api/retrieve/getAllApplications'
import getPayment from '@/pages/api/retrieve/getPayment'
import getUsers from '@/pages/api/retrieve/getUsers'

const STUDENT = 'student@test.com'
const ADMIN = 'admin@test.com'
const TEACHER = 'teacher@test.com'

let database: Awaited<ReturnType<typeof createTestDatabase>>

beforeAll(async () => {
  database = await createTestDatabase()
  vi.stubEnv('TURSO_DATABASE_URL', database.url)
  await database.db.batch([
    `INSERT INTO users (email, password, isGoogleUser, isAdmin) VALUES ('${ADMIN}', 'x', 0, 1)`,
    `INSERT INTO committees (name, shorthand, description, difficulty, roles, topics, icon)
     VALUES ('World Health Organisation', 'WHO', 'x', 'Beginner', '[{"role":"France"}]', '{}', '')`,
    `INSERT INTO delegations (name, shorthand, country) VALUES ('Example School', 'EX', 'Czechia')`,
  ], 'write')
})

afterAll(() => {
  database.cleanup()
  vi.unstubAllEnvs()
})

beforeEach(() => {
  session.email = null
  sendEmail.mockClear()
})

const personalInfo = {
  name: 'Test Student',
  birth: '2009-05-31',
  phone: '+420 123 456 789',
  nationality: 'Czechia',
  delegation: 'Example School',
  diet: 'Vegan',
  notes: 'I have been to two conferences before',
}

// These run in order: each step builds on the one before, like a real applicant
describe('a student applying and being accepted', () => {
  let applicationId: number

  it('signs up', async () => {
    const result = await call(signup, { body: { email: STUDENT, password: 'long enough password' } })
    expect(result.status).toBe(200)
    expect(sendEmail).toHaveBeenCalledWith(STUDENT, 'Welcome to PLISMUN!', expect.any(String))
  })

  it('stores a hash of the password, not the password', async () => {
    const { rows } = await database.db.execute({ sql: 'SELECT password FROM users WHERE email = ?', args: [STUDENT] })
    expect(rows[0].password).not.toBe('long enough password')
  })

  it('fills in their details', async () => {
    session.email = STUDENT
    const result = await call(setPeopleInfo, { body: { ...personalInfo, email: STUDENT } })
    expect(result.status).toBe(200)
  })

  it('applies to a committee', async () => {
    session.email = STUDENT
    const result = await call(setApplication, {
      body: { email: STUDENT, type: 'delegate', committee: '1', role: 'France', notes: 'Choice 1: why not' },
    })
    expect(result.status).toBe(200)
    applicationId = Number(result.data.applicationId)
    expect(applicationId).toBeGreaterThan(0)
  })

  it('is charged the delegate price from src/config/pricing.ts by default', async () => {
    session.email = STUDENT
    const result = await call(getPayment, { body: { email: STUDENT } })
    expect(result.data).toMatchObject([
      { valueCzk: String(pricing.delegate.czk), valueEur: String(pricing.delegate.eur), status: false },
    ])
  })

  it('shows up for admins, with their details', async () => {
    session.email = ADMIN
    const result = await call(getAllApplications)
    expect(result.data.applications).toMatchObject([
      { id: applicationId, userEmail: STUDENT, name: 'Test Student', committeeName: 'World Health Organisation', status: 'pending', paymentStatus: false },
    ])
  })

  it('is accepted by an admin, and told about it', async () => {
    session.email = ADMIN
    const result = await call(acceptApplication, { body: { [applicationId]: true } })
    expect(result.status).toBe(200)
    expect(sendEmail).toHaveBeenCalledWith(STUDENT, 'Application Accepted', expect.stringContaining('World Health Organisation'))

    session.email = STUDENT
    const own = await call(getApplications, { body: { email: STUDENT } })
    expect(own.data.applications).toMatchObject([{ id: applicationId, status: 'accepted' }])
  })

  it('moves to the chair price when an admin says so', async () => {
    session.email = ADMIN
    expect((await call(setPayment, { body: { email: STUDENT, tier: 'chair' } })).status).toBe(200)

    session.email = STUDENT
    const result = await call(getPayment, { body: { email: STUDENT } })
    expect(result.data).toMatchObject([{ valueCzk: String(pricing.chair.czk), valueEur: String(pricing.chair.eur) }])
  })

  it('has their payment confirmed by an admin', async () => {
    session.email = ADMIN
    expect((await call(acceptPayment, { body: { email: STUDENT } })).status).toBe(200)

    session.email = STUDENT
    expect((await call(getPayment, { body: { email: STUDENT } })).data).toMatchObject([{ status: true }])
  })
})

describe('a supervisor applying', () => {
  it('gets the supervisor price, and an ID that can never clash with a student application', async () => {
    await call(signup, { body: { email: TEACHER, password: 'long enough password' } })

    session.email = TEACHER
    const result = await call(setSupervisorApplication, {
      body: { ...personalInfo, name: 'Test Teacher', birth: '1985-01-15', existing: true, delegation: 'example school' },
    })

    expect(result.status).toBe(200)
    expect(Number(result.data.supervisorId)).toBeGreaterThan(9990)
    expect((await call(getPayment, { body: { email: TEACHER } })).data).toMatchObject([
      { valueCzk: String(pricing.supervisor.czk), valueEur: String(pricing.supervisor.eur) },
    ])
  })
})

describe('text someone typed that ends up in an email', () => {
  const typed = '<img src=x onerror=alert(1)>'

  const expectEscaped = (to: string, title: string) => {
    expect(sendEmail).toHaveBeenLastCalledWith(to, title, expect.stringContaining('&lt;img src=x onerror=alert(1)&gt;'))
    expect(sendEmail).toHaveBeenLastCalledWith(to, title, expect.not.stringContaining('<img'))
  }

  it('is escaped when a student\'s application is registered and accepted', async () => {
    session.email = STUDENT
    const result = await call(setApplication, {
      body: { email: STUDENT, type: 'delegate', committee: '1', role: typed, notes: '' },
    })
    expectEscaped(STUDENT, 'Application registered')

    session.email = ADMIN
    await call(acceptApplication, { body: { [String(result.data.applicationId)]: true } })
    expectEscaped(STUDENT, 'Application Accepted')
  })

  it('is escaped when a supervisor\'s application is received and accepted', async () => {
    session.email = TEACHER
    const result = await call(setSupervisorApplication, {
      body: { ...personalInfo, name: 'Test Teacher', birth: '1985-01-15', existing: false, delegation: typed, country: 'Czechia', students: 5 },
    })
    expectEscaped(TEACHER, 'Supervisor Application Received')

    session.email = ADMIN
    await call(acceptApplication, { body: { [String(result.data.supervisorId)]: true } })
    expectEscaped(TEACHER, 'Supervisor Application Accepted')
  })
})

describe('what someone else can\'t do', () => {
  it('a student can\'t see another user\'s data', async () => {
    session.email = STUDENT
    expect((await call(getApplications, { body: { email: TEACHER } })).status).toBe(403)
    expect((await call(getPayment, { body: { email: TEACHER } })).status).toBe(403)
  })

  it('a student can\'t apply on behalf of someone else', async () => {
    session.email = STUDENT
    const result = await call(setApplication, {
      body: { email: TEACHER, type: 'delegate', committee: '1', role: 'France', notes: 'not me' },
    })
    expect(result.status).toBe(403)
  })

  it('a student can\'t use the admin endpoints', async () => {
    session.email = STUDENT
    expect((await call(getAllApplications)).status).toBe(403)
    expect((await call(getUsers)).status).toBe(403)
    expect((await call(acceptPayment, { body: { email: STUDENT } })).status).toBe(403)
    expect((await call(acceptApplication, { body: { 1: true } })).status).toBe(403)
  })

  it('nobody signed in can\'t do any of it', async () => {
    expect((await call(getApplications, { body: { email: STUDENT } })).status).toBe(401)
    expect((await call(getUsers)).status).toBe(401)
  })

  it('never sends password hashes to the browser', async () => {
    session.email = ADMIN
    const result = await call(getUsers)
    expect(JSON.stringify(result.data)).not.toContain('"password"')
  })

  it('rejects a price tier that doesn\'t exist', async () => {
    session.email = ADMIN
    expect((await call(setPayment, { body: { email: STUDENT, tier: 'constructor' } })).status).toBe(400)
  })
})
