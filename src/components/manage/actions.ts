"use server";
import { db } from "@/db";
import { organizationMembers, users } from "@/db/schema";
import { eq } from "drizzle-orm";

type Member = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  joinedAt: Date;
};

export const getUsersbyOrgId = async (
  orgId: string | string[],
): Promise<Member[]> => {
  try {
    // Get organization members from database
    const members = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: organizationMembers.role,
        joinedAt: organizationMembers.joinedAt,
      })
      .from(organizationMembers)
      .innerJoin(users, eq(organizationMembers.userId, users.id))
      .where(eq(organizationMembers.organizationId, orgId as string));
    console.log("Fetched members from DB:", members);
    return members;
  } catch (err) {
    throw new Error(`Internal Server Error: ${err}`);
  }
};
