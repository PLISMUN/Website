import 'server-only'
import bcrypt from 'bcryptjs'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { getTursoClient } from '@/server/db'
import type { SupervisedDelegation } from '@/features/delegations/types'

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<'email' | 'password', string> | undefined) {
        if (!credentials?.email || !credentials?.password) throw new Error('Email and password are required')

        const turso = getTursoClient()
        const result = await turso.execute(
          'SELECT id, email, password, isGoogleUser FROM users WHERE email = ?',
          [credentials.email]
        )
        if (!result.rows || result.rows.length === 0) throw new Error('No user found with this email')

        const user = result.rows[0]
        const id = user.id?.toString?.() ?? ''
        const email = user.email?.toString?.() ?? ''
        const hash = user.password?.toString?.() ?? ''
        const isGoogleUser = Boolean(user.isGoogleUser)

        if (!id || !email || !hash || typeof isGoogleUser !== 'boolean') throw new Error('Database store error')

        if (isGoogleUser === true) {
          throw new Error('This account was created with Google. Please sign in using Google.')
        }
        const valid = await bcrypt.compare(credentials.password, hash)
        if (!valid) throw new Error('Invalid password')

        return { id, email, name: `${email.split('@')[0]}.${id}` }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/user/login',
    newUser: '/user/signup',
  },
  events: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user?.email) {
        const turso = getTursoClient()
        // Check if user already exists
        const result = await turso.execute('SELECT id FROM users WHERE email = ?', [user.email])
        if (!result.rows || result.rows.length === 0) {
          await turso.execute({
            sql: 'INSERT INTO users (email, password, isGoogleUser) VALUES (?, ?, ?)',
            args: [user.email, account.access_token || 'GoogleUser', true],
          })
        }
      }
    },
  },
}

/** Whether the user is an admin, or null if there's no such user. */
export async function getAdminStatus(email: string): Promise<boolean | null> {
  const result = await getTursoClient().execute({
    sql: 'SELECT isAdmin FROM users WHERE email = ?',
    args: [email],
  })
  if (!result.rows.length) return null

  const isAdmin = result.rows[0].isAdmin
  return isAdmin === 1 || isAdmin === '1'
}

/** The delegations the user supervises: the ones they hold an accepted supervisor application for. */
export async function getSupervisedDelegations(email: string): Promise<SupervisedDelegation[]> {
  const result = await getTursoClient().execute({
    sql: `
      SELECT DISTINCT d.id, d.name, d.shorthand, d.country
      FROM delegations d
      JOIN supervisors s ON s.delegation = d.name
      JOIN users u ON u.id = s.userId
      WHERE u.email = ? AND s.status = 'accepted'
      ORDER BY d.name
    `,
    args: [email],
  })

  return result.rows.map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    shorthand: String(row.shorthand),
    country: String(row.country),
  }))
}
