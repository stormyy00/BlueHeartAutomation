import { Organization } from "@/data/types";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/utils/auth";
import {
  getOrganizations,
  createOrganization,
} from "@/lib/actions/organizations";
import { db } from "@/db";
import { organizations, organizationMembers, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

type Mode = "join" | "create";

type Props = {
  org?: Organization;
  orgId?: string;
  mode: Mode;
};

export const GET = async (request: NextRequest) => {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userOrgs = await getOrganizations();

    if (!userOrgs || userOrgs.length === 0) {
      return NextResponse.json(
        { message: "You are not a part of an organization." },
        { status: 400 },
      );
    }

    // Return the first organization (user should only be in one)
    const org = userOrgs[0];
    return NextResponse.json({ message: org });
  } catch (err) {
    return NextResponse.json(
      { error: `Server Error: ${err}` },
      { status: 500 },
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      request.headers.get("Content-Type")?.toLowerCase() != "application/json"
    ) {
      return NextResponse.json(
        {
          error:
            "Please provide a group and whether you are joining or creating ('join' or 'create').",
        },
        { status: 400 },
      );
    }

    const data = (await request.json().catch(() => undefined)) as
      | Props
      | undefined;
    if (!data) {
      return NextResponse.json(
        {
          error:
            "Please provide a group and whether you are joining or creating ('join' or 'create').",
        },
        { status: 400 },
      );
    }

    if (data.mode === "create") {
      const result = await createOrganization({
        name: data.org!.name,
        description: data.org!.description,
        icon: data.org!.icon,
      });

      return NextResponse.json({
        message: "Organization created successfully.",
        organizationId: result.id,
      });
    }

    if (data.mode === "join") {
      if (!data.orgId) {
        return NextResponse.json(
          { error: "Organization ID is required to join." },
          { status: 400 },
        );
      }

      // Check if organization exists
      const [org] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, data.orgId));

      if (!org) {
        return NextResponse.json(
          { error: "Organization not found." },
          { status: 404 },
        );
      }

      // Check if user is already a member
      const [existingMembership] = await db
        .select()
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organizationId, data.orgId),
            eq(organizationMembers.userId, session.user.id),
          ),
        );

      if (existingMembership) {
        return NextResponse.json(
          { error: "You are already a member of this organization." },
          { status: 400 },
        );
      }

      // Add user as member
      await db.insert(organizationMembers).values({
        id: crypto.randomUUID(),
        organizationId: data.orgId,
        userId: session.user.id,
        role: "member",
        joinedAt: new Date(),
      });

      // Update user's organizationId
      await db
        .update(users)
        .set({ organizationId: data.orgId })
        .where(eq(users.id, session.user.id));

      return NextResponse.json({
        message: "Successfully joined the organization!",
        organizationId: data.orgId,
      });
    }

    return NextResponse.json(
      { error: "You did not provide a correct mode ('join' or 'create')." },
      { status: 400 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Server Error: ${err}` },
      { status: 500 },
    );
  }
};
