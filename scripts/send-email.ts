import Module from 'module'

// Sends one email through src/server/email.ts, in the site's template, with a copy to the sender.
//   pnpm tsx --env-file=.env scripts/send-email.ts <to> <subject> <html body>
// Without EMAIL_PASSWORD it only prints the email.

// 'server-only' exists only inside Next's bundler, so stand in for it here.
// _resolveFilename is Node's internal hook, so it isn't in Module's types.
type ResolveFilename = (this: unknown, request: string, ...rest: unknown[]) => string
const hookable = Module as unknown as { _resolveFilename: ResolveFilename }
const resolve = hookable._resolveFilename
hookable._resolveFilename = function (request, ...rest) {
  if (request === 'server-only') return require.resolve('./empty-module')
  return resolve.call(this, request, ...rest)
}

const [to, subject, body] = process.argv.slice(2)
if (!to || !subject || !body) {
  console.error('Usage: pnpm tsx --env-file=.env scripts/send-email.ts <to> <subject> <html body>')
  process.exit(1)
}

import('@/server/email')
  .then(({ sendEmail }) => sendEmail(to, subject, body))
  .then(() => console.log(`Done: ${to}`))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
