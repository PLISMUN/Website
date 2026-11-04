import { getTursoClient } from '@/server/db';
import { withApi } from '@/server/with-api';

export default withApi({ auth: 'admin' }, async ({ res }) => {
  const turso = getTursoClient();

  const applicationsResult = await turso.execute({
    sql: `
      SELECT
        a.*,
        c.name as committeeName,
        p.*,
        p.notes as userNotes,
        u.email as userEmail,
        pay.status as paymentStatus
      FROM applications a
      JOIN committees c ON a.committeeId = c.id
      JOIN people p ON a.userId = p.id
      JOIN users u ON a.userId = u.id
      JOIN payments pay ON a.userId = pay.id
    `,
  });

  const applicationsSupervisorResult = await turso.execute({
    sql: `
      SELECT
        a.id,
        a.userId,
        a.delegation AS committeeName,
        'supervisor' AS type,
        a.status,
        NULL AS committeeId,
        'supervisor' AS role,
        NULL AS notes,
        u.email AS userEmail,
        p.name AS name,
        p.birth AS birth,
        p.phone AS phone,
        p.nationality AS nationality,
        a.delegation AS delegation,
        p.notes AS userNotes,
        pay.status AS paymentStatus
      FROM supervisors a
      JOIN people p ON a.userId = p.id
      JOIN users u ON a.userId = u.id
      JOIN payments pay ON a.userId = pay.id
    `,
  });

  const combinedApplications = [
    ...applicationsResult.rows,
    ...applicationsSupervisorResult.rows,
  ].map((row) => ({ ...row, paymentStatus: Boolean(row.paymentStatus) }));

  res.status(200).json({ applications: combinedApplications });
});
