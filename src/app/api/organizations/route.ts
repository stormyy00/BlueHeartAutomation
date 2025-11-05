import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/utils/auth";
import { db } from "@/db";
import { organizationMembers, organizations } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      .where(eq(organizationMembers.userId, session.user.id))
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
