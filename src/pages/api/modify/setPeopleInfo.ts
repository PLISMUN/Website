import { getTursoClient } from '@/server/db';
import { normalizeBirth, normalizePhone, validDiets } from '@/server/people-validation';
import { requireUserId } from '@/server/users';
import { withApi } from '@/server/with-api';

/**
 * Updates the user's personal information.
 *
 * @param req.body.email User's email
 * @param req.body.name User's name
 * @param req.body.birth User's birth date in YYYY-MM
 * @param req.body.phone User's phone number
 * @param req.body.nationality User's nationality
 * @param req.body.delegation User's delegation
 * @param req.body.diet User's dietary preferences
 * @param req.body.notes Additional notes for the user
 */
export default withApi({ auth: 'adminOrSelf' }, async ({ req, res }) => {
  const { email, name, birth, phone, nationality, delegation, diet, notes } = req.body;

  const birthString = normalizeBirth(birth);
  if (!birthString) {
    return res.status(400).json({ message: 'Invalid birthday' });
  }

  const phoneString = normalizePhone(phone);
  if (!phoneString) {
    return res.status(400).json({ message: 'Invalid phone number' });
  }

  if (typeof nationality !== 'string') {
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

  const userId = await requireUserId(email);
  const turso = getTursoClient();

  await turso.execute({
    sql: 'DELETE FROM people WHERE id = ?',
    args: [userId],
  });

  await turso.execute({
    sql: 'INSERT INTO people (id, name, birth, phone, nationality, delegation, diet, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    args: [userId, name, birthString, phoneString, nationality, delegation, diet, notes],
  });

  res.status(200).json({ message: 'Signup successful' });
});
