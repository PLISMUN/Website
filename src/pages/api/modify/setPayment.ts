import { NextApiRequest, NextApiResponse } from 'next'
import { getTursoClient } from '@/pages/api/components/dbAuth'
import sendEmail from '@/pages/api/internal/sendEmail';

/**
 * Updates the user's completeinformation.
 * @param {NextApiRequest} req - The request object.
 *   id,
    email,
    name,
    isAdmin,
    isGoogleUser,
    birth,
    nationality,
    delegation,
    diet,
    notes,
    valueCzk,
    valueEur,
    status,
 * @param {NextApiResponse} res - The response object.
    [{
    id: 2,
    email: 'plismun@parklane-is.com',
    password: 'ya29.a0AW4XtxhYnWRHlBESc2PvI2MomAtWdg95oOyWdNO0YdDlsrbEFUQqN_830IFy4qz9JT2CcBXAnB0Ds9URaQNY2erg_m2XmQSf9YHtMBN9E9gXUSOkvyhR4QjOLok21O0844R6QhWIrQ8mO1WNaNERxGpXzxD0HXhb69xRFGS4SgaCgYKAboSARQSFQHGX2MihqMp6wFfBwyiwBVtAIye_Q0177',
    isGoogleUser: 1,
    isAdmin: 0,
    name: 'Plis The Mun',
    birth: '2004-05-31',
    nationality: 'Czech Republic',
    delegation: 'Prague International School',
    diet: 'Vegetarian',
    notes: 'I am MUN itself',
    valueCzk: 1200,
    valueEur: 50,
    status: 'pending',
  },...]
 * @returns {Promise<void>}
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { email, valueCzk = process.env.NEXT_PUBLIC_PRICE_CZK, valueEur = process.env.NEXT_PUBLIC_PRICE_EUR, status = 'Pending' } = req.body

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
      SET valueCzk = ?, valueEur = ?, status = ?
      WHERE id = ?
      `,
      args: [valueCzk, valueEur, status, id],
    })

    if (paymentsUpdateResult.rowsAffected === 0) {
      await turso.execute({
      sql: `
        INSERT INTO payments (id, valueCzk, valueEur, status)
        VALUES (?, ?, ?, ?)
      `,
      args: [id, valueCzk, valueEur, status],
      })
    
    }
    await sendEmail(email, 'Payment Information Updated', `Your payment information has been updated. Your new payment details are as follows:<br />Amount (CZK): ${valueCzk} <br />Amount (EUR): ${valueEur}<br />Status: ${status}`);
    res.status(200).json({ message: 'Payment information updated successfully' })
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Something went wrong' })
  }
}