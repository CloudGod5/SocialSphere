import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { getUserById } from "@/data/user"
import { UserRoles } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"
import { geAccountByUserId } from "@/data/account"

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

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.phoneNumber = token.phoneNumber as string;
        session.user.profilePicture = token.profilePicture as string;
        session.user.coverPhoto = token.coverPhoto as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }
      
      return session
    },

    async jwt({ token }) { 
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await geAccountByUserId(token.sub);
      
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.userName = existingUser.userName;
      token.phoneNumber = existingUser.phoneNumber;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token 
    }

  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig
})