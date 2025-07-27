import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    return res.status(500).json({ message: 'Server error: Missing env variables' });
  }

  const { email } = req.body;
  console.log(req.body)
  console.log('Email:', email);

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
        await turso.execute({
            sql: 'INSERT INTO payments (id, value) VALUES (?, ?)',
            args: [userId, 60],
        });
    }
    
    const paymentInfo = paymentsResult.rows.map((row: any) => ({
        value: row.value?.toString() || '',
        status: row.status?.toString() || '',
        state: row.status?.toString() || '',
    }));
    res.status(200).json(paymentInfo);
  } catch (err: any) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}