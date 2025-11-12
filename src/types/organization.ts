import type { OrganizationMetadata } from "./metadata";

/**
 * Organization role types
 */
export type OrganizationRole = "owner" | "admin" | "member";

/**
 * Region types
 */
export type Region = "US" | "Canada";

/**
 * Organization member interface
 */
export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: OrganizationRole;
  joinedAt: Date;
  createdAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

/**
 * Organization interface (new structure with metadata)
 */
export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  logo?: string | null;
  documents?: string[];
  users?: string[];
  region?: Region;
  calendarId?: string;
  metadata?: OrganizationMetadata;
  keepCurrentActiveOrganization?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Organization invitation interface
 */
export interface OrganizationInvitation {
  id: string;
  email: string;
  organizationId: string;
  role: OrganizationRole;
  status: "pending" | "accepted" | "rejected" | "expired";
  expiresAt: Date;
  inviterId: string;
  createdAt: Date;
}

/**
 * Invitation status from Better Auth API
 * Note: Better Auth uses "canceled" (one 'l'), not "cancelled" (two 'l's)
 */
export type InvitationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "expired"
  | "canceled";

/**
 * Full organization with members and invitations
 * This matches the return type from Better Auth's getFullOrganization API
 */
export interface FullOrganization {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  logo?: string | null;
  metadata?: OrganizationMetadata | Record<string, unknown>;
  members: Array<{
    id: string;
    organizationId: string;
    role: OrganizationRole;
    createdAt: Date;
    userId: string;
    user: {
      email: string;
      name: string;
      image?: string;
    };
  }>;
  invitations: Array<{
    id: string;
    organizationId: string;
    email: string;
    role: OrganizationRole;
    status: InvitationStatus;
    inviterId: string;
    expiresAt: Date;
  }>;
}

/**
 * Legacy organization interface for backward compatibility
 * @deprecated Use Organization with metadata instead
 */
export interface LegacyOrganization {
  id: string;
  name: string;
  description: string;
  owner: string;
  icon: string;
  media: string[];
  newsletters: string[];
  themes: string[];
  notes: string[];
  users: string[];
  donors: string[];
  links: Array<{ name: string; url: string }>;
  region: Region;
  groups: Array<{ name: string; emails: string[] }>;
  calendarId: string;
}

/**
 * Role hierarchy and permissions
 */
export const ROLE_HIERARCHY: Record<OrganizationRole, number> = {
  owner: 3,
  admin: 2,
  member: 1,
};

/**
 * Check if a role has permission to perform an action
 */
export function hasRolePermission(
  userRole: OrganizationRole,
  requiredRole: OrganizationRole,
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Check if a role is an admin (owner or admin)
 */
export function isAdminRole(role: OrganizationRole): boolean {
  return role === "owner" || role === "admin";
}

/**
 * Check if a role is an owner
 */
export function isOwnerRole(role: OrganizationRole): boolean {
  return role === "owner";
}

/**
 * Check if a role can manage another role
 */
export function canManageRole(
  managerRole: OrganizationRole,
  targetRole: OrganizationRole,
): boolean {
  // Owners can manage everyone
  if (managerRole === "owner") return true;

  // Admins can manage members but not owners
  if (managerRole === "admin") return targetRole === "member";

  // Members cannot manage anyone
  return false;
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: OrganizationRole): string {
  switch (role) {
    case "owner":
      return "Owner";
    case "admin":
      return "Admin";
    case "member":
      return "Member";
    default:
      return "Unknown";
  }
}

/**
 * Get role icon
 */
export function getRoleIcon(role: OrganizationRole): string {
  switch (role) {
    case "owner":
      return "👑";
    case "admin":
      return "🛡️";
    case "member":
      return "👤";
    default:
      return "❓";
  }
}
