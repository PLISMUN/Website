import { NextApiRequest, NextApiResponse } from 'next'
import { getTursoClient } from '@/pages/api/components/dbAuth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

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
    value,
    status,
    code,
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
      SET value = ?, status = ?, code = ?
      WHERE id = ?
      `,
      args: [value, status, code, id],
    })

    if (paymentsUpdateResult.rowsAffected === 0) {
      await turso.execute({
      sql: `
        INSERT INTO payments (id, value, status, code)
        VALUES (?, ?, ?, ?)
      `,
      args: [id, value, status, code],
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