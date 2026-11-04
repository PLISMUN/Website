import { getTursoClient } from '@/server/db';
import { withApi } from '@/server/with-api';

/**
 * Updates everything about a user at once, from the Users admin page.
 *
 * @param req.body { id, email, name, isAdmin, isGoogleUser, birth, phone, nationality, delegation, diet, notes, valueCzk, valueEur, status }
 * @returns 200 { people: [...] } with every user, as from /api/retrieve/getUsers
 */
export default withApi({ auth: 'admin' }, async ({ req, res }) => {
  const {
    id,
    email,
    name,
    isAdmin,
    isGoogleUser,
    birth,
    phone,
    nationality,
    delegation,
    diet,
    notes,
    valueCzk,
    valueEur,
    status,
  } = req.body;

  if (!id || typeof id !== 'number') {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  // people.delegation references delegations(name); a blank one means the person has no delegation (yet)
  const delegationName = typeof delegation === 'string' && delegation.trim() ? delegation.trim() : null;

  const turso = getTursoClient();

  // Update users table
  await turso.execute({
    sql: `
      UPDATE users
      SET email = ?, isAdmin = ?, isGoogleUser = ?
      WHERE id = ?
    `,
    args: [email, !!isAdmin, !!isGoogleUser, id],
  });

  // Upsert people table: update if exists, insert if not
  const peopleUpdateResult = await turso.execute({
    sql: `
      UPDATE people
      SET name = ?, birth = ?, phone = ?, nationality = ?, delegation = ?, diet = ?, notes = ?
      WHERE id = ?
    `,
    args: [name, birth, phone ?? null, nationality, delegationName, diet, notes, id],
  });

  if (peopleUpdateResult.rowsAffected === 0) {
    await turso.execute({
      sql: `
        INSERT INTO people (id, name, birth, phone, nationality, delegation, diet, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [id, name, birth, phone ?? null, nationality, delegationName, diet, notes],
    });
  }

  // Update payments table; insert if not exists
  const paymentsUpdateResult = await turso.execute({
    sql: `
      UPDATE payments
      SET valueCzk = ?, valueEur = ?, status = ?
      WHERE id = ?
    `,
    args: [valueCzk, valueEur, !!status, id],
  });

  if (paymentsUpdateResult.rowsAffected === 0) {
    await turso.execute({
      sql: `
        INSERT INTO payments (id, valueCzk, valueEur, status)
        VALUES (?, ?, ?, ?)
      `,
      args: [id, valueCzk, valueEur, !!status],
    });
  }

  const peopleResult = await turso.execute({
    sql: `
      SELECT
        u.id, u.email, u.isGoogleUser, u.isAdmin, -- not u.*: the browser has no business with password hashes
        p.*,
        pay.*
      FROM users u
      LEFT JOIN people p ON u.id = p.id
      LEFT JOIN payments pay ON u.id = pay.id
    `,
  });

  const people = peopleResult.rows.map((row) => ({ ...row, status: Boolean(row.status) }));

  res.status(200).json({ people });
});
