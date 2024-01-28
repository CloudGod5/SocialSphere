import { db } from "@/lib/db";

export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        const twoFactorToken = await db.twoFactorToken.findUnique({
            where: { token }
        });

        console.log("twoFactorTokenByToken Successful:", twoFactorToken);
        return twoFactorToken;
    } catch (error) {
        console.error("Unable to get password reset token by token", error);
        return null;
    }
}

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await db.twoFactorToken.findFirst({
            where: { email }
        });

        console.log("twoFactorTokenByEmail Successful:", twoFactorToken);
        return twoFactorToken;
    } catch (error) {
        console.error(error);
        return null;
    }
}