import { getTursoClient } from '@/server/db';
import { withApi } from '@/server/with-api';

export default withApi({ auth: 'public' }, async ({ res }) => {
  const delegationsResult = await getTursoClient().execute({
    sql: 'SELECT * FROM delegations',
  });

  const delegations = delegationsResult.rows.map((row) => ({
    id: row.id,
    name: row.name,
    shorthand: row.shorthand,
    country: row.country,
  }));
  res.setHeader('Cache-Control', 'public, max-age=43200');
  res.status(200).json(delegations);
});
