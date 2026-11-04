import type { Client } from '@libsql/client'

/**
 * For the Documents admin page: adds the table of documents admins have created.
 *
 * An early, unreleased version of this table had no titles. It's replaced if it's empty, but rows
 * in it point at uploaded files, so those are left for a person to clear out rather than dropped.
 */
export async function documents(db: Client): Promise<string[]> {
  const applied: string[] = []

  const columns = await db.execute(`PRAGMA table_info(documents)`)
  if (columns.rows.length && !columns.rows.some((column) => column.name === 'title')) {
    const oldRows = await db.execute(`SELECT path FROM documents`)
    if (oldRows.rows.length) {
      throw new Error(
        'The documents table has rows from an earlier version. Delete these files from the Blob store, ' +
        `run DROP TABLE documents, then run this again:\n  ${oldRows.rows.map((row) => row.path).join('\n  ')}`
      )
    }
    await db.execute(`DROP TABLE documents`)
    applied.push('dropped the empty documents table from an earlier version')
  }

  const alreadyExists = columns.rows.some((column) => column.name === 'title')
  await db.execute(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      groupId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      path TEXT NOT NULL UNIQUE,
      url TEXT, -- url, size and uploadedAt are NULL until a PDF has been uploaded
      size INTEGER,
      uploadedAt TEXT
    )
  `)
  if (!alreadyExists) applied.push('added the documents table')

  return applied
}
