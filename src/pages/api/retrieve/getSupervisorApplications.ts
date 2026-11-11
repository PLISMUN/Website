import { getTursoClient } from '@/server/db';
import { withApi } from '@/server/with-api';

export default withApi({ auth: 'user' }, async ({ res, user }) => {
  const result = await getTursoClient().execute({
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
    args: [user.email],
  });

  const applications = result.rows.map((row) => ({
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
});
