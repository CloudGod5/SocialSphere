import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "./schemas"
import credentials from "next-auth/providers/credentials"
import { getUserByEmail } from "@/data/user"
import bcrypt from "bcryptjs"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export default {
  providers: [
    Github({
      clientId: process.env.GITGUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    credentials({
      async authorize(credentials) {

        const validatedFields = await LoginSchema.safeParse(credentials)

        if (validatedFields.success) {

          const { email, password } = validatedFields.data
          const user = await getUserByEmail(email);

          if(!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password
          );

          if (passwordsMatch) return user;

        }
        
        return null;
      }
    })
  ],
} satisfies NextAuthConfig