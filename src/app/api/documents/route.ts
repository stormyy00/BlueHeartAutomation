import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/utils/auth";
import { db } from "@/db";
import { documents, organizationMembers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

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
        { error: "You are not a part of an organization" },
        { status: 400 },
      );
    }

    const docs = await db
      .select()
      .from(documents)
      .where(eq(documents.organizationId, membership.organizationId))
      .orderBy(desc(documents.createdAt));

    return NextResponse.json(docs);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 },
    );
  }
};

export const POST = async (request: NextRequest) => {
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
        { error: "You are not a part of an organization" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const {
      title,
      content,
      htmlContent,
      status = "draft",
      tags = [],
      template = "default",
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      );
    }

    const [newDoc] = await db
      .insert(documents)
      .values({
        id: crypto.randomUUID(),
        title,
        content,
        htmlContent,
        authorId: uid,
        organizationId: membership.organizationId,
        status,
        tags,
        template,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 },
    );
  }
};
