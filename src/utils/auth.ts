import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import {
  users,
  accounts,
  sessions,
  verification,
  jwks,
  invitations,
  organizations,
  organizationMembers,
} from "@/db/schema";
import { organization, jwt, magicLink } from "better-auth/plugins";
import {
  sendMagicLinkEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendOrganizationInvitation,
} from "./email";
import { headers } from "next/headers";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      account: accounts,
      session: sessions,
      verification: verification,
      jwks: jwks,
      invitation: invitations,
      organization: organizations,
      member: organizationMembers,
    },
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({
        to: user.email,
        subject: "Reset your password",
        resetLink: url,
      });
    },
    signUp: {
      sendWelcomeEmail: async ({
        email,
        name,
      }: {
        email: string;
        name?: string;
      }) => {
        await sendWelcomeEmail({
          to: email,
          subject: `Hello ${name}! Welcome to our Ttickle!`,
          dashboard: `${process.env.BETTER_AUTH_URL}/dashboard`,
        });
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({
        to: user.email,
        subject: "Verify your email address",
        url: url,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: ["http://localhost:3000", "https://blueheartautomation.com"],
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail({
          to: email,
          subject: "Ttickle Magic Link Sign-In",
          magicLink: url,
        });
      },
    }),
    organization({
      allowUserToCreateOrganization: true,
      allowUserToInviteUsers: true,
      async sendInvitationEmail({ id, email, inviter, organization }) {
        const inviteLink = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/accept-invite?id=${id}`;
        await sendOrganizationInvitation({
          email: email,
          invitedByUsername: inviter.user.name,
          invitedByEmail: inviter.user.email,
          teamName: organization.name,
          inviteLink,
        });
      },
      organizationHooks: {
        beforeCreateOrganization: async ({ organization }) => {
          // Generate slug from organization name if not provided
          const slug =
            organization.slug ||
            (organization.name || "")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "");

          return {
            data: {
              ...organization,
              slug,
            },
          };
        },
        afterCreateOrganization: async ({ organization, member, user }) => {
          // Set the creator as the owner with admin role
          console.log(
            `Organization ${organization.name} created by ${user.email} with role ${member.role}`,
          );
        },
      },
    }),
    jwt(),
  ],
});

export const getServerSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
};

export const authenticate = async () => {
  const session = await getServerSession();
  if (!session?.user || !session?.user?.email) {
    return {
      message: "Invalid Authentication",
      auth: 401,
    };
  }
  return {
    uid: session.user.id,
    user: session.user,
    orgId: session.session?.activeOrganizationId || null,
    message: null,
    auth: 200,
  };
};

export const listUserOrganizations = async () => {
  return await auth.api.listOrganizations({
    headers: headers(),
  });
};

export const getActiveOrganization = async (): Promise<string | null> => {
  const session = await getServerSession();
  return session?.session?.activeOrganizationId || null;
};

export const getFullOrganization = async (orgId: string, orgSlug: string) => {
  return await auth.api.getFullOrganization({
    query: {
      organizationId: orgId,
      organizationSlug: orgSlug,
      membersLimit: 100,
    },
    headers: await headers(),
  });
};

// export const createSuccessResponse = (data: any, status = 200) => {
//   return Response.json(data, { status });
// };

// export const createErrorResponse = (message: string, status = 400) => {
//   return Response.json({ error: message }, { status });
// };
