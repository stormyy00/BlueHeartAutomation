import dotenv from "dotenv";
import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

dotenv.config({
  path: "../.env",
});

const transporter = nodemailer.createTransport({
  host: (process.env.NEXT_PUBLIC_SMTP_HOST as string) ?? "",
  port: (process.env.NEXT_PUBLIC_SMTP_PORT as unknown as number) ?? 25,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: (process.env.NEXT_PUBLIC_SMTP_USER as string) ?? "",
    pass: (process.env.NEXT_PUBLIC_SMTP_PASS as string) ?? "",
  },
});

export const sendEmail = async (
  subject: string,
  body: string,
  recipients: string[],
): Promise<SMTPTransport.SentMessageInfo> => {
  const fromLine = process.env.NEXT_PUBLIC_SMTP_FROM ?? "no-reply";
  return await transporter.sendMail({
    from: fromLine,
    to: recipients.join(", "),
    subject: subject,
    text: body,
    html: body,
  });
};
