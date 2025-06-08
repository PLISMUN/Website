import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { getTursoClient } from '@/pages/api/components/dbAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    return res.status(500).json({ message: 'Server error: Missing env variables' });
  }
  
  const { email, name, birth, nationality, delegation, diet, notes } = req.body;
  //TODO validate input data
  console.log('Delegate info:', { name, email, birth, nationality, delegation, diet, notes });

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

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS delegates (
        id INTEGER PRIMARY KEY UNIQUE,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        birth DATE NOT NULL,
        nationality TEXT NOT NULL,
        delegation TEXT NOT NULL,
        diet TEXT CHECK (diet IN ('None', 'Vegetarian', 'Vegan', 'Other')),
        notes TEXT
      )
    `);

    await turso.execute({
      sql: 'DELETE FROM delegates WHERE id = ?',
      args: [userId],
    });

    await turso.execute({
      sql: 'INSERT INTO delegates (id, email, name, birth, nationality, delegation, diet, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      args: [userId, email, name, birth, nationality, delegation, diet, notes],
    });
    
    res.status(200).json({ message: 'Signup successful' });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}