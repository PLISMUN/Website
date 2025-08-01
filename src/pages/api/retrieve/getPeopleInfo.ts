import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    return res.status(500).json({ message: 'Server error: Missing env variables' });
  }

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