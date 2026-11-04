import type { Client } from '@libsql/client'

/**
 * For the separate supervisor application flow.
 *
 * 1. people.delegation becomes nullable. A supervisor registering a school that is new to
 *    PLISMUN has no delegation until an admin creates and links it, and the foreign key to
 *    delegations(name) rejects any placeholder. SQLite cannot drop NOT NULL in place, so
 *    the table is rebuilt and the rows copied across. Nothing references people, so it can
 *    be dropped with foreign keys on.
 * 2. supervisors gains country and students (expected number of students), which the
 *    supervisor application asks for so admins can set up the delegation.
 */
export async function supervisorApplications(db: Client): Promise<string[]> {
  const applied: string[] = []

  const peopleColumns = await db.execute(`PRAGMA table_info(people)`)
  const delegationColumn = peopleColumns.rows.find((column) => column.name === 'delegation')
  if (!delegationColumn) throw new Error('people.delegation not found. Run pnpm db:setup first.')

  if (Number(delegationColumn.notnull) === 1) {
    await db.batch([
      `
        CREATE TABLE people_migrated (
        id INTEGER PRIMARY KEY UNIQUE,
        name TEXT NOT NULL,
        birth DATE NOT NULL,
        phone TEXT,
        nationality TEXT NOT NULL,
        delegation TEXT,
        diet TEXT NOT NULL,
        notes TEXT,
        FOREIGN KEY (delegation) REFERENCES delegations(name),
        FOREIGN KEY (id) REFERENCES users(id)
        )
      `,
      `
        INSERT INTO people_migrated (id, name, birth, phone, nationality, delegation, diet, notes)
        SELECT id, name, birth, phone, nationality, delegation, diet, notes FROM people
      `,
      `DROP TABLE people`,
      `ALTER TABLE people_migrated RENAME TO people`,
    ], 'write')
    applied.push('people.delegation is now nullable')
  }

  const supervisorColumns = await db.execute(`PRAGMA table_info(supervisors)`)
  const supervisorColumnNames = new Set(supervisorColumns.rows.map((column) => column.name))
  if (!supervisorColumnNames.size) throw new Error('supervisors table not found. Run pnpm db:setup first.')

  if (!supervisorColumnNames.has('country')) {
    await db.execute(`ALTER TABLE supervisors ADD COLUMN country TEXT`)
    applied.push('added supervisors.country')
  }
  if (!supervisorColumnNames.has('students')) {
    await db.execute(`ALTER TABLE supervisors ADD COLUMN students INTEGER`)
    applied.push('added supervisors.students')
  }

  return applied
}
