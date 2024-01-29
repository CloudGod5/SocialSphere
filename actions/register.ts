"use server"

import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail, getUserByUserName } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {

    const validatedFields = RegisterSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { name, username, email, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUserName = await getUserByUserName(username);
    if(existingUserName) {
        return { error: "username already exists" };
    }

    const existingUser = await getUserByEmail(email);
    if(existingUser) {
        return { error: "Email already exists" };
    }

    await db.user.create({
        data: {
            name,
            username,
            email,
            password: hashedPassword,
        }
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);


    return { success: "A confirmation email has been sent to the entered email address!" };

};