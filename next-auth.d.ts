import { UserRoles } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRoles;
    userName: string;
    phoneNumber: string;
    isTwoFactorEnabled: boolean;
    profilePicture: string;
    coverPhoto: string;
    isOAuth: boolean;
};

declare module "next-auth" {
    interface Session {
      user: ExtendedUser;
    }
}