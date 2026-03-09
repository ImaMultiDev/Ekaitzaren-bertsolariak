import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const secret = process.env.NEXTAUTH_SECRET;
if (!secret || secret.length < 32) {
  console.warn(
    "[auth] NEXTAUTH_SECRET debe tener al menos 32 caracteres. Genera uno con: openssl rand -base64 32"
  );
}

export const authOptions: NextAuthOptions = {
  secret: secret || undefined,
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        if (!email || !password) return null;
        if (
          credentials?.email === email &&
          credentials?.password === password
        ) {
          return { id: "admin", email, name: "Admin" };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  pages: { signIn: "/admin/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = "admin";
      return token;
    },
    session({ session, token }) {
      if (session.user) (session.user as { role?: string }).role = token.role as string;
      return session;
    },
  },
};
