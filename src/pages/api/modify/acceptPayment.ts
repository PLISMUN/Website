import { getTursoClient } from '@/server/db';
import { sendEmail } from '@/server/email';
import { requireUserId } from '@/server/users';
import { withApi } from '@/server/with-api';

export default withApi({ auth: 'admin' }, async ({ req, res }) => {
  const { email } = req.body;
  const id = await requireUserId(email);

  await getTursoClient().execute({
    sql: `
      UPDATE payments
      SET status = ?
      WHERE id = ?
    `,
    args: [true, id],
  });

  await sendEmail(email, 'Payment Processed', `Your payment has been processed successfully. <br />Thank you for helping support PLISMUN!`);
  res.status(200).json({ message: 'Payment information updated successfully' });
});
