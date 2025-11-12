import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/utils/auth";
import { db } from "@/db";
import { organizationMembers, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const GET = async (
  request: NextRequest,
  { params }: { params: { orgId: string } },
) => {
  try {
    const { uid, message, auth } = await authenticate();
    if (auth !== 200 || !uid) {
      return NextResponse.json(
        { error: message || "Unauthorized" },
        { status: auth },
      );
    }
    const { orgId } = params;

    // Check if user is a member of this organization
    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, orgId),
          eq(organizationMembers.userId, uid),
        ),
      )
      .limit(1);

    if (!membership.length) {
      return NextResponse.json(
        { error: "You are not a member of this organization" },
        { status: 403 },
      );
    }

    // Get all members of the organization
    const members = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        role: organizationMembers.role,
        joinedAt: organizationMembers.joinedAt,
      })
      .from(organizationMembers)
      .innerJoin(users, eq(organizationMembers.userId, users.id))
      .where(eq(organizationMembers.organizationId, orgId))
      .orderBy(organizationMembers.joinedAt);

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching organization members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 },
    );
  }
};
