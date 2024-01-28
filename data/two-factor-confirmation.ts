import { db } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (
        userId: string
    ) => {
    try {
        const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
            where: { userId }
        });

        console.log("twoFactorConfirmationByUserId Successful:", twoFactorConfirmation);
        return twoFactorConfirmation;
    } catch (error) {
        console.error("Unable to get two factor confirmation by user id", error);
        return null;
    }
}