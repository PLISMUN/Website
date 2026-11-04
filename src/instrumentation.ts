// Next.js runs this once when the server starts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { reportEnvProblems } = await import('@/server/env')
    reportEnvProblems()
  }
}
