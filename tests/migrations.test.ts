import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { createClient, type Client } from '@libsql/client'
import { runMigrations } from '../scripts/db/migrations'

let db: Client
let dir: string

const columnNames = async (table: string) =>
  (await db.execute(`PRAGMA table_info(${table})`)).rows.map((column) => column.name)

beforeEach(async () => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
  dir = mkdtempSync(join(tmpdir(), 'plismun-migration-'))
  db = createClient({ url: `file:${join(dir, 'test.db')}` })
  // The database as it was before these migrations
  await db.executeMultiple(`
    CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, isGoogleUser BOOLEAN NOT NULL, isAdmin BOOLEAN NOT NULL DEFAULT FALSE);
    CREATE TABLE delegations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, shorthand TEXT NOT NULL UNIQUE, country TEXT NOT NULL, notes TEXT);
    CREATE TABLE people (id INTEGER PRIMARY KEY UNIQUE, name TEXT NOT NULL, birth DATE NOT NULL, phone TEXT, nationality TEXT NOT NULL, delegation TEXT NOT NULL, diet TEXT NOT NULL, notes TEXT, FOREIGN KEY (delegation) REFERENCES delegations(name), FOREIGN KEY (id) REFERENCES users(id));
    CREATE TABLE supervisors (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, delegation TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', FOREIGN KEY (userId) REFERENCES users(id));
    INSERT INTO users (id, email, password, isGoogleUser) VALUES (1, 'a@test.com', 'x', 0);
    INSERT INTO delegations (name, shorthand, country) VALUES ('Example School', 'EX', 'Czechia');
    INSERT INTO people (id, name, birth, nationality, delegation, diet) VALUES (1, 'Kept Person', '2009-01-01', 'Czechia', 'Example School', 'Vegan');
  `)
})

afterEach(() => {
  db.close()
  rmSync(dir, { recursive: true, force: true })
  vi.restoreAllMocks()
})

describe('migrations', () => {
  it('bring an old database up to date without losing anyone', async () => {
    await runMigrations(db)

    const delegation = (await db.execute('PRAGMA table_info(people)')).rows.find((column) => column.name === 'delegation')
    expect(Number(delegation?.notnull)).toBe(0)
    expect(await columnNames('supervisors')).toEqual(expect.arrayContaining(['country', 'students']))
    expect(await columnNames('documents')).toContain('title')
    expect((await db.execute('SELECT name FROM people')).rows[0].name).toBe('Kept Person')
  })

  it('are safe to run more than once', async () => {
    await runMigrations(db)
    await expect(runMigrations(db)).resolves.toBeUndefined()
    expect((await db.execute('SELECT COUNT(*) AS count FROM people')).rows[0].count).toBe(1)
  })

  it('stop rather than drop an old documents table that still points at files', async () => {
    await db.executeMultiple(`
      CREATE TABLE documents (id INTEGER PRIMARY KEY, path TEXT);
      INSERT INTO documents (path) VALUES ('documents/old.pdf');
    `)
    await expect(runMigrations(db)).rejects.toThrow('documents/old.pdf')
    expect((await db.execute('SELECT COUNT(*) AS count FROM documents')).rows[0].count).toBe(1)
  })
})
