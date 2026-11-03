import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  if (res.headersSent) return;

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const turso = getTursoClient()
    const result = await turso.execute({
      sql: `
        SELECT
          s.id,
          s.delegation,
          s.status,
          COALESCE(d.country, s.country) AS country,
          s.students,
          d.id IS NOT NULL AS linked,
          pay.status AS paid,
          (SELECT COUNT(*) FROM people p WHERE p.delegation = d.name AND p.id != s.userId) AS memberCount
        FROM supervisors s
        JOIN users u ON u.id = s.userId
        LEFT JOIN delegations d ON d.name = s.delegation
        LEFT JOIN payments pay ON pay.id = s.userId
        WHERE u.email = ?
        ORDER BY s.id
      `,
      args: [session.user.email],
    });

    const applications = result.rows.map((row: any) => ({
      id: Number(row.id),
      delegation: row.delegation,
      status: row.status,
      country: row.country || null,
      students: row.students === null || row.students === undefined ? null : Number(row.students),
      linked: Boolean(row.linked),
      paid: Boolean(row.paid),
      memberCount: Number(row.memberCount),
    }));

    res.status(200).json({ applications });
  } catch (err: any) {
    console.error('Error retrieving supervisor applications:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}
