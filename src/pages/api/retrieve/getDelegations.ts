import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);

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
    res.setHeader('Cache-Control', 'public, max-age=43200');
    res.status(200).json(delegations);
  } catch (err: any) {
    console.error('Error fetching delegations:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}