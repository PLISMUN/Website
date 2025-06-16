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

    const delegationsResult = await turso.execute({
      sql: 'SELECT * FROM delegations',
    });
    
    const delegations = delegationsResult.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      shorthand: row.shorthand,
      country: row.country,
      adminId: row.adminId,
      notes: row.notes || '',
    }));
    res.status(200).json(delegations);
  } catch (err: any) {
    console.error('Error fetching delegations:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}