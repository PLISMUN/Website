import { getTursoClient } from '@/server/db';
import { sendEmail } from '@/server/email';
import { requireUserId } from '@/server/users';
import { withApi } from '@/server/with-api';

/**
 * Creates a new application for the user.
 *
 * @param req.body.email User's email
 * @param req.body.type Type of application ("delegate" or "chair"; supervisors use setSupervisorApplication)
 * @param req.body.committee Committee ID the user is applying to
 * @param req.body.role Role the user is applying for
 * @param req.body.notes Additional notes for the application
 * @returns 200 { message: 'Signup successful', applicationId: <int> }
 */
export default withApi({ auth: 'adminOrSelf' }, async ({ req, res }) => {
  const { email, type, committee, role, notes } = req.body;

  const userId = await requireUserId(email);

  if (type === 'supervisor') {
    return res.status(400).json({ message: 'Supervisor applications are submitted through /api/modify/setSupervisorApplication' });
  }

  const applicationResult = await getTursoClient().execute({
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
});
