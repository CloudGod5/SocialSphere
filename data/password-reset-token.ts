import { db } from "@/lib/db";

export const getPasswordResetTokenByToken = async (token: string) => {
    console.log("getPasswordResetTokenByToken called")
    try {
        const passwordToken = await db.passwordResetToken.findUnique({
            where: { token }
        });
        console.log("passwordToken", passwordToken);
        return passwordToken;
    }
    catch (error) {
        console.error("Error retrieving password reset token", error);
        return null;
    }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
    console.log("getPasswordResetTokenByToken called")
    try {
        const passwordToken = await db.passwordResetToken.findFirst({
            where: { email }
        });
        console.log("passwordToken", passwordToken);
        return passwordToken;
    }
    catch (error) {
        console.error("Error retrieving password reset token", error);
        return null;
    }
}