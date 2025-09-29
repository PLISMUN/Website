import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';
import sendEmail from '@/pages/api/internal/sendEmail';

/**
 * Creates a new application for the user.
 * 
 * @param {NextApiRequest[string]} req.body.email User's email
 * @param {NextApiRequest[string]} req.body.type Type of application (e.g., "delegate", "chair")
 * @param {NextApiRequest[string]} req.body.committee Committee ID the user is applying to
 * @param {NextApiRequest[string]} req.body.role Role the user is applying for
 * @param {NextApiRequest[string]} req.body.notes Additional notes for the application
 * @returns {NextApiResponse} res.status(200).json({ message: 'Signup successful', applicationId: <int> })
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  await authAdmin(req, res);
  
  const { email, type, committee, role, notes } = req.body;

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

    if (type !== 'supervisor') {
    const applicationResult = await turso.execute({
      sql: 'INSERT INTO applications (type, userId, committeeId, role, notes) VALUES (?, ?, ?, ?, ?) RETURNING id',
      args: [type, userId, committee, role, notes],
    });
    
    const applicationId = applicationResult.rows[0].id;

    if (type !== 'chair') {
      await sendEmail(email, 'Application registered', `Hello! Your application as ${role} has been registered.<br /><br />Please keep in mind your application will be reviewed only <u>after</u> payment is processed.`);
    } else {
      await sendEmail(email, 'Chair Application registered', `Hello! Your chair application has been registered.`);
    }

    res.status(200).json({ message: 'Signup successful', applicationId });
    } else {
      const applicationResult = await turso.execute({
        sql: 'INSERT INTO supervisors (userId, delegation) VALUES (?, ?) RETURNING id',
        args: [userId, committee],
      });
      res.status(200).json({ message: 'Signup successful'});
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}