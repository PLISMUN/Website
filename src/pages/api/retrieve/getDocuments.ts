import { getTursoClient } from '@/server/db';
import { withApi } from '@/server/with-api';

/**
 * Lists the documents admins have created, oldest first. Public, since the documents themselves are.
 *
 * @returns 200 { documents: DocumentEntry[] }
 */
export default withApi({ auth: 'public' }, async ({ res }) => {
  const result = await getTursoClient().execute('SELECT * FROM documents ORDER BY id');

  const documents = result.rows.map((row) => ({
    id: Number(row.id),
    groupId: row.groupId,
    title: row.title,
    description: row.description,
    path: row.path,
    // A replaced document keeps its URL, so this is what makes browsers that cached the old one fetch the new one
    url: row.url ? `${row.url}?v=${Date.parse(String(row.uploadedAt))}` : null,
    size: row.size === null ? null : Number(row.size),
    uploadedAt: row.uploadedAt,
  }));

  res.status(200).json({ documents });
});
