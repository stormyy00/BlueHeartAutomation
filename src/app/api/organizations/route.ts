import { NextResponse } from "next/server";
import { authenticate } from "@/utils/auth";
import { db } from "@/db";
import { organizationMembers, organizations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { uid, auth, message } = await authenticate();

    if (!uid || auth !== 200) {
      return NextResponse.json(
        { error: message || "Unauthorized" },
        { status: 401 },
      );
    }

    // Get all organizations where the user is a member
    const userOrganizations = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        description: organizations.description,
        role: organizationMembers.role,
        joinedAt: organizationMembers.joinedAt,
      })
      .from(organizationMembers)
      .innerJoin(
        organizations,
        eq(organizationMembers.organizationId, organizations.id),
      )
      .where(eq(organizationMembers.userId, uid))
      .orderBy(organizationMembers.joinedAt);

    return NextResponse.json(userOrganizations);
  } catch (error) {
    console.error("Error fetching user organizations:", error);
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 },
    );
  }
}
