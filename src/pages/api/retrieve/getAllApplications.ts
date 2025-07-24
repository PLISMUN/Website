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

    const applicationsResult = await turso.execute({
      sql: `
        SELECT 
          a.*, 
          c.name as committeeName,
          p.*,
          p.notes as userNotes,
          u.email as userEmail
        FROM applications a
        JOIN committees c ON a.committeeId = c.id
        JOIN people p ON a.userId = p.id
        JOIN users u ON a.userId = u.id
      `
    });

    res.status(200).json({ applications: applicationsResult.rows });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}