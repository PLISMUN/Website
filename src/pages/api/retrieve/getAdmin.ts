import { getTursoClient } from '@/server/db';
import { withApi } from '@/server/with-api';

// Identity comes from the session, so this can't be used to find out who the admins are
export default withApi({ auth: 'user' }, async ({ res, user }) => {
  const userResult = await getTursoClient().execute({
    sql: 'SELECT isAdmin FROM users WHERE email = ?',
    args: [user.email],
  });

  if (!userResult.rows.length) {
    console.error('User not found');
    return res.status(404).json({ message: 'User not found' });
  }

  const personInfo = userResult.rows.map((row) => ({
    isAdmin: row.isAdmin?.toString() || '',
  }));
  res.status(200).json(personInfo);
});
