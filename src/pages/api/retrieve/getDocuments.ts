import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

/**
 * Lists the documents admins have created, oldest first. Public, since the documents themselves are.
 *
 * @returns {NextApiResponse} res.status(200).json({ documents: DocumentEntry[] })
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  if (res.headersSent) return;

  try {
    const turso = getTursoClient()
    const result = await turso.execute('SELECT * FROM documents ORDER BY id');

    const documents = result.rows.map((row: any) => ({
      id: Number(row.id),
      groupId: row.groupId,
      title: row.title,
      description: row.description,
      path: row.path,
      // A replaced document keeps its URL, so this is what makes browsers that cached the old one fetch the new one
      url: row.url ? `${row.url}?v=${Date.parse(row.uploadedAt)}` : null,
      size: row.size === null ? null : Number(row.size),
      uploadedAt: row.uploadedAt,
    }));

    res.status(200).json({ documents });
  } catch (err: any) {
    console.error('Error retrieving documents:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}
