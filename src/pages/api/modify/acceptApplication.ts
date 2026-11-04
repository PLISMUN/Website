import { getTursoClient } from '@/server/db';
import { sendEmail } from '@/server/email';
import { withApi } from '@/server/with-api';

/**
 * Accepts and rejects applications. Takes both student and supervisor applications: their IDs
 * can't overlap, because supervisor IDs start at 9991 (see scripts/db/schema.sql).
 *
 * @param req.body Object mapping application IDs to their acceptance status (true for accept, false for reject)
 */
export default withApi({ auth: 'admin' }, async ({ req, res }) => {
  const turso = getTursoClient();

  for (const [id, status] of Object.entries(req.body)) {
    if (status === true) {
      const applicationDetails = await turso.execute({
        sql: `
          SELECT applications.userId, applications.role, users.email, committees.name AS committeeName
          FROM applications
          JOIN users ON applications.userId = users.id
          JOIN committees ON applications.committeeId = committees.id
          WHERE applications.id = ?
        `,
        args: [id],
      });

      if (applicationDetails.rows.length > 0) {
        const { email, committeeName, role } = applicationDetails.rows[0];
        if (typeof email !== 'string' || !email) {
          return res.status(400).json({ message: 'Invalid email address' });
        }

        await sendEmail(
          email,
          'Application Accepted',
          `Congratulations! Your application (id ${id}) for the ${committeeName} committee as ${role} has been accepted.`
        );

        await turso.execute({
          sql: `UPDATE applications SET status = 'accepted' WHERE id = ?`,
          args: [id],
        });
        continue;
      }

      const supervisorDetails = await turso.execute({
        sql: `
          SELECT supervisors.userId, users.email, supervisors.delegation AS delegation
          FROM supervisors
          JOIN users ON supervisors.userId = users.id
          WHERE supervisors.id = ?
        `,
        args: [id],
      });

      if (supervisorDetails.rows.length === 0) {
        return res.status(404).json({ message: 'Application not found' });
      }

      const { email, delegation } = supervisorDetails.rows[0];
      if (typeof email !== 'string' || !email) {
        return res.status(400).json({ message: 'Invalid email address' });
      }

      await sendEmail(
        email,
        'Supervisor Application Accepted',
        `Congratulations! Your supervisor application (id ${id}) for delegation ${delegation} has been accepted.<br /><br />` +
        `Ask your students to select <b>${delegation}</b> as their delegation when they sign up. ` +
        `You can follow every member of your delegation, their applications and payments in the portal under <i>My Delegation</i>.`
      );

      await turso.execute({
        sql: `UPDATE supervisors SET status = 'accepted' WHERE id = ?`,
        args: [id],
      });
    } else if (status === false) {
      await turso.execute({
        sql: `UPDATE applications SET status = 'rejected' WHERE id = ?`,
        args: [id],
      });
      await turso.execute({
        sql: `UPDATE supervisors SET status = 'rejected' WHERE id = ?`,
        args: [id],
      });
    }
  }

  res.status(200).json({ message: 'Applications status update successful' });
});
