import { Resend } from "resend";
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);
const clubName = `${process.env.NEXT_PUBLIC_CLUB_NAME}`;
const fromAddress = `${process.env.RESEND_FROM_EMAIL}`;
const logoURL = `${process.env.NEXT_PUBLIC_LOGO_URL}`;

export const sendTowFactorTokenEmail = async (email: string, token: string) => {
    const templatePath = path.join(process.cwd(), 'public', 'templates', 'twoFactorEmail.html');
  
    try {
      const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
      const htmlContent = htmlTemplate
        .replace('{{CLUBNAME}}', clubName)
        .replace('{{LOGO_URL}}', logoURL)
        .replace('{{TWO_FACTOR_CODE}}', token)
  
      await resend.emails.send({
        from: fromAddress,
        to: email,
        subject: "Two Factor Authentication Code",
        html: htmlContent
      });
  
      console.log("Two Factor Authentication code sent!");
      console.log("Email sent to:", email)
      console.log("Email sent from:", fromAddress)
  
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  }

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXT_URL}/auth/new-password?token=${token}`;
  const templatePath = path.join(process.cwd(), 'public', 'templates', 'resetPassword.html');

  try {
    const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    const htmlContent = htmlTemplate
      .replace('{{resetLink}}', resetLink)
      .replace('{{CLUBNAME}}', clubName)
      .replace('{{LOGO_URL}}', logoURL);

    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: "Reset your password",
      html: htmlContent
    });

    console.log("Password reset email sent!");
    console.log("Email sent to:", email)
    console.log("Email sent from:", fromAddress)

  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
}

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXT_URL}/auth/new-verification?token=${token}`;
  const templatePath = path.join(process.cwd(), 'public', 'templates', 'confirmEmail.html');

  try {
    const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    const htmlContent = htmlTemplate
      .replace('{{confirmLink}}', confirmLink)
      .replace('{{CLUBNAME}}', clubName)
      .replace('{{LOGO_URL}}', logoURL);

    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: "Verify your email",
      html: htmlContent
    });

    console.log("Verification email sent!");
    console.log("Email sent to:", email)
    console.log("Email sent from:", fromAddress)

  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
