import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { getUserById } from "@/data/user"
import { UserRoles } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"

interface JWT {
    id: string;
    userName: string;
    role: 'ADMIN' | 'USER' | 'PARENT' | 'COACH';
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      }),
      await db.user.update({
        where: { id: user.id },
        data: { userName: user.name },
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log({
        user,
        account
      });
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(user.id);
        if (!twoFactorConfirmation) return false;

        // Delete 2FA confirmation token for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        });
        
      }

      return true;
    },
    async session({ token, session }) {

      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (token.userName && session.user) {
        session.user.userName = token.userName as string;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRoles;
      }
      
      return session
    },

    async jwt({ token }) { 

      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      
      token.userName = existingUser.userName;
      token.role = existingUser.role;

      return token 
    }

  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig
})