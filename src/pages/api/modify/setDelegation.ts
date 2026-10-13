import { NextApiRequest, NextApiResponse } from 'next';
import { InStatement } from '@libsql/client';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

/**
 * Creates a delegation, or updates an existing one when an ID is provided.
 * Renaming a delegation also renames it on every person and supervisor application referencing it.
 * Supervisors are managed separately through /api/modify/setDelegationSupervisor.
 *
 * @param {NextApiRequest[number]} req.body.id Delegation ID to update (omit to create a new delegation)
 * @param {NextApiRequest[string]} req.body.name Delegation name
 * @param {NextApiRequest[string]} req.body.shorthand Delegation shorthand
 * @param {NextApiRequest[string]} req.body.country Country the delegation is from
 * @param {NextApiRequest[string]} req.body.notes Additional notes
 * @returns {NextApiResponse} res.status(200).json({ message: 'Delegation saved', id: <int> })
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  if (res.headersSent) return;
  await authAdmin(req, res, false);
  if (res.headersSent) return;

  const { id, name, shorthand, country, notes } = req.body;

  if (id !== undefined && id !== null && typeof id !== 'number') {
    return res.status(400).json({ message: 'Invalid delegation ID' });
  }
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 100) {
    return res.status(400).json({ message: 'Name is required and must be 100 characters or fewer' });
  }
  if (typeof shorthand !== 'string' || !shorthand.trim() || shorthand.trim().length > 20) {
    return res.status(400).json({ message: 'Shorthand is required and must be 20 characters or fewer' });
  }
  if (typeof country !== 'string' || !country.trim()) {
    return res.status(400).json({ message: 'Country is required' });
  }
  if (notes !== undefined && notes !== null && (typeof notes !== 'string' || notes.length > 1000)) {
    return res.status(400).json({ message: 'Notes must be 1000 characters or fewer' });
  }

  const cleanName = name.trim();
  const cleanShorthand = shorthand.trim();
  const cleanCountry = country.trim();
  const cleanNotes = notes ? notes : null;

  try {
    const turso = getTursoClient();

    if (typeof id === 'number') {
      const existing = await turso.execute({
        sql: 'SELECT name FROM delegations WHERE id = ?',
        args: [id],
      });
      if (!existing.rows.length) {
        return res.status(404).json({ message: 'Delegation not found' });
      }
      const oldName = existing.rows[0].name as string;

      const statements: InStatement[] = [{
        sql: `
          UPDATE delegations
          SET name = ?, shorthand = ?, country = ?, notes = ?
          WHERE id = ?
        `,
        args: [cleanName, cleanShorthand, cleanCountry, cleanNotes, id],
      }];

      // people.delegation and supervisors.delegation reference delegations by name
      if (oldName !== cleanName) {
        statements.push(
          { sql: 'UPDATE people SET delegation = ? WHERE delegation = ?', args: [cleanName, oldName] },
          { sql: 'UPDATE supervisors SET delegation = ? WHERE delegation = ?', args: [cleanName, oldName] },
        );
      }

      await turso.batch(statements, 'write');
      return res.status(200).json({ message: 'Delegation saved', id });
    }

    const inserted = await turso.execute({
      sql: `
        INSERT INTO delegations (name, shorthand, country, notes)
        VALUES (?, ?, ?, ?)
        RETURNING id
      `,
      args: [cleanName, cleanShorthand, cleanCountry, cleanNotes],
    });

    res.status(200).json({ message: 'Delegation saved', id: Number(inserted.rows[0].id) });
  } catch (err: any) {
    if (typeof err?.message === 'string' && err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ message: 'A delegation with this name or shorthand already exists' });
    }
    console.error('Error saving delegation:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}
