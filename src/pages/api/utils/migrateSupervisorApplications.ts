import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

/**
 * One-off migration for the separate supervisor application flow.
 *
 * 1. people.delegation becomes nullable. A supervisor registering a school that is new to
 *    PLISMUN has no delegation until an admin creates and links it, and the foreign key to
 *    delegations(name) rejects any placeholder. SQLite cannot drop NOT NULL in place, so
 *    the table is rebuilt and the rows copied across. Nothing references people, so it can
 *    be dropped with foreign keys on.
 * 2. supervisors gains country and students (expected number of students), which the
 *    supervisor application asks for so admins can set up the delegation.
 *
 * Safe to run more than once: each step is skipped if it has already been applied.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  await authAdmin(req, res);

  try {
    const turso = getTursoClient()
    const applied: string[] = []

    const peopleColumns = await turso.execute(`PRAGMA table_info(people)`);
    const delegationColumn = peopleColumns.rows.find((column: any) => column.name === 'delegation');
    if (!delegationColumn) {
      return res.status(404).json({ message: 'people.delegation not found — run seedDb first' });
    }

    if (Number(delegationColumn.notnull) === 1) {
      await turso.batch([
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
      ], 'write');
      applied.push('people.delegation is now nullable');
    }

    const supervisorColumns = await turso.execute(`PRAGMA table_info(supervisors)`);
    const supervisorColumnNames = new Set(supervisorColumns.rows.map((column: any) => column.name));
    if (!supervisorColumnNames.size) {
      return res.status(404).json({ message: 'supervisors table not found — run seedDb first' });
    }
    if (!supervisorColumnNames.has('country')) {
      await turso.execute(`ALTER TABLE supervisors ADD COLUMN country TEXT`);
      applied.push('added supervisors.country');
    }
    if (!supervisorColumnNames.has('students')) {
      await turso.execute(`ALTER TABLE supervisors ADD COLUMN students INTEGER`);
      applied.push('added supervisors.students');
    }

    res.status(200).json({
      message: applied.length ? 'Supervisor application migration applied' : 'Already migrated, nothing to do',
      applied,
    });
  } catch (err: any) {
    console.error('Error migrating supervisor applications:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}
