import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';
import authSupervisor from '@/lib/authSupervisor';

/**
 * Lists everyone signed up under a delegation, with their personal information, payment and applications.
 * Only available to accepted delegation leaders of that delegation.
 *
 * @param {NextApiRequest[number]} req.body.delegationId Delegation ID to list members of
 * @returns {NextApiResponse} res.status(200).json({ delegation, members })
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  if (res.headersSent) return;

  const supervised = await authSupervisor(req, res);
  if (!supervised) return;

  const { delegationId } = req.body;
  if (typeof delegationId !== 'number') {
    return res.status(400).json({ message: 'Invalid delegation ID' });
  }

  const delegation = supervised.find(d => d.id === delegationId);
  if (!delegation) {
    return res.status(403).json({ message: 'You are not a supervisor of this delegation' });
  }

  try {
    const turso = getTursoClient()

    const membersResult = await turso.execute({
      sql: `
        SELECT
          u.id,
          u.email,
          p.name,
          p.birth,
          p.phone,
          p.nationality,
          p.diet,
          p.notes,
          pay.valueCzk,
          pay.valueEur,
          pay.status AS paymentStatus
        FROM people p
        JOIN users u ON u.id = p.id
        LEFT JOIN payments pay ON pay.id = p.id
        WHERE p.delegation = ?
        ORDER BY p.name
      `,
      args: [delegation.name],
    });

    const applicationsResult = await turso.execute({
      sql: `
        SELECT a.id, a.userId, a.type, a.role, a.status, c.name AS committeeName
        FROM applications a
        JOIN committees c ON c.id = a.committeeId
        JOIN people p ON p.id = a.userId
        WHERE p.delegation = ?
      `,
      args: [delegation.name],
    });

    const supervisorsResult = await turso.execute({
      sql: `
        SELECT s.id, s.userId, s.delegation, s.status
        FROM supervisors s
        JOIN people p ON p.id = s.userId
        WHERE p.delegation = ?
      `,
      args: [delegation.name],
    });

    const applicationsByUser: Record<number, any[]> = {};
    for (const row of applicationsResult.rows as any[]) {
      (applicationsByUser[Number(row.userId)] ||= []).push({
        id: Number(row.id),
        type: row.type,
        committeeName: row.committeeName,
        role: row.role,
        status: row.status,
      });
    }
    for (const row of supervisorsResult.rows as any[]) {
      (applicationsByUser[Number(row.userId)] ||= []).push({
        id: Number(row.id),
        type: 'supervisor',
        committeeName: row.delegation,
        role: 'supervisor',
        status: row.status,
      });
    }

    const members = membersResult.rows.map((row: any) => ({
      id: Number(row.id),
      email: row.email,
      name: row.name,
      birth: row.birth,
      phone: row.phone || '',
      nationality: row.nationality,
      diet: row.diet,
      notes: row.notes || '',
      valueCzk: row.valueCzk ?? null,
      valueEur: row.valueEur ?? null,
      paymentStatus: Boolean(row.paymentStatus),
      applications: applicationsByUser[Number(row.id)] || [],
    }));

    res.status(200).json({ delegation, members });
  } catch (err: any) {
    console.error('Error retrieving delegation members:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}
