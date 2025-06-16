import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    return res.status(500).json({ message: 'Server error: Missing env variables' });
  }

    try {
    const turso = getTursoClient()
    
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        isGoogleUser BOOLEAN NOT NULL,
        isAdmin BOOLEAN NOT NULL DEFAULT FALSE
        
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY UNIQUE,
      name TEXT NOT NULL,
      birth DATE NOT NULL,
      nationality TEXT NOT NULL,
      delegation TEXT NOT NULL,
      diet TEXT NOT NULL,
      notes TEXT,
      FOREIGN KEY (delegation) REFERENCES delegations(name),
      FOREIGN KEY (id) REFERENCES users(id)
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS delegations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        shorthand TEXT NOT NULL UNIQUE,
        country TEXT NOT NULL,
        adminId TEXT NOT NULL,
        notes TEXT,
        FOREIGN KEY (adminId) REFERENCES users(id)
      )
    `);

    res.status(200).json({ message: 'Database seeded successfully' });
  } catch (err: any) {
    console.error('Error fetching delegations:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}