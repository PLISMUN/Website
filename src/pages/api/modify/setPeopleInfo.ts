import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

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
  await authAdmin(req, res);
  
  const { email, name, birth, phone, nationality, delegation, diet, notes } = req.body;

  // Normalize birth to YYYY-MM-DD accepting multiple common formats:
  // - ISO dates with or without time (1975-11-07 or 1975-11-07T00:00:00Z)
  // - YYYY-MM (will become YYYY-MM-01)
  // - timestamps (ms)
  // - localized slash formats (07/11/1975 or 11/07/1975) — try to disambiguate by value
  let birthString = "";

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const formatDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const tryParseDate = (v: string): string | null => {
    const s = v.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    if (/^\d{4}-\d{2}$/.test(s)) return `${s}-01`;
    if (s.includes('T')) return s.split('T')[0];
    if (s.includes(' ')) {
      // "YYYY-MM-DD hh:mm:ss" or similar
      const first = s.split(' ')[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(first)) return first;
    }
    if (s.includes('/')) {
      const parts = s.split('/').map(p => p.trim());
      if (parts.length === 3) {
        // If first part has length 4 -> YYYY/MM/DD
        if (parts[0].length === 4 && /^\d{4}$/.test(parts[0])) {
          return `${parts[0]}-${pad(Number(parts[1]))}-${pad(Number(parts[2]))}`;
        }
        const a = Number(parts[0]), b = Number(parts[1]), c = Number(parts[2]);
        // If first part > 12, treat as DD/MM/YYYY (common in Europe)
        if (a > 12) {
          return `${c}-${pad(b)}-${pad(a)}`;
        }
        // Otherwise try MM/DD/YYYY (US) first; if invalid, fall back below
        const candidate = new Date(`${c}-${pad(a)}-${pad(b)}`);
        if (!isNaN(candidate.getTime())) return formatDate(candidate);
        // fallback to DD/MM/YYYY
        const swapped = new Date(`${c}-${pad(b)}-${pad(a)}`);
        if (!isNaN(swapped.getTime())) return formatDate(swapped);
      }
    }
    // Last resort: let JS try to parse; if valid produce YYYY-MM-DD
    const parsed = Date.parse(s);
    if (!isNaN(parsed)) return formatDate(new Date(parsed));
    return null;
  };

  if (typeof birth === 'number') {
    const d = new Date(birth);
    if (!isNaN(d.getTime())) birthString = formatDate(d);
  } else if (birth instanceof Date) {
    if (!isNaN(birth.getTime())) birthString = formatDate(birth);
  } else if (typeof birth === 'string') {
    const normalized = tryParseDate(birth);
    if (normalized) birthString = normalized;
  }

  // Validate final YYYY-MM-DD and logical range
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthString)) {
    return res.status(400).json({ message: "Invalid birthday" });
  }
  const birthDate = new Date(birthString);
  if (isNaN(birthDate.getTime())) {
    return res.status(400).json({ message: "Invalid birthday" });
  }
  const now = new Date();
  const eightyYearsAgo = new Date(now.getFullYear() - 80, now.getMonth(), now.getDate());
  const sevenYearsAgo = new Date(now.getFullYear() - 7, now.getMonth(), now.getDate());
  if (birthDate < eightyYearsAgo || birthDate > sevenYearsAgo) {
    return res.status(400).json({ message: "Invalid birthday" });
  }

  const phoneString = typeof phone === 'string' ? phone.trim() : '';
  if (!/^\+?[0-9][0-9\s()-]{5,19}$/.test(phoneString)) {
    return res.status(400).json({ message: 'Invalid phone number' });
  }

if (typeof nationality !== 'string' ) {
    return res.status(400).json({ message: 'Invalid nationality' });
}

if (typeof delegation !== 'string' || delegation.length > 100) {
    return res.status(400).json({ message: 'Delegation must be 100 characters or fewer' });
}

const validDiets = [
  "Omnivore", "Vegetarian", "Vegan", "Gluten Free", "Lactose Free", "Withdraw"
];
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