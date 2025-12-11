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
      return res.status(500).json({ message: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    const personResult = await turso.execute({
      sql: 'SELECT name, birth, nationality, delegation, diet, notes FROM people WHERE id = ?',
      args: [userId],
    });
    
    const personInfo = personResult.rows.map((row: any) => ({
        name: row.name?.toString() || '',
        birth: row.birth?.toString() || '',
        nationality: row.nationality?.toString() || '',
        delegation: row.delegation?.toString() || '',
        diet: row.diet?.toString() || '',
        notes: row.notes?.toString() || '',
    }));
    res.status(200).json(personInfo);
  } catch (err: any) {
    console.error('Error fetching delegations:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}