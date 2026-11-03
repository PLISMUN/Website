import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

/**
 * One-off migration for the Documents admin page: adds the table of documents admins have created.
 *
 * An early, unreleased version of this table had no titles. It's replaced if it's empty, but rows
 * in it point at uploaded files, so those are left for a person to clear out rather than dropped.
 *
 * Safe to run more than once.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  if (res.headersSent) return;
  await authAdmin(req, res, false);
  if (res.headersSent) return;

  try {
    const turso = getTursoClient()

    const columns = await turso.execute(`PRAGMA table_info(documents)`);
    if (columns.rows.length && !columns.rows.some((column: any) => column.name === 'title')) {
      const oldRows = await turso.execute(`SELECT path FROM documents`);
      if (oldRows.rows.length) {
        return res.status(409).json({
          message: 'The documents table has rows from an earlier version. Delete these files from the Blob store, run DROP TABLE documents, then run this again.',
          paths: oldRows.rows.map((row: any) => row.path),
        });
      }
      await turso.execute(`DROP TABLE documents`);
    }

    await turso.execute(`
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
    `);

    res.status(200).json({ message: 'Documents migration applied' });
  } catch (err: any) {
    console.error('Error migrating documents:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}
