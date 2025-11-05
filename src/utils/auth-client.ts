import { createAuthClient } from "better-auth/react";
import {
  magicLinkClient,
  organizationClient,
} from "better-auth/client/plugins";

const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // Point to the Next.js app
  plugins: [organizationClient(), magicLinkClient()],
});

export const {
  useSession,
  signIn,
  signUp,
  signOut,
  magicLink,
  organization,
  requestPasswordReset,
  resetPassword,
} = authClient;

// Export organization client methods for easier access
export const {
  create: createOrganization,
  list: useListOrganizations,
  checkSlug: checkOrganizationSlug,
  setActive: setActiveOrganization,
  getActiveMember,
  getActiveMemberRole,
  listMembers,
  removeMember,
  updateMemberRole,
  leave: leaveOrganization,
  acceptInvitation,
  cancelInvitation,
  rejectInvitation,
  getInvitation,
  inviteMember,
  listInvitations,
} = organization;
