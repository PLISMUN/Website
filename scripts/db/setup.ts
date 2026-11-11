import { readFileSync } from 'fs'
import { join } from 'path'
import { connect, run } from './client'
import { insertSampleData } from './sample-data'

// pnpm db:setup: creates the tables and brings them up to date. A local database also gets sample data.
run(async () => {
  const { db, isLocal } = connect()

  await db.executeMultiple(readFileSync(join(process.cwd(), 'scripts/db/schema.sql'), 'utf8'))
  console.log('Tables are ready')

  if (isLocal) {
    await insertSampleData(db)
  } else {
    console.log('Remote database, so no sample data. Add this year\'s committees by hand.')
  }
})
