import { db } from "@/lib/db";
import { Console } from "console";

export const getVerificationTokenByToken = async (token: string) => {
    try {
      console.log(`getVerificationTokenByToken called with token: ${token}`);
      const verificationToken = await db.verificationToken.findUnique({
        where: { token }
      });
      if (verificationToken) {
          console.log(`Token found: ${JSON.stringify(verificationToken)}`);
          return verificationToken;
      } else {
          console.log("Token not found");
          return null;
      }
    } catch (error) {
      console.log("Error retrieving verification token:", error);
      return null;
    }
  }  

export const getVerificationTokenByEmail = async (
  email: string
) => {
  try {
    console.log("getVerificationTokenByEmail called");
    const verificationToken = await db.verificationToken.findFirst({
      where: { email }
    });

    console.log("getVerificationTokenByEmail return Success");
    return verificationToken;
  } catch {
    console.log("getVerificationTokenByEmail return Fail");
    return null;
  }
}