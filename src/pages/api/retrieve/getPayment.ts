import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  await authAdmin(req, res);
  
  const { email } = req.body;

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

    const paymentsResult = await turso.execute({
      sql: 'SELECT * FROM payments WHERE id = ?',
      args: [userId],
    });

    if (!paymentsResult.rows.length) {
        const newPayment = await turso.execute({
            sql: 'INSERT INTO payments (id, valueCzk, valueEur) VALUES (?, ?, ?) RETURNING *',
            args: [userId, process.env.NEXT_PUBLIC_PRICE_CZK || 0, process.env.NEXT_PUBLIC_PRICE_EUR || 0],
        });
    }
    
    const paymentInfo = paymentsResult.rows.map((row: any) => ({
        valueCzk: row.valueCzk?.toString() || '',
        valueEur: row.valueEur?.toString() || '',
        status: row.status?.toString() || '',
        state: row.status?.toString() || '',
    }));
    res.status(200).json(paymentInfo);
  } catch (err: any) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}