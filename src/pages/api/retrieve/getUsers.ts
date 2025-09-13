import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  await authAdmin(req, res);

  try {
    const turso = getTursoClient()

    const peopleResult = await turso.execute({
      sql: `
        SELECT 
          u.*, 
          p.*,
          pay.*
        FROM users u
        LEFT JOIN people p ON u.id = p.id
        LEFT JOIN payments pay ON u.id = pay.id
      `,
    });

    res.status(200).json({ people: peopleResult.rows });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}