import type { Client } from '@libsql/client'
import { supervisorApplications } from './001-supervisor-applications'
import { documents } from './002-documents'

// Changes for databases that already exist, oldest first. Every one runs each time, so each has to
// check what's already there and skip it (schema.sql only covers brand new tables). To change a
// table: update schema.sql, add a migration here, and run pnpm db:migrate against each database.
const migrations = [
  { name: '001-supervisor-applications', run: supervisorApplications },
  { name: '002-documents', run: documents },
]

export async function runMigrations(db: Client) {
  for (const migration of migrations) {
    const applied = await migration.run(db)
    console.log(`${migration.name}: ${applied.length ? applied.join(', ') : 'nothing to do'}`)
  }
}
