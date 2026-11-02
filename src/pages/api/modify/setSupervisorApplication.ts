import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';
import sendEmail from '@/pages/api/internal/sendEmail';
import { normalizeBirth, normalizePhone, validDiets } from '@/lib/peopleValidation';
import { stages } from '@/config/stages';

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

/**
 * Submits a supervisor (teacher / delegation leader) application for the signed-in user: saves their
 * personal information, records the application and sets their fee to the supervisor price.
 * Identity always comes from the session, never from the request body.
 *
 * A supervisor either joins a delegation that already exists (e.g. a second teacher from the same school),
 * or requests a new one, which an admin creates and links from the Delegations admin page.
 * Until then the supervisor's people.delegation stays NULL.
 *
 * @param {NextApiRequest[string]} req.body.name Full name
 * @param {NextApiRequest[string]} req.body.phone Phone number
 * @param {NextApiRequest[string]} req.body.birth Birth date (YYYY-MM-DD)
 * @param {NextApiRequest[string]} req.body.nationality Nationality
 * @param {NextApiRequest[string]} req.body.diet Dietary preference, one of validDiets
 * @param {NextApiRequest[string]} req.body.notes The supervisor's role at their school and anything else to note
 * @param {NextApiRequest[boolean]} req.body.existing Whether req.body.delegation is an existing delegation
 * @param {NextApiRequest[string]} req.body.delegation Delegation (school) name
 * @param {NextApiRequest[string]} req.body.country Country of a new delegation
 * @param {NextApiRequest[number]} req.body.students Expected number of students in a new delegation
 * @returns {NextApiResponse} res.status(200).json({ message: 'Application submitted', supervisorId: <int> })
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  if (res.headersSent) return;

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const email = session.user.email;

  if (!stages.supervisorApplication) {
    return res.status(403).json({ message: 'Supervisor applications are currently closed' });
  }

  const { name, phone, birth, nationality, diet, notes, existing, delegation, country, students } = req.body;

  if (typeof name !== 'string' || !name.trim() || name.trim().length > 100) {
    return res.status(400).json({ message: 'Name is required and must be 100 characters or fewer' });
  }
  const birthString = normalizeBirth(birth);
  if (!birthString) {
    return res.status(400).json({ message: 'Invalid birthday' });
  }
  const phoneString = normalizePhone(phone);
  if (!phoneString) {
    return res.status(400).json({ message: 'Invalid phone number' });
  }
  if (typeof nationality !== 'string' || !nationality.trim()) {
    return res.status(400).json({ message: 'Please select your nationality' });
  }
  if (typeof diet !== 'string' || !validDiets.includes(diet)) {
    return res.status(400).json({ message: 'Invalid diet option' });
  }
  if (typeof notes !== 'string' || !notes.trim() || notes.length > 2500) {
    return res.status(400).json({ message: 'Please tell us your role at your school (2500 characters or fewer)' });
  }
  if (typeof delegation !== 'string' || delegation.trim().length < 2 || delegation.trim().length > 100) {
    return res.status(400).json({ message: 'Delegation name must be between 2 and 100 characters' });
  }
  if (!existing) {
    if (typeof country !== 'string' || !country.trim() || country.trim().length > 100) {
      return res.status(400).json({ message: 'Please select the country your delegation is from' });
    }
    if (!Number.isInteger(students) || students < 1 || students > 200) {
      return res.status(400).json({ message: 'Expected number of students must be between 1 and 200' });
    }
  }

  try {
    const turso = getTursoClient();

    const userResult = await turso.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email],
    });
    if (!userResult.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userId = userResult.rows[0].id;

    // Matched case-insensitively so "prague international school" joins "Prague International School"
    const delegationResult = await turso.execute({
      sql: 'SELECT name, country FROM delegations WHERE lower(name) = lower(?)',
      args: [delegation.trim()],
    });
    const match = delegationResult.rows[0];
    if (existing && !match) {
      return res.status(400).json({ message: 'That delegation does not exist. Choose "Register a new delegation" instead.' });
    }
    const delegationName = match ? match.name as string : delegation.trim();

    const duplicate = await turso.execute({
      sql: "SELECT id FROM supervisors WHERE userId = ? AND lower(delegation) = lower(?) AND status != 'rejected'",
      args: [userId, delegationName],
    });
    if (duplicate.rows.length) {
      return res.status(409).json({ message: `You have already applied to supervise ${delegationName}` });
    }

    const results = await turso.batch([
      {
        // Keep the supervisor's current delegation if the requested one doesn't exist yet
        sql: `
          INSERT INTO people (id, name, birth, phone, nationality, delegation, diet, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            birth = excluded.birth,
            phone = excluded.phone,
            nationality = excluded.nationality,
            delegation = COALESCE(excluded.delegation, people.delegation),
            diet = excluded.diet,
            notes = excluded.notes
        `,
        args: [userId, name.trim(), birthString, phoneString, nationality.trim(), match ? delegationName : null, diet, notes.trim()],
      },
      {
        sql: 'INSERT INTO supervisors (userId, delegation, country, students) VALUES (?, ?, ?, ?) RETURNING id',
        args: [userId, delegationName, match ? match.country : country.trim(), existing ? null : students],
      },
      {
        sql: `
          INSERT INTO payments (id, valueCzk, valueEur) VALUES (?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET valueCzk = excluded.valueCzk, valueEur = excluded.valueEur
        `,
        args: [userId, process.env.NEXT_PUBLIC_PRICE_CZK_SUPERVISOR || 0, process.env.NEXT_PUBLIC_PRICE_EUR_SUPERVISOR || 0],
      },
    ], 'write');
    const supervisorId = Number(results[1].rows[0].id);

    const safeName = escapeHtml(name.trim());
    const safeDelegation = escapeHtml(delegationName);
    // The application is saved; a failed confirmation email shouldn't report it as failed (a retry would be a duplicate)
    await sendEmail(
      email,
      'Supervisor Application Received',
      `Hello ${safeName}! Your application to supervise <b>${safeDelegation}</b> has been received.<br /><br />` +
      `Our team will review it and email you once it has been approved. ` +
      (match
        ? `Your students can already select <b>${safeDelegation}</b> as their delegation when they sign up.`
        : `Once your delegation has been set up, your students will be able to select it as their delegation when they sign up.`) +
      `<br /><br />You can follow your application at any time in the portal under <i>Supervisor Application</i>.`
    ).catch(err => console.error('Error sending supervisor application email:', err));

    res.status(200).json({ message: 'Application submitted', supervisorId });
  } catch (err: any) {
    console.error('Error submitting supervisor application:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}
