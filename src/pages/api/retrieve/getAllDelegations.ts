import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

/**
 * Admin view of delegations, together with the delegation leader (supervisor) applications
 * and the list of users that can be assigned as a delegation leader.
 *
 * @returns {NextApiResponse} res.status(200).json({ delegations, supervisors, users })
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  if (res.headersSent) return;
  await authAdmin(req, res, false);
  if (res.headersSent) return;

  try {
    const turso = getTursoClient()

    const delegationsResult = await turso.execute({
      sql: `
        SELECT
          d.*,
          u.email AS leaderEmail,
          p.name AS leaderName,
          (SELECT COUNT(*) FROM people pp WHERE pp.delegation = d.name) AS memberCount
        FROM delegations d
        LEFT JOIN users u ON u.id = d.adminId
        LEFT JOIN people p ON p.id = d.adminId
        ORDER BY d.name
      `,
    });

    const supervisorsResult = await turso.execute({
      sql: `
        SELECT
          s.id,
          s.userId,
          s.delegation,
          s.status,
          u.email,
          p.name
        FROM supervisors s
        JOIN users u ON u.id = s.userId
        LEFT JOIN people p ON p.id = s.userId
        ORDER BY s.id
      `,
    });

    const usersResult = await turso.execute({
      sql: `
        SELECT
          u.id,
          u.email,
          p.name,
          EXISTS (SELECT 1 FROM supervisors s WHERE s.userId = u.id) AS isSupervisor
        FROM users u
        LEFT JOIN people p ON p.id = u.id
        ORDER BY p.name, u.email
      `,
    });

    const delegations = delegationsResult.rows.map((row: any) => ({
      id: Number(row.id),
      name: row.name,
      shorthand: row.shorthand,
      country: row.country,
      adminId: Number(row.adminId),
      notes: row.notes || '',
      leaderEmail: row.leaderEmail || null,
      leaderName: row.leaderName || null,
      memberCount: Number(row.memberCount),
    }));

    const supervisors = supervisorsResult.rows.map((row: any) => ({
      id: Number(row.id),
      userId: Number(row.userId),
      delegation: row.delegation,
      status: row.status,
      email: row.email,
      name: row.name || null,
    }));

    const users = usersResult.rows.map((row: any) => ({
      id: Number(row.id),
      email: row.email,
      name: row.name || null,
      isSupervisor: Boolean(row.isSupervisor),
    }));

    res.status(200).json({ delegations, supervisors, users });
  } catch (err: any) {
    console.error('Error retrieving delegations:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}
