import { connect, run } from './client'
import { runMigrations } from './migrations'

// pnpm db:migrate: brings a database that already exists up to date.
run(async () => {
  const { db } = connect()
  await runMigrations(db)
})
