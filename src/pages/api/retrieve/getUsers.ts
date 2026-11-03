import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  if (res.headersSent) return;
  await authAdmin(req, res, false);
  if (res.headersSent) return;

  try {
    const turso = getTursoClient()

    const peopleResult = await turso.execute({
      sql: `
        SELECT
          u.id, u.email, u.isGoogleUser, u.isAdmin, -- not u.*: the browser has no business with password hashes
          p.*,
          pay.*
        FROM users u
        LEFT JOIN people p ON u.id = p.id
        LEFT JOIN payments pay ON u.id = pay.id
      `,
    });

    const people = peopleResult.rows.map((row: any) => ({ ...row, status: Boolean(row.status) }));

    res.status(200).json({ people });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}