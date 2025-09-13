import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  await authAdmin(req, res);

  const { email } = req.body;

  try {
    const turso = getTursoClient()

    const userResult = await turso.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email],
    });

    if (!userResult.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    const applicationsResult = await turso.execute({
      sql: `
        SELECT 
          a.*, 
          c.name as committeeName
        FROM applications a
        JOIN committees c ON a.committeeId = c.id
        WHERE a.userId = ?
      `,
      args: [userId],
    });

    res.status(200).json({ applications: applicationsResult.rows });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}