import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';
import { normalizeBirth, normalizePhone, validDiets } from '@/lib/peopleValidation';

/**
 * Updates the user's personal information.
 * @param {NextApiRequest[string]} req.body.email User's email
 * @param {NextApiRequest[string]} req.body.name User's name
 * @param {NextApiRequest[string]} req.body.birth User's birth date in YYYY-MM
 * @param {NextApiRequest[string]} req.body.phone User's phone number
 * @param {NextApiRequest[string]} req.body.nationality User's nationality
 * @param {NextApiRequest[string]} req.body.delegation User's delegation
 * @param {NextApiRequest[string]} req.body.diet User's dietary preferences
 * @param {NextApiRequest[string]} req.body.notes Additional notes for the user
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  if (res.headersSent) return;
  await authAdmin(req, res, true);
  if (res.headersSent) return;
  
  const { email, name, birth, phone, nationality, delegation, diet, notes } = req.body;

  const birthString = normalizeBirth(birth);
  if (!birthString) {
    return res.status(400).json({ message: "Invalid birthday" });
  }

  const phoneString = normalizePhone(phone);
  if (!phoneString) {
    return res.status(400).json({ message: 'Invalid phone number' });
  }

if (typeof nationality !== 'string' ) {
    return res.status(400).json({ message: 'Invalid nationality' });
}

if (typeof delegation !== 'string' || delegation.length > 100) {
    return res.status(400).json({ message: 'Delegation must be 100 characters or fewer' });
}

if (typeof diet !== 'string' || !validDiets.includes(diet)) {
    return res.status(400).json({ message: 'Invalid diet option' });
}

if (typeof notes !== 'string' || notes.length > 2500) {
    return res.status(400).json({ message: 'Notes must be 2500 characters or fewer' });
}

  try {
    const turso = getTursoClient()

    const userResult = await turso.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email],
    });

    if (!userResult.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    await turso.execute({
      sql: 'DELETE FROM people WHERE id = ?',
      args: [userId],
    });

    await turso.execute({
      sql: 'INSERT INTO people (id, name, birth, phone, nationality, delegation, diet, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      args: [userId, name, birthString, phoneString, nationality, delegation, diet, notes],
    });
    
    res.status(200).json({ message: 'Signup successful' });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}