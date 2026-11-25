import { hasAccess } from '@/server/access';
import { withApi } from '@/server/with-api';

/**
 * Whether a password from an access link (/?access=…) is the current one, so the browser can open what's
 * closed. Says nothing about what the password is.
 *
 * @param req.body.key The password from the link
 * @returns 200 { valid: boolean }
 */
export default withApi({ auth: 'public' }, async ({ req, res }) => {
  res.status(200).json({ valid: await hasAccess(req.body?.key) });
});
