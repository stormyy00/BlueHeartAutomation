import { Organization } from "@/data/types";
import { NextRequest } from "next/server";
import { authenticate } from "@/utils/auth";
import { db } from "@/db";
import { organizations, organizationMembers } from "@/db/schema";
import { eq, and } from "drizzle-orm";

type Params = {
  params: {
    orgId: string;
  };
};

export const GET = async (request: NextRequest, { params }: Params) => {
  try {
    const { uid, message, auth } = await authenticate();
    if (auth !== 200 || !uid) {
      return Response.json(
        { error: message || "Unauthorized" },
        { status: auth },
      );
    }

    let dataRequested = true;
    if (
      request.nextUrl.searchParams.has("data") &&
      !JSON.parse(request.nextUrl.searchParams.get("data") as string)
    ) {
      dataRequested = false;
    }

    // Get organization from database
    console.log("Fetching organization from database for orgId:", params.orgId);
    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, params.orgId));

    if (!org) {
      return Response.json(
        { error: "This organization does not exist." },
        { status: 400 },
      );
    }

    // Check if user is a member of the organization
    const [membership] = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, params.orgId),
          eq(organizationMembers.userId, uid),
        ),
      );

    if (!membership) {
      return Response.json(
        { error: "You are not authorized to access this organization." },
        { status: 401 },
      );
    }

    return Response.json(
      { message: dataRequested ? org : org != undefined },
      { status: org != undefined ? 200 : 400 },
    );
  } catch (err) {
    return Response.json({ error: `Server Error: ${err}` }, { status: 500 });
  }
};

type Props = Partial<Organization>;

const updateOrganization = <K extends keyof Organization>(
  org: Organization,
  key: K,
  value: Organization[K],
) => {
  org[key] = value; // no cast needed here
};

export const POST = async (request: NextRequest, { params }: Params) => {
  try {
    const { uid, user, message, auth } = await authenticate();
    if (auth !== 200 || !uid) {
      return Response.json(
        { error: message || "Unauthorized" },
        { status: auth },
      );
    }

    // Check if user is a member of the organization
    const [membership] = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, params.orgId),
          eq(organizationMembers.userId, uid),
        ),
      );

    if (!membership) {
      return Response.json(
        { error: "You are not authorized to update this organization." },
        { status: 401 },
      );
    }

    const data = (await request.json().catch(() => undefined)) as
      | Props
      | undefined;
    if (!data) {
      return Response.json(
        { error: "Please provide updated group data." },
        { status: 400 },
      );
    }

    // Update organization in database
    const [updatedOrg] = await db
      .update(organizations)
      .set({
        name: data.name,
        description: data.description,
        logo: data.icon, // Map icon to logo field
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, params.orgId))
      .returning();

    if (!updatedOrg) {
      return Response.json(
        { error: "Unable to update organization" },
        { status: 400 },
      );
    }

    return Response.json({ message: "Organization updated." }, { status: 200 });
  } catch (err) {
    return Response.json({ error: `Server Error: ${err}` }, { status: 500 });
  }
};
