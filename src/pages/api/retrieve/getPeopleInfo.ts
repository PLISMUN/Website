import { getTursoClient } from '@/server/db';
import { requireUserId } from '@/server/users';
import { withApi } from '@/server/with-api';

export default withApi({ auth: 'adminOrSelf' }, async ({ req, res }) => {
  const userId = await requireUserId(req.body.email);

  const personResult = await getTursoClient().execute({
    sql: 'SELECT name, birth, phone, nationality, delegation, diet, notes FROM people WHERE id = ?',
    args: [userId],
  });

  const personInfo = personResult.rows.map((row) => ({
    name: row.name?.toString() || '',
    birth: row.birth?.toString() || '',
    phone: row.phone?.toString() || '',
    nationality: row.nationality?.toString() || '',
    delegation: row.delegation?.toString() || '',
    diet: row.diet?.toString() || '',
    notes: row.notes?.toString() || '',
  }));
  res.status(200).json(personInfo);
});
