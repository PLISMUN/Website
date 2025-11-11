import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);

  const { email } = req.body;

    try {
    const turso = getTursoClient()

    console.log(email)
    const userResult = await turso.execute({
      sql: 'SELECT isAdmin FROM users WHERE email = ?',
      args: [email],
    });

    if (!userResult.rows.length) {
      console.error("User not found")
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(userResult.rows)
    
    const personInfo = userResult.rows.map((row: any) => ({
        isAdmin: row.isAdmin?.toString() || '',
    }));
    res.status(200).json(personInfo);
  } catch (err: any) {
    console.error('Error getting admin:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}