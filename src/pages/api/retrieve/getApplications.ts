import { conference } from '@/config/conference';
import { getTursoClient } from '@/server/db';
import { requireUserId } from '@/server/users';
import { withApi } from '@/server/with-api';

export default withApi({ auth: 'adminOrSelf' }, async ({ req, res }) => {
  const userId = await requireUserId(req.body.email);
  const turso = getTursoClient();

  const applicationsResult = await turso.execute({
    sql: `
      SELECT
        a.*,
        c.name as committeeName
      FROM applications a
      JOIN committees c ON a.committeeId = c.id
      WHERE a.userId = ?
    `,
    args: [userId],
  });

  const applicationsSupervisorResult = await turso.execute({
    sql: `
      SELECT
        id,
        userId,
        delegation AS committeeName,
        'supervisor' AS type,
        status,
        NULL AS committeeId,
        'Supervisor' AS role,
        ? AS notes
      FROM supervisors
      WHERE userId = ?
    `,
    args: [`Please contact us at ${conference.contactEmail}. This application is for reference purposes only.`, userId],
  });

  const combinedApplications = [
    ...applicationsResult.rows,
    ...applicationsSupervisorResult.rows,
  ];

  res.status(200).json({ applications: combinedApplications });
});
