import { getTursoClient } from '@/server/db';
import { withApi } from '@/server/with-api';

export default withApi({ auth: 'admin' }, async ({ res }) => {
  const peopleResult = await getTursoClient().execute({
    sql: `
      SELECT
        u.id, u.email, u.isGoogleUser, u.isAdmin, -- not u.*: the browser has no business with password hashes
        p.*,
        pay.*
      FROM users u
      LEFT JOIN people p ON u.id = p.id
      LEFT JOIN payments pay ON u.id = pay.id
    `,
  });

  const people = peopleResult.rows.map((row) => ({ ...row, status: Boolean(row.status) }));

  res.status(200).json({ people });
});
