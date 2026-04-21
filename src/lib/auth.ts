import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/** True when the user has an active premium subscription right now. */
export function hasActivePremium(u: {
  premiumStatus: string;
  premiumUntil: Date | null;
}): boolean {
  if (u.premiumStatus !== "active") return false;
  if (!u.premiumUntil) return false;
  return u.premiumUntil.getTime() > Date.now();
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          isPremium: hasActivePremium(user),
          discordLinked: !!user.discordId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On initial sign-in, copy user fields onto the token.
      if (user) {
        token.id = user.id;
        token.username = user.name as string;
        token.isPremium = !!user.isPremium;
        token.discordLinked = !!user.discordLinked;
      }

      // Re-hydrate premium + discord status from the DB when the client calls
      // update() (e.g. after returning from Stripe checkout or Discord OAuth).
      // We don't refresh on every request — that would hammer the DB.
      if (trigger === "update" && token.id) {
        const fresh = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            premiumStatus: true,
            premiumUntil: true,
            discordId: true,
          },
        });
        if (fresh) {
          token.isPremium = hasActivePremium(fresh);
          token.discordLinked = !!fresh.discordId;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.isPremium = !!token.isPremium;
        session.user.discordLinked = !!token.discordLinked;
      }
      return session;
    },
  },
};
