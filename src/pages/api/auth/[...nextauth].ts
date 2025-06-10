import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getTursoClient } from "@/pages/api/components/dbAuth"
import bcrypt from "bcryptjs"
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({ //TODO publish google oauth on prod
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
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
        if (!credentials?.email || !credentials?.password) throw new Error("Email and password are required");

        const turso = getTursoClient()
        const result = await turso.execute(
          'SELECT id, email, password, isGoogleUser FROM users WHERE email = ?',
          [credentials.email]
        )
        if (!result.rows || result.rows.length === 0) throw new Error("No user found with this email");

        // Defensive: ensure user fields are strings
        const user = result.rows[0]
        const id = user.id?.toString?.() ?? ""
        const email = user.email?.toString?.() ?? ""
        const hash = user.password?.toString?.() ?? ""
        const isGoogleUser = Boolean(user.isGoogleUser);

        if (!id || !email || !hash || typeof isGoogleUser !== "boolean") throw new Error("Database store error");

        if (isGoogleUser === true) {
          throw new Error("This account was created with Google. Please sign in using Google.");
        }
        const valid = await bcrypt.compare(credentials.password, hash)
        if (!valid) throw new Error("Invalid password");

        return { id, email }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/user/login"
  },
  events: {
      async signIn({ user, account }) {
      if (account?.provider === "google" && user?.email) {
        const turso = getTursoClient();
        // Check if user already exists
        const result = await turso.execute(
          'SELECT id FROM users WHERE email = ?',
          [user.email]
        );
        if (!result.rows || result.rows.length === 0) {
          await turso.execute({
            sql: 'INSERT INTO users (email, password, isGoogleUser) VALUES (?, ?, ?)',
            args: [user.email, account.access_token || "GoogleUser", true],
          });
        }
      }
    }
  }
})