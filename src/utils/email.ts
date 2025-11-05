import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { render } from "@react-email/render";
import { ModernBusinessTemplate } from "@/components/email/template";
import { MinimalistTemplate } from "@/components/email/template";
import { VibrantTemplate } from "@/components/email/template";
import { CorporateTemplate } from "@/components/email/template";
import { env } from "./env";
import MagicLinkEmail from "./emails/magiclink-email";
import WelcomeEmail from "./emails/welcome-email";
import ResetPasswordEmail from "./emails/reset-email";
import EmailVerificationEmail from "./emails/verification-email";
import OrganizationInvitationEmail from "./emails/organization-invitation-email";

const transporter = nodemailer.createTransport({
  host: (env.NEXT_PUBLIC_SMTP_HOST as string) ?? "",
  port: (env.NEXT_PUBLIC_SMTP_PORT as unknown as number) ?? 25,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: (env.NEXT_PUBLIC_SMTP_USER as string) ?? "",
    pass: (env.NEXT_PUBLIC_SMTP_PASS as string) ?? "",
  },
});

export const sendEmail = async (
  subject: string,
  body: string,
  recipients: string[],
  template: "modern" | "minimalist" | "vibrant" | "classic",
): Promise<SMTPTransport.SentMessageInfo> => {
  const fromLine = env.NEXT_PUBLIC_SMTP_FROM ?? "no-reply";
  console.log(body);
  let emailHtml = "";
  switch (template) {
    case "modern":
      emailHtml = await render(ModernBusinessTemplate({ body }));
      break;
    case "minimalist":
      emailHtml = await render(MinimalistTemplate({ body }));
      break;
    case "vibrant":
      emailHtml = await render(VibrantTemplate({ body }));
      break;
    case "classic":
      emailHtml = await render(CorporateTemplate({ body }));
      break;
    default:
      emailHtml = body;
  }
  return await transporter.sendMail({
    from: fromLine,
    to: recipients.join(", "),
    subject: subject,
    text: body,
    html: emailHtml,
  });
};

type emailProps = {
  to: string;
  subject: string;
  text?: string;
};

export const sendWelcomeEmail = async ({
  to,
  subject,
  dashboard,
}: emailProps & {
  dashboard?: string;
}): Promise<SMTPTransport.SentMessageInfo> => {
  const fromLine = process.env.NEXT_PUBLIC_SMTP_FROM ?? "no-reply@photoml.app";

  const emailHtml = await render(
    WelcomeEmail({ userName: to, userEmail: to, dashboardLink: dashboard }),
  );

  const emailText = await render(
    WelcomeEmail({ userName: to, userEmail: to, dashboardLink: dashboard }),
    {
      plainText: true,
    },
  );

  return await transporter.sendMail({
    from: fromLine,
    to: to,
    subject: subject,
    text: emailText,
    html: emailHtml,
  });
};

export const sendMagicLinkEmail = async ({
  to,
  subject,
  magicLink,
}: {
  to: string;
  subject: string;
  magicLink: string;
}) => {
  const fromLine = process.env.NEXT_PUBLIC_SMTP_FROM ?? "no-reply@photoml.app";

  const emailHtml = await render(MagicLinkEmail({ magicLink, userEmail: to }));

  // Render plain text version
  const emailText = await render(MagicLinkEmail({ magicLink, userEmail: to }), {
    plainText: true,
  });

  return await transporter.sendMail({
    from: fromLine,
    to: to,
    subject: subject,
    text: emailText,
    html: emailHtml,
  });
};

export const sendResetPasswordEmail = async ({
  to,
  subject,
  resetLink,
}: {
  to: string;
  subject: string;
  resetLink: string;
}) => {
  const fromLine = process.env.NEXT_PUBLIC_SMTP_FROM ?? "no-reply@photoml.app";
  const emailHtml = await render(
    ResetPasswordEmail({ resetLink: resetLink, userEmail: to }),
  );

  const emailText = await render(
    ResetPasswordEmail({ resetLink: resetLink, userEmail: to }),
    {
      plainText: true,
    },
  );

  return await transporter.sendMail({
    from: fromLine,
    to: to,
    subject: subject,
    text: emailText,
    html: emailHtml,
  });
};

export const sendVerificationEmail = async ({
  to,
  subject,
  url,
}: {
  to: string;
  subject: string;
  url: string;
}) => {
  const fromLine = process.env.NEXT_PUBLIC_SMTP_FROM ?? "no-reply@photoml.app";
  const emailHtml = await render(
    EmailVerificationEmail({ verificationLink: url, userEmail: to }),
  );

  const emailText = await render(
    EmailVerificationEmail({ verificationLink: url, userEmail: to }),
    {
      plainText: true,
    },
  );
  return await transporter.sendMail({
    from: fromLine,
    to: to,
    subject: subject,
    text: emailText,
    html: emailHtml,
  });
};

export const sendOrganizationInvitation = async ({
  email,
  invitedByUsername,
  invitedByEmail,
  teamName,
  inviteLink,
}: {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
}) => {
  const fromLine = process.env.NEXT_PUBLIC_SMTP_FROM ?? "no-reply@photoml.app";
  const subject = `You're invited to join ${teamName}`;

  const emailHtml = await render(
    OrganizationInvitationEmail({
      userEmail: email,
      invitedByUsername,
      invitedByEmail,
      teamName,
      inviteLink,
    }),
  );

  const emailText = await render(
    OrganizationInvitationEmail({
      userEmail: email,
      invitedByUsername,
      invitedByEmail,
      teamName,
      inviteLink,
    }),
    {
      plainText: true,
    },
  );

  return await transporter.sendMail({
    from: fromLine,
    to: email,
    subject: subject,
    text: emailText,
    html: emailHtml,
  });
};
