import { NextApiRequest, NextApiResponse } from 'next'
import { getTursoClient } from '@/pages/api/components/dbAuth'
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

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
  await preFlightChecks(req, res);
  await authAdmin(req, res);

  const {
    id,
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
  } = req.body

  if (!id || typeof id !== 'number') {
    return res.status(400).json({ message: 'Invalid user ID' })
  }

  try {
    const turso = getTursoClient()

    // Update users table
    await turso.execute({
      sql: `
        UPDATE users
        SET email = ?, isAdmin = ?, isGoogleUser = ?
        WHERE id = ?
      `,
      args: [email, !!isAdmin, !!isGoogleUser, id],
    })

    // Upsert people table: update if exists, insert if not
    const peopleUpdateResult = await turso.execute({
      sql: `
      UPDATE people
      SET name = ?, birth = ?, nationality = ?, delegation = ?, diet = ?, notes = ?
      WHERE id = ?
      `,
      args: [name, birth, nationality, delegation, diet, notes, id],
    })

    if (peopleUpdateResult.rowsAffected === 0) {
      await turso.execute({
      sql: `
        INSERT INTO people (id, name, birth, nationality, delegation, diet, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [id, name, birth, nationality, delegation, diet, notes],
      })
    }

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

    const peopleResult = await turso.execute({
      sql: `
        SELECT 
          u.*, 
          p.*,
          pay.*
        FROM users u
        LEFT JOIN people p ON u.id = p.id
        LEFT JOIN payments pay ON u.id = pay.id
      `,
    });

    res.status(200).json({ people: peopleResult.rows })
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Something went wrong' })
  }
}