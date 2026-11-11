import { getTursoClient } from '@/server/db';
import { getLatestSiteConfig } from '@/server/site-config';
import { requireUserId } from '@/server/users';
import { withApi } from '@/server/with-api';

export default withApi({ auth: 'adminOrSelf' }, async ({ req, res }) => {
  const userId = await requireUserId(req.body.email);
  const turso = getTursoClient();

  const paymentsResult = await turso.execute({
    sql: 'SELECT * FROM payments WHERE id = ?',
    args: [userId],
  });

  let rows = paymentsResult.rows;

  if (!rows.length) {
    const { pricing } = await getLatestSiteConfig();
    const newPayment = await turso.execute({
      sql: 'INSERT INTO payments (id, valueCzk, valueEur) VALUES (?, ?, ?) RETURNING *',
      args: [userId, pricing.delegate.czk, pricing.delegate.eur],
    });
    rows = newPayment.rows;
  }

  const paymentInfo = rows.map((row) => ({
    valueCzk: row.valueCzk?.toString() || '',
    valueEur: row.valueEur?.toString() || '',
    status: Boolean(row.status),
    state: Boolean(row.status),
  }));
  res.status(200).json(paymentInfo);
});
