import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getTursoClient } from "@/pages/api/components/dbAuth"
import bcrypt from "bcryptjs"
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined,
        req: any // NextAuth's RequestInternal type, can be 'any' for compatibility
      ) {
        if (!credentials?.email || !credentials?.password) return null

        const turso = getTursoClient()
        const result = await turso.execute(
          'SELECT id, email, password FROM users WHERE email = ?',
          [credentials.email]
        )
        if (!result.rows || result.rows.length === 0) return null

        // Defensive: ensure user fields are strings
        const user = result.rows[0]
        const id = user.id?.toString?.() ?? ""
        const email = user.email?.toString?.() ?? ""
        const hash = user.password?.toString?.() ?? ""

        if (!id || !email || !hash) return null

        const valid = await bcrypt.compare(credentials.password, hash)
        if (!valid) return null

        return { id, email }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/user/login"
  }
})