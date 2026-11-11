import { randomBytes } from 'crypto';
import { BlobNotFoundError, del, head } from '@vercel/blob';
import { getTursoClient } from '@/server/db';
import { getLatestSiteConfig } from '@/server/site-config';
import { withApi } from '@/server/with-api';

// "Übersicht: Part 2" -> "ubersicht-part-2"
const slugify = (title: string) =>
  title
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 60)
    .replace(/^-+|-+$/g, '') || 'document';

/**
 * Creates a document, publishes the PDF just uploaded for one, or deletes one along with its PDF.
 * The URL and size come from the Blob store, not the request, so only a real upload can be published.
 *
 * @param req.body.action 'create' | 'publish' | 'delete'
 * @param req.body.id Document ID (publish and delete)
 * @param req.body.groupId ID of a section in the documents settings (create)
 * @param req.body.title Title (create)
 * @param req.body.description Description (create)
 * @returns 200 { message: 'Document created' | 'Document published' | 'Document deleted' }
 */
export default withApi({ auth: 'admin' }, async ({ req, res }) => {
  const { action, id, groupId, title, description } = req.body;

  try {
    const turso = getTursoClient();

    if (action === 'create') {
      const { groups: documentGroups, titleMaxLength, descriptionMaxLength } = (await getLatestSiteConfig()).documents;
      if (!documentGroups.some(group => group.id === groupId)) {
        return res.status(400).json({ message: 'Unknown section' });
      }
      if (typeof title !== 'string' || !title.trim() || title.trim().length > titleMaxLength) {
        return res.status(400).json({ message: `Title is required and must be ${titleMaxLength} characters or fewer` });
      }
      if (typeof description !== 'string' || !description.trim() || description.trim().length > descriptionMaxLength) {
        return res.status(400).json({ message: `Description is required and must be ${descriptionMaxLength} characters or fewer` });
      }

      // The random part keeps documents with the same title apart, and stops a new
      // document inheriting the cached file of a deleted one with the same title
      const path = `documents/${groupId}/${slugify(title)}-${randomBytes(4).toString('hex')}.pdf`;
      await turso.execute({
        sql: 'INSERT INTO documents (groupId, title, description, path) VALUES (?, ?, ?, ?)',
        args: [groupId, title.trim(), description.trim(), path],
      });
      return res.status(200).json({ message: 'Document created' });
    }

    if (action !== 'publish' && action !== 'delete') {
      return res.status(400).json({ message: 'Invalid action' });
    }
    if (typeof id !== 'number') {
      return res.status(400).json({ message: 'Invalid document ID' });
    }

    const existing = await turso.execute({
      sql: 'SELECT path FROM documents WHERE id = ?',
      args: [id],
    });
    if (!existing.rows.length) {
      return res.status(404).json({ message: 'Document not found' });
    }
    const path = existing.rows[0].path as string;

    if (action === 'publish') {
      const blob = await head(path);
      await turso.execute({
        sql: 'UPDATE documents SET url = ?, size = ?, uploadedAt = ? WHERE id = ?',
        args: [blob.url, blob.size, blob.uploadedAt.toISOString(), id],
      });
      return res.status(200).json({ message: 'Document published' });
    }

    // File first: the row is the only record of where the file is, so if deleting the file
    // fails the row has to stay for the admin to retry, or a public file would be left behind.
    // Runs even if nothing was published, as an upload can succeed without being published.
    await del(path);
    await turso.execute({
      sql: 'DELETE FROM documents WHERE id = ?',
      args: [id],
    });
    res.status(200).json({ message: 'Document deleted' });
  } catch (err) {
    if (err instanceof BlobNotFoundError) {
      return res.status(404).json({ message: 'The uploaded file was not found' });
    }
    throw err;
  }
});
