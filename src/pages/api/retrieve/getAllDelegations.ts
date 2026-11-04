import { getTursoClient } from '@/server/db';
import { withApi } from '@/server/with-api';

export default withApi({ auth: 'admin' }, async ({ res }) => {
  const turso = getTursoClient();

  const delegationsResult = await turso.execute({
    sql: `
      SELECT
        d.*,
        (SELECT COUNT(*) FROM people p WHERE p.delegation = d.name) AS memberCount
      FROM delegations d
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
        s.country,
        s.students,
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

  const delegations = delegationsResult.rows.map((row) => ({
    id: Number(row.id),
    name: row.name,
    shorthand: row.shorthand,
    country: row.country,
    notes: row.notes || '',
    memberCount: Number(row.memberCount),
  }));

  const supervisors = supervisorsResult.rows.map((row) => ({
    id: Number(row.id),
    userId: Number(row.userId),
    delegation: row.delegation,
    status: row.status,
    country: row.country || null,
    students: row.students === null || row.students === undefined ? null : Number(row.students),
    email: row.email,
    name: row.name || null,
  }));

  const users = usersResult.rows.map((row) => ({
    id: Number(row.id),
    email: row.email,
    name: row.name || null,
    isSupervisor: Boolean(row.isSupervisor),
  }));

  res.status(200).json({ delegations, supervisors, users });
});
