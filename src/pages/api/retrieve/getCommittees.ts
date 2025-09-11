import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await preFlightChecks(req, res);

    try {
    const turso = getTursoClient()

    const committeesResult = await turso.execute({
      sql: 'SELECT * FROM committees',
    });

    const committees = committeesResult.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      shorthand: row.shorthand,
      description: row.description,
      difficulty: row.difficulty,
      roles: row.roles,
      topics: row.topics,
      icon: row.icon || '',
    }));
    res.setHeader('Cache-Control', 'public, max-age=43200');
    res.status(200).json(committees);
  } catch (err: any) {
    console.error('Error fetching committees:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}