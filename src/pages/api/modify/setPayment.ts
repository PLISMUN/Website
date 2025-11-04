import { NextApiRequest, NextApiResponse } from 'next'
import { getTursoClient } from '@/pages/api/components/dbAuth'
import sendEmail from '@/pages/api/internal/sendEmail';
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  await authAdmin(req, res);

  const { email, valueCzk = process.env.NEXT_PUBLIC_PRICE_CZK, valueEur = process.env.NEXT_PUBLIC_PRICE_EUR } = req.body

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'Invalid email' })
  }


  try {
    const turso = getTursoClient()

    const userResult = await turso.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email],
    })
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }
    const id = userResult.rows[0].id

    // Update payments table; insert if not exists
    const paymentsUpdateResult = await turso.execute({
      sql: `
      UPDATE payments
      SET valueCzk = ?, valueEur = ?
      WHERE id = ?
      `,
      args: [valueCzk, valueEur, id],
    })

    if (paymentsUpdateResult.rowsAffected === 0) {
      await turso.execute({
      sql: `
        INSERT INTO payments (id, valueCzk, valueEur)
        VALUES (?, ?, ?, ?)
      `,
      args: [id, valueCzk, valueEur],
      })
    
    }
    await sendEmail(email, 'Payment Information Updated', `Your payment information has been updated. Your new payment details are as follows:<br />Amount (CZK): ${valueCzk} <br />Amount (EUR): ${valueEur}<br />Status: ${status}`);
    res.status(200).json({ message: 'Payment information updated successfully' })
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Something went wrong' })
  }
}