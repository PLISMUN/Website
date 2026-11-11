import { getTursoClient } from '@/server/db';
import { withApi } from '@/server/with-api';

/**
 * Manages the supervisors of a delegation. A delegation can have any number of supervisors;
 * a supervisor is a row in the supervisors table, and only accepted rows grant access.
 *
 * @param req.body.action One of:
 *   "link"   - attach an existing supervisor application (req.body.supervisorId) to req.body.delegationId
 *   "add"    - make a user (req.body.userId) an accepted supervisor of req.body.delegationId
 *   "remove" - revoke a supervisor (req.body.supervisorId) by marking their application rejected
 * @returns 200 { message, supervisorId: <int> }
 */
export default withApi({ auth: 'admin' }, async ({ req, res }) => {
  const { action, delegationId, supervisorId, userId } = req.body;

  const turso = getTursoClient();

  if (action === 'remove') {
    if (typeof supervisorId !== 'number') {
      return res.status(400).json({ message: 'Invalid supervisor ID' });
    }
    const result = await turso.execute({
      sql: "UPDATE supervisors SET status = 'rejected' WHERE id = ?",
      args: [supervisorId],
    });
    if (!result.rowsAffected) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }
    return res.status(200).json({ message: 'Supervisor removed', supervisorId });
  }

  if (action !== 'link' && action !== 'add') {
    return res.status(400).json({ message: 'Invalid action' });
  }
  if (typeof delegationId !== 'number') {
    return res.status(400).json({ message: 'Invalid delegation ID' });
  }

  const delegationResult = await turso.execute({
    sql: 'SELECT name FROM delegations WHERE id = ?',
    args: [delegationId],
  });
  if (!delegationResult.rows.length) {
    return res.status(404).json({ message: 'Delegation not found' });
  }
  const delegationName = delegationResult.rows[0].name as string;

  if (action === 'link') {
    if (typeof supervisorId !== 'number') {
      return res.status(400).json({ message: 'Invalid supervisor ID' });
    }
    const supervisorResult = await turso.execute({
      sql: 'SELECT userId FROM supervisors WHERE id = ?',
      args: [supervisorId],
    });
    if (!supervisorResult.rows.length) {
      return res.status(404).json({ message: 'Supervisor application not found' });
    }

    await turso.batch([
      { sql: 'UPDATE supervisors SET delegation = ? WHERE id = ?', args: [delegationName, supervisorId] },
      // A supervisor is part of the delegation they lead
      { sql: 'UPDATE people SET delegation = ? WHERE id = ?', args: [delegationName, supervisorResult.rows[0].userId] },
    ], 'write');

    return res.status(200).json({ message: 'Supervisor application linked', supervisorId });
  }

  // action === 'add'
  if (typeof userId !== 'number') {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  const userResult = await turso.execute({
    sql: 'SELECT id FROM users WHERE id = ?',
    args: [userId],
  });
  if (!userResult.rows.length) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Reuse the user's existing application for this delegation (e.g. a removed one) instead of duplicating it
  const existing = await turso.execute({
    sql: 'SELECT id FROM supervisors WHERE userId = ? AND delegation = ? ORDER BY id LIMIT 1',
    args: [userId, delegationName],
  });

  let newSupervisorId: number;
  if (existing.rows.length) {
    newSupervisorId = Number(existing.rows[0].id);
    await turso.execute({
      sql: "UPDATE supervisors SET status = 'accepted' WHERE id = ?",
      args: [newSupervisorId],
    });
  } else {
    const inserted = await turso.execute({
      sql: "INSERT INTO supervisors (userId, delegation, status) VALUES (?, ?, 'accepted') RETURNING id",
      args: [userId, delegationName],
    });
    newSupervisorId = Number(inserted.rows[0].id);
  }

  res.status(200).json({ message: 'Supervisor added', supervisorId: newSupervisorId });
});
