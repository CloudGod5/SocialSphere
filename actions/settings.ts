"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { get } from "http";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export const settings = async (
    values: z.infer<typeof SettingsSchema>
) => {
    const user = await currentUser();
    if (!user) {
        return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
        return { error: "Unauthorized" };
    }

    if (user.isOAuth) {
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    if (values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);
        if (existingUser && existingUser.email !== user.email) {
            return { error: "Email already exists!" };
        }
        const verificationToken = await generateVerificationToken(values.email as string);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return { success: "Email verification sent to your email!" };
    }

    if (values.password && values.newPassword && dbUser.password) {
        const passwordMatch = bcrypt.compare(
            values.password,
            dbUser.password
        );
        if (!passwordMatch) {
            return { error: "Current password is incorrect!" };
        }
        const hashedPassword = await bcrypt.hash(values.newPassword, 10);
        
        values.password = hashedPassword;
        values.newPassword = undefined;
        
        await db.user.update({
            where: { id: user.id },
            data: {
                ...values
            }
        });
        return { success: "Password updated successfully!" };
    }


    await db.user.update({
        where: { id: user.id },
        data: {
            ...values
        }
    });
    return { success: "Settings updated successfully!" };
};