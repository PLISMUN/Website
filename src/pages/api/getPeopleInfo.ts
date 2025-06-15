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

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY UNIQUE,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      birth DATE NOT NULL,
      nationality TEXT NOT NULL,
      delegation TEXT NOT NULL,
      diet TEXT NOT NULL,
      notes TEXT
      )
    `);

    const personResult = await turso.execute({
      sql: 'SELECT name, birth, nationality, delegation, diet, notes FROM people WHERE email = ?',
      args: [email],
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