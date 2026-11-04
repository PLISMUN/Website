import { getAdminStatus, getSupervisedDelegations } from '@/server/auth';
import { getTursoClient } from '@/server/db';
import { withApi } from '@/server/with-api';
import type { MemberApplication, SupervisedDelegation } from '@/features/delegations/types';

/**
 * The members of a delegation, for its accepted supervisors and for admins.
 *
 * @param req.body.delegationId Delegation ID
 * @returns 200 { delegation, members }
 */
export default withApi({ auth: 'user' }, async ({ req, res, user }) => {
  const supervised = await getSupervisedDelegations(user.email);

  const { delegationId } = req.body;
  if (typeof delegationId !== 'number') {
    return res.status(400).json({ message: 'Invalid delegation ID' });
  }

  const turso = getTursoClient();

  let delegation: SupervisedDelegation | undefined = supervised.find(d => d.id === delegationId);
  if (!delegation) {
    if (!(await getAdminStatus(user.email))) {
      return res.status(403).json({ message: 'You are not a supervisor of this delegation' });
    }
    const delegationResult = await turso.execute({
      sql: 'SELECT id, name, shorthand, country FROM delegations WHERE id = ?',
      args: [delegationId],
    });
    if (!delegationResult.rows.length) {
      return res.status(404).json({ message: 'Delegation not found' });
    }
    const row = delegationResult.rows[0];
    delegation = {
      id: Number(row.id),
      name: row.name as string,
      shorthand: row.shorthand as string,
      country: row.country as string,
    };
  }

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

  const applicationsByUser: Record<number, MemberApplication[]> = {};
  for (const row of applicationsResult.rows) {
    (applicationsByUser[Number(row.userId)] ||= []).push({
      id: Number(row.id),
      type: row.type as string,
      committeeName: row.committeeName as string,
      role: row.role as string,
      status: row.status as string,
    });
  }
  for (const row of supervisorsResult.rows) {
    (applicationsByUser[Number(row.userId)] ||= []).push({
      id: Number(row.id),
      type: 'supervisor',
      committeeName: row.delegation as string,
      role: 'supervisor',
      status: row.status as string,
    });
  }

  const members = membersResult.rows.map((row) => ({
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
});
