import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/utils/auth";
import { db } from "@/db";
import { documents, organizationMembers } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const { uid, message, auth } = await authenticate();
    if (auth !== 200 || !uid) {
      return NextResponse.json(
        { error: message || "Unauthorized" },
        { status: auth },
      );
    }

    const [doc] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, params.id))
      .limit(1);

    if (!doc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    // Check if user is member of organization
    const member = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, doc.organizationId),
          eq(organizationMembers.userId, uid),
        ),
      )
      .limit(1);

    if (member.length === 0) {
      return NextResponse.json(
        { error: "Unauthorized to access this document" },
        { status: 403 },
      );
    }

    return NextResponse.json(doc);
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 },
    );
  }
};

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { uid, message, auth } = await authenticate();
    if (auth !== 200 || !uid) {
      return NextResponse.json(
        { error: message || "Unauthorized" },
        { status: auth },
      );
    }

    const body = await request.json();
    const { title, content, htmlContent, status, tags, template } = body;

    // Check if user is the author or has admin rights
    const [doc] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, params.id))
      .limit(1);

    if (!doc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    const isAuthor = doc.authorId === uid;

    if (!isAuthor) {
      const member = await db
        .select()
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organizationId, doc.organizationId),
            eq(organizationMembers.userId, uid),
          ),
        )
        .limit(1);

      if (member.length === 0 || member[0].role !== "admin") {
        return NextResponse.json(
          { error: "Unauthorized to update this document" },
          { status: 403 },
        );
      }
    }

    const [updatedDoc] = await db
      .update(documents)
      .set({
        title,
        content,
        htmlContent,
        status,
        tags,
        template,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, params.id))
      .returning();

    return NextResponse.json(updatedDoc);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { uid, message, auth } = await authenticate();
    if (auth !== 200 || !uid) {
      return NextResponse.json(
        { error: message || "Unauthorized" },
        { status: auth },
      );
    }

    // Check if user is the author or has admin rights
    const [doc] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, params.id))
      .limit(1);

    if (!doc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    const isAuthor = doc.authorId === uid;

    if (!isAuthor) {
      const member = await db
        .select()
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organizationId, doc.organizationId),
            eq(organizationMembers.userId, uid),
          ),
        )
        .limit(1);

      if (member.length === 0 || member[0].role !== "admin") {
        return NextResponse.json(
          { error: "Unauthorized to delete this document" },
          { status: 403 },
        );
      }
    }

    await db.delete(documents).where(eq(documents.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 },
    );
  }
}
