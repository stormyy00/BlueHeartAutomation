import { LegacyOrganization as Organization } from "@/types/organization";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  convertMetadataToLegacy,
  migrateOrganizationToMetadata,
} from "@/utils/organization-metadata";
import { auth, authenticate } from "../auth";
import { RecipientGroup } from "@/types/metadata";

export const getOrg = async (
  uuid: string,
): Promise<Organization | undefined> => {
  if (uuid === "demo") {
    return { name: "demo" } as unknown as Organization;
  }

  try {
    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, uuid));

    if (!org) return undefined;

    // Convert database org to Organization type using legacy format
    const legacyOrg = convertMetadataToLegacy(org);
    return {
      id: legacyOrg.id,
      name: legacyOrg.name,
      description: legacyOrg.description || "",
      owner: legacyOrg.ownerId,
      icon: legacyOrg.icon || "",
      media: legacyOrg.media || [],
      newsletters: legacyOrg.documents || [],
      themes: legacyOrg.themes || [],
      notes: legacyOrg.notes || [],
      users: legacyOrg.users || [],
      donors: legacyOrg.donors || [],
      links: legacyOrg.links || [],
      region: (legacyOrg.region as "US") || "US",
      groups: legacyOrg.groups || [],
      calendarId: legacyOrg.calendarId || "",
    } as Organization;
  } catch (error) {
    console.error("Error getting organization:", error);
    return undefined;
  }
};

export const createOrg = async (org: Organization) => {
  try {
    if (await getOrg(org.id)) return false;

    // Convert legacy organization to new schema structure
    const { metadata } = migrateOrganizationToMetadata(org);

    await db.insert(organizations).values({
      id: org.id,
      name: org.name,
      slug: org.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: org.description,
      ownerId: org.owner,
      logo: org.icon, // Map icon to logo
      documents: org.newsletters,
      users: org.users,
      region: org.region,
      calendarId: org.calendarId,
      metadata: metadata,
    });
    return true;
  } catch (error) {
    console.error("Error creating organization:", error);
    return false;
  }
};

export const updateOrg = async (org: Organization) => {
  try {
    if (!(await getOrg(org.id))) return false;
    await db
      .update(organizations)
      .set({
        name: org.name,
        description: org.description,
        calendarId: org.calendarId,
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, org.id));
    return true;
  } catch (error) {
    console.error("Error updating organization:", error);
    return false;
  }
};

export const getOrgGroups = async (orgId: string) => {
  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, orgId))
    .limit(1);

  if (!org) {
    return { error: "Organization not found" };
  }

  const groups = (org.metadata as { groups?: RecipientGroup[] })?.groups || [];

  return groups;
};
