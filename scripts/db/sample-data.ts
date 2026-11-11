import bcrypt from 'bcryptjs'
import type { Client } from '@libsql/client'
import { pricing } from '../../src/config/pricing'

// Made-up data for a local database, so the site has something to show straight after setting up.
// Every sample account uses this password.
export const SAMPLE_PASSWORD = 'password123'

// This is the format committees are stored in, with roles and topics as JSON strings. Add real ones from the
// Committees admin page, which writes this format (see src/features/committees/schema.ts).
const committees = [
  {
    name: 'World Health Organisation (WHO)',
    shorthand: 'WHO',
    description: 'A specialised agency of the United Nations responsible for the protection of international public health.',
    difficulty: 'Beginner',
    icon: '/icons/WHO.jpg',
    roles: [
      { role: 'France', difficulty: 'Beginner' },
      { role: 'Kenya', difficulty: 'Intermediate' },
      { role: 'USA', difficulty: 'Advanced' },
    ],
    topics: {
      topic1: { name: 'Example topic one', description: 'What delegates will debate first.' },
      topic2: { name: 'Example topic two', description: 'What delegates will debate second.' },
    },
  },
  {
    name: 'Security Council (SC)',
    shorthand: 'SC',
    description: 'The United Nations organ responsible for maintaining international peace and security.',
    difficulty: 'Advanced',
    icon: '/icons/SC.jpg',
    roles: [
      { role: 'UK', difficulty: 'Advanced' },
      { role: 'China', difficulty: 'Advanced' },
    ],
    topics: {
      topic1: { name: 'Example topic one', description: 'What delegates will debate first.' },
      topic2: { name: 'Example topic two', description: 'What delegates will debate second.' },
    },
  },
]

/** Does nothing if the database already has users, so running setup again never overwrites your local data. */
export async function insertSampleData(db: Client) {
  const existing = await db.execute('SELECT COUNT(*) AS count FROM users')
  if (Number(existing.rows[0].count) > 0) {
    console.log('Sample data: the database already has users, so leaving it alone')
    return
  }

  const password = await bcrypt.hash(SAMPLE_PASSWORD, 10)

  await db.batch([
    ...committees.map((committee) => ({
      sql: 'INSERT INTO committees (name, shorthand, description, difficulty, roles, topics, icon) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [
        committee.name,
        committee.shorthand,
        committee.description,
        committee.difficulty,
        JSON.stringify(committee.roles),
        JSON.stringify(committee.topics),
        committee.icon,
      ],
    })),
    {
      sql: 'INSERT INTO delegations (name, shorthand, country) VALUES (?, ?, ?)',
      args: ['Example International School', 'EIS', 'Czechia'],
    },
    {
      sql: 'INSERT INTO users (id, email, password, isGoogleUser, isAdmin) VALUES (?, ?, ?, ?, ?)',
      args: [1, 'admin@example.com', password, false, true],
    },
    {
      sql: 'INSERT INTO users (id, email, password, isGoogleUser, isAdmin) VALUES (?, ?, ?, ?, ?)',
      args: [2, 'delegate@example.com', password, false, false],
    },
    {
      sql: 'INSERT INTO users (id, email, password, isGoogleUser, isAdmin) VALUES (?, ?, ?, ?, ?)',
      args: [3, 'supervisor@example.com', password, false, false],
    },
    {
      sql: 'INSERT INTO people (id, name, birth, phone, nationality, delegation, diet, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      args: [2, 'Dana Delegate', '2009-05-31', '+420 123 456 789', 'Czechia', 'Example International School', 'Omnivore', 'My first conference'],
    },
    {
      sql: 'INSERT INTO people (id, name, birth, phone, nationality, delegation, diet, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      args: [3, 'Sam Supervisor', '1985-01-15', '+420 987 654 321', 'Czechia', 'Example International School', 'Vegetarian', 'Head of Humanities'],
    },
    {
      sql: 'INSERT INTO payments (id, valueCzk, valueEur) VALUES (?, ?, ?)',
      args: [2, pricing.delegate.czk, pricing.delegate.eur],
    },
    {
      sql: 'INSERT INTO payments (id, valueCzk, valueEur) VALUES (?, ?, ?)',
      args: [3, pricing.supervisor.czk, pricing.supervisor.eur],
    },
    {
      sql: "INSERT INTO applications (type, userId, committeeId, role, notes) VALUES ('delegate', 2, 1, 'France', 'Choice 1: I would love to represent France.')",
      args: [],
    },
    {
      sql: "INSERT INTO supervisors (userId, delegation, status, country) VALUES (3, 'Example International School', 'accepted', 'Czechia')",
      args: [],
    },
  ], 'write')

  console.log(`Sample data added. Log in as admin@example.com, delegate@example.com or supervisor@example.com with the password ${SAMPLE_PASSWORD}`)
}
