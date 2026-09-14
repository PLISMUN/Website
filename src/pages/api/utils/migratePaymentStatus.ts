import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

/**
 * One-off migration: payments.status used to be TEXT holding a mix of
 * 'pending' (the old column default) and 'Completed' (written by
 * acceptPayment). It is now a BOOLEAN — true means paid.
 *
 * seedDb only runs CREATE TABLE IF NOT EXISTS, so an existing database keeps
 * the old TEXT column and its TEXT affinity would coerce booleans back to
 * '0'/'1' strings. SQLite cannot change a column's declared type in place, so
 * the table is rebuilt and the rows copied across.
 *
 * Safe to run more than once: if the column is already BOOLEAN it exits early.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  await authAdmin(req, res);

  try {
    const turso = getTursoClient()

    const columns = await turso.execute(`PRAGMA table_info(payments)`);
    const statusColumn = columns.rows.find((column: any) => column.name === 'status');

    if (!statusColumn) {
      return res.status(404).json({ message: 'payments.status not found — run seedDb first' });
    }

    if (String(statusColumn.type).toUpperCase() === 'BOOLEAN') {
      return res.status(200).json({ message: 'payments.status is already BOOLEAN, nothing to do' });
    }

    // Rebuild the table with the new column type, mapping every spelling of the
    // old value ('Completed', 'completed', and the '1' a boolean write would
    // have left behind) onto true and everything else onto false.
    await turso.execute(`PRAGMA foreign_keys = OFF`);

    await turso.execute(`
      CREATE TABLE payments_migrated (
        id INTEGER PRIMARY KEY,
        valueCzk int NOT NULL,
        valueEur int NOT NULL,
        status BOOLEAN NOT NULL DEFAULT FALSE,
        FOREIGN KEY (id) REFERENCES users(id)
      )
    `);

    await turso.execute(`
      INSERT INTO payments_migrated (id, valueCzk, valueEur, status)
      SELECT
        id,
        valueCzk,
        valueEur,
        CASE WHEN lower(CAST(status AS TEXT)) IN ('completed', '1', 'true') THEN 1 ELSE 0 END
      FROM payments
    `);

    await turso.execute(`DROP TABLE payments`);
    await turso.execute(`ALTER TABLE payments_migrated RENAME TO payments`);

    await turso.execute(`PRAGMA foreign_keys = ON`);

    const migrated = await turso.execute(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status THEN 1 ELSE 0 END) AS paid
      FROM payments
    `);

    res.status(200).json({
      message: 'payments.status migrated to BOOLEAN',
      total: migrated.rows[0]?.total ?? 0,
      paid: migrated.rows[0]?.paid ?? 0,
    });
  } catch (err: any) {
    console.error('Error migrating payment status:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}
