"use server";

import { db } from "@/db";
import { organizations, organizationMembers, users } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { authenticate, getServerSession, auth } from "@/utils/auth";
import { headers } from "next/headers";

export const getRole = async (uid: string) => {
  return await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, uid));
};

export const getOrganizationId = async () => {
  const { uid, message, auth } = await authenticate();
  if (auth !== 200 || !uid) {
    throw new Error(message || "Unauthorized");
  }
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, uid))
    .limit(1);
  const orgId = user?.organizationId || "";
  return orgId;
};

export const getOrganizationIds = async () => {
  const { uid, message, auth } = await authenticate();
  if (auth !== 200 || !uid) {
    throw new Error(message || "Unauthorized");
  }

  const userOrgs = await db
    .select({ organizationId: organizationMembers.organizationId })
    .from(organizationMembers)
    .where(eq(organizationMembers.userId, uid));

  const orgIds = userOrgs.map((org) => org.organizationId);
  return orgIds;
};

export const updateUserProfile = async (data: {
  name?: string;
  image?: string;
}) => {
  const { uid, auth } = await authenticate();
  if (auth !== 200 || !uid) throw new Error("Unauthorized");

  await db
    .update(users)
    .set({
      ...(data.name && { name: data.name }),
      ...(data.image && { image: data.image }),
    })
    .where(eq(users.id, uid));

  return { success: true };
};

export const getOrganizationProfile = async () => {
  const { uid, message, auth } = await authenticate();
  if (auth !== 200 || !uid) {
    throw new Error(message || "Unauthorized");
  }

  const orgIds = await getOrganizationIds();
  if (!orgIds || orgIds.length === 0) {
    throw new Error("User must be part of an organization");
  }

  if (orgIds.length === 0) {
    return [];
  }

  const orgs = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      role: organizationMembers.role,
    })
    .from(organizations)
    .innerJoin(
      organizationMembers,
      and(
        eq(organizations.id, organizationMembers.organizationId),
        eq(organizationMembers.userId, uid),
      ),
    )
    .where(inArray(organizations.id, orgIds));

  console.log("Fetched Organizations:", orgs);
  return orgs;
};

export async function getOrganizations() {
  try {
    const { uid, message, auth } = await authenticate();
    if (auth !== 200 || !uid) {
      throw new Error(message || "Unauthorized");
    }

    const orgId = await getOrganizationId();
    if (!orgId) {
      throw new Error("User must be part of an organization");
    }

    const userOrgs = await db
      .select()
      .from(organizationMembers)
      .where(eq(organizationMembers.userId, uid));

    const orgIds = userOrgs.map((org) => org.organizationId);

    if (orgIds.length === 0) {
      return [];
    }

    const orgs = await db
      .select()
      .from(organizations)
      .where(inArray(organizations.id, orgIds));

    return orgs;
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw new Error("Failed to fetch organizations");
  }
}

export async function createOrganization(data: {
  name: string;
  description?: string;
  icon?: string;
}) {
  try {
    const { uid, message, auth } = await authenticate();
    if (auth !== 200 || !uid) {
      throw new Error(message || "Unauthorized");
    }

    const [newOrg] = await db
      .insert(organizations)
      .values({
        id: crypto.randomUUID(),
        name: data.name,
        slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: data.description,
        logo: data.icon, // Map icon to logo field
        ownerId: uid,
        metadata: {}, // Initialize empty metadata
      })
      .returning();

    // Add the owner as a member with owner role
    await db.insert(organizationMembers).values({
      id: crypto.randomUUID(),
      organizationId: newOrg.id,
      userId: uid,
      role: "owner",
    });

    // Update user's organizationId
    await db
      .update(users)
      .set({ organizationId: newOrg.id })
      .where(eq(users.id, uid));

    return newOrg;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw new Error("Failed to create organization");
  }
}

export async function updateOrganization(
  id: string,
  data: {
    name?: string;
    description?: string;
    icon?: string;
  },
) {
  try {
    const session = await getServerSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Check if user is owner or admin
    const member = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, id),
          eq(organizationMembers.userId, session.user.id),
        ),
      )
      .limit(1);

    if (
      member.length === 0 ||
      (member[0].role !== "admin" && member[0].role !== "owner")
    ) {
      throw new Error("Unauthorized to update organization");
    }

    const [updatedOrg] = await db
      .update(organizations)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, id))
      .returning();

    return updatedOrg;
  } catch (error) {
    console.error("Error updating organization:", error);
    throw new Error("Failed to update organization");
  }
}

export async function deleteOrganization(id: string) {
  try {
    const session = await getServerSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Check if user is owner
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, id))
      .limit(1);

    if (org.length === 0) {
      throw new Error("Organization not found");
    }

    if (org[0].ownerId !== session.user.id) {
      throw new Error("Only the owner can delete the organization");
    }

    await db.delete(organizations).where(eq(organizations.id, id));

    return { success: true };
  } catch (error) {
    console.error("Error deleting organization:", error);
    throw new Error("Failed to delete organization");
  }
}

// Better Auth Organization API functions
export async function createOrganizationWithBetterAuth(data: {
  name: string;
  slug?: string;
  logo?: string;
  metadata?: Record<string, any>;
}) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const result = await auth.api.createOrganization({
      body: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        logo: data.logo,
        metadata: data.metadata,
        userId: session.user.id,
        keepCurrentActiveOrganization: false,
      },
      headers: await headers(),
    });

    return result;
  } catch (error) {
    console.error("Error creating organization with Better Auth:", error);
    throw new Error("Failed to create organization");
  }
}

export async function getOrganizationsWithBetterAuth() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const result = await auth.api.listOrganizations({
      headers: await headers(),
    });

    return result;
  } catch (error) {
    console.error("Error fetching organizations with Better Auth:", error);
    throw new Error("Failed to fetch organizations");
  }
}

export async function getActiveMember() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const result = await auth.api.getActiveMember({
      headers: await headers(),
    });

    return result;
  } catch (error) {
    console.error("Error getting active member:", error);
    throw new Error("Failed to get active member");
  }
}

export async function getActiveMemberRole() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const result = await auth.api.getActiveMemberRole({
      headers: await headers(),
    });

    return result;
  } catch (error) {
    console.error("Error getting active member role:", error);
    throw new Error("Failed to get active member role");
  }
}

export async function listMembers(organizationId: string) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const result = await auth.api.listMembers({
      query: {
        organizationId,
      },
      headers: await headers(),
    });

    return result;
  } catch (error) {
    console.error("Error listing members:", error);
    throw new Error("Failed to list members");
  }
}

export async function removeMemberFromOrganization(data: {
  memberIdOrEmail: string;
  organizationId: string;
}) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const result = await auth.api.removeMember({
      body: {
        memberIdOrEmail: data.memberIdOrEmail,
        organizationId: data.organizationId,
      },
      headers: await headers(),
    });

    return result;
  } catch (error) {
    console.error("Error removing member from organization:", error);
    throw new Error("Failed to remove member from organization");
  }
}

export async function updateMemberRole(data: {
  role: string[];
  memberId: string;
  organizationId: string;
}) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const result = await auth.api.updateMemberRole({
      body: {
        role: data.role,
        memberId: data.memberId,
        organizationId: data.organizationId,
      },
      headers: await headers(),
    });

    return result;
  } catch (error) {
    console.error("Error updating member role:", error);
    throw new Error("Failed to update member role");
  }
}

// Note: Better Auth provides these functions directly via auth.api
// No need for custom server-side implementations
// Use the client-side functions from auth-client.ts instead
