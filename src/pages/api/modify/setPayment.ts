import { isPricingTier } from '@/config/pricing';
import { paymentStatusLabel } from '@/lib/utils';
import { getTursoClient } from '@/server/db';
import { sendEmail } from '@/server/email';
import { getLatestSiteConfig } from '@/server/site-config';
import { requireUserId } from '@/server/users';
import { withApi } from '@/server/with-api';

/**
 * Sets what a user owes to the price of a type of participant, and emails them the new amount.
 *
 * @param req.body.email User's email
 * @param req.body.tier 'delegate' | 'chair' | 'supervisor', priced in the pricing settings. Defaults to 'delegate'.
 */
export default withApi({ auth: 'admin' }, async ({ req, res }) => {
  const { email, tier = 'delegate' } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'Invalid email' });
  }
  if (!isPricingTier(tier)) {
    return res.status(400).json({ message: 'Invalid pricing tier' });
  }
  const { czk: valueCzk, eur: valueEur } = (await getLatestSiteConfig()).pricing[tier];

  const id = await requireUserId(email);
  const turso = getTursoClient();

  // Update payments table; insert if not exists
  const paymentsUpdateResult = await turso.execute({
    sql: `
      UPDATE payments
      SET valueCzk = ?, valueEur = ?
      WHERE id = ?
    `,
    args: [valueCzk, valueEur, id],
  });

  if (paymentsUpdateResult.rowsAffected === 0) {
    await turso.execute({
      sql: `
        INSERT INTO payments (id, valueCzk, valueEur)
        VALUES (?, ?, ?)
      `,
      args: [id, valueCzk, valueEur],
    });
  }

  // Read the row back so the email reports the stored status rather than
  // whatever the caller happened to send.
  const paymentResult = await turso.execute({
    sql: 'SELECT status FROM payments WHERE id = ?',
    args: [id],
  });
  const status = paymentStatusLabel(paymentResult.rows[0]?.status);

  await sendEmail(email, 'Payment Information Updated', `Your payment information has been updated. Your new payment details are as follows:<br />Amount (CZK): ${valueCzk} <br />Amount (EUR): ${valueEur}<br />Status: ${status}`);
  res.status(200).json({ message: 'Payment information updated successfully' });
});
