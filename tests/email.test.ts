import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

// No test ever sends a real email
const sendMail = vi.hoisted(() => vi.fn<(message: { html: string; text: string; from: unknown }) => Promise<void>>(async () => {}))
vi.mock('nodemailer', () => ({
  default: { createTransport: () => ({ verify: async () => true, sendMail }) },
}))

import { createTestDatabase } from './helpers/api'
import { escapeHtml, htmlToText, sendEmail } from '@/server/email'

describe('escapeHtml', () => {
  it('escapes everything that means something in HTML', () => {
    expect(escapeHtml(`<a href="x">Tom & Jerry's</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&#39;s&lt;/a&gt;')
  })

  it('takes values from the database or a request that aren\'t strings', () => {
    expect(escapeHtml(5)).toBe('5')
    expect(escapeHtml(['<b>'])).toBe('&lt;b&gt;')
  })
})

describe('htmlToText', () => {
  it('turns line breaks into new lines and drops other tags', () => {
    expect(htmlToText('Hello <b>there</b><br />Bye<br>now')).toBe('Hello there\nBye\nnow')
  })

  it('gives back exactly what was escaped', () => {
    for (const typed of [`Côte d'Ivoire`, 'Tom & Jerry', '<b>not a tag</b>', '&lt;', '&amp;lt;']) {
      expect(htmlToText(`Your role: ${escapeHtml(typed)}`)).toBe(`Your role: ${typed}`)
    }
  })
})

describe('sendEmail', () => {
  let database: Awaited<ReturnType<typeof createTestDatabase>>

  beforeAll(async () => {
    // For the settings, which come from the database
    database = await createTestDatabase()
    vi.stubEnv('TURSO_DATABASE_URL', database.url)
    vi.stubEnv('EMAIL_PASSWORD', 'not a real password')
  })

  afterAll(() => {
    database.cleanup()
    vi.unstubAllEnvs()
  })

  it('keeps the HTML escaped, and the plain text readable', async () => {
    await sendEmail('student@test.com', 'Title', `Hello<br />You are ${escapeHtml(`Côte d'Ivoire`)}`)

    const [message] = sendMail.mock.calls[0]
    expect(message.html).toContain('Hello<br />You are Côte d&#39;Ivoire')
    expect(message.text).toContain(`Hello\nYou are Côte d'Ivoire`)
  })

  it('signs emails with the settings saved by admins', async () => {
    await database.db.execute({
      sql: 'INSERT INTO site_config (section, value, updatedAt, updatedBy) VALUES (?, ?, ?, ?)',
      args: ['email', JSON.stringify({ senderName: 'Changed <Name>' }), new Date().toISOString(), 'admin@test.com'],
    })
    sendMail.mockClear()

    await sendEmail('student@test.com', 'Title', 'Hello')

    const [message] = sendMail.mock.calls[0]
    expect(message.from).toEqual({ name: 'Changed <Name>', address: expect.any(String) })
  })
})
