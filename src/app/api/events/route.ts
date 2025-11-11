import { NextResponse } from "next/server";
import { authenticate } from "@/utils/auth";
import { db } from "@/db";
import { organizations, organizationMembers } from "@/db/schema";
import { eq } from "drizzle-orm";

export const GET = async () => {
  try {
    const { uid, message, auth } = await authenticate();
    if (auth !== 200 || !uid) {
      return NextResponse.json(
        { error: message || "Unauthorized" },
        { status: auth },
      );
    }

    // Get user's organization
    const [membership] = await db
      .select()
      .from(organizationMembers)
      .where(eq(organizationMembers.userId, uid));

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a part of an organization." },
        { status: 400 },
      );
    }

    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, membership.organizationId));

    if (!org) {
      return Response.json(
        { error: "Organization not found." },
        { status: 404 },
      );
    }

    if (!org.calendarId) {
      return Response.json(
        { error: "Google Calendar CalendarId not setup." },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "OK", calendarId: org.calendarId });
  } catch (err) {
    return NextResponse.json(
      { error: `Server Error: ${err}` },
      { status: 500 },
    );
  }
};
