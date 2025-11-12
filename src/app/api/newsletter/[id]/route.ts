import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/utils/auth";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { uid, message, orgId, auth } = await authenticate();
  if (auth !== 200 || !uid) {
    return Response.json(
      { error: message || "Unauthorized" },
      { status: auth },
    );
  }

  console.log("Fetching newsletter with ID:", params.id);

  try {
    const results = await db
      .select()
      .from(documents)
      .where(
        and(
          eq(documents.id, params.id),
          eq(documents.organizationId, orgId as string),
        ),
      );

    const document = results?.[0];

    if (!document) {
      return NextResponse.json(
        { error: "Document not found." },
        { status: 404 },
      );
    }

    // Map DB fields to the shape expected by the client
    // subject -> title, scheduledDate -> scheduledAt, recipientGroup -> (not modeled yet)
    const payload = {
      newsletterData: {
        content: document.content,
        status: document.status,
        scheduledDate: document.scheduledAt
          ? new Date(document.scheduledAt).toISOString()
          : null,
        recipientGroup: "",
        subject: document.title ?? "",
      },
      template: document.template ?? "",
      campaignId: document.campaignId ?? null,
    };

    return NextResponse.json(payload);
  } catch (err) {
    return NextResponse.json(
      { error: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { uid, message, orgId, auth } = await authenticate();
  if (auth !== 200 || !uid || !orgId) {
    return Response.json(
      { error: message || "Unauthorized" },
      { status: auth },
    );
  }

  try {
    const { document, title } = await req.json();

    // Normalize content to a string since DB column is text
    const contentToSave = (() => {
      if (!document) return "";
      if (typeof document === "string") return document;
      if (typeof document.content === "string") return document.content;
      if (document.content) return JSON.stringify(document.content);
      return JSON.stringify(document);
    })();

    try {
      // Try to get existing document first
      const [existingDocument] = await db
        .select()
        .from(documents)
        .where(
          and(
            eq(documents.id, params.id),
            eq(documents.organizationId, orgId as string),
          ),
        );

      if (existingDocument) {
        // Update existing document
        await db
          .update(documents)
          .set({
            content: contentToSave,
            title: title || document.title || existingDocument.title,
            htmlContent: document.htmlContent,
            metadata: document.metadata || existingDocument.metadata,
            updatedAt: new Date(),
          })
          .where(eq(documents.id, params.id));
      } else {
        // Create new document
        await db.insert(documents).values({
          id: params.id,
          title: title || document.title || "New Document",
          content: contentToSave,
          organizationId: orgId as string,
          authorId: uid,
          status: "draft",
          tags: document.tags || [],
          recipients: document.recipients || [],
          template: document.template || "default",
          metadata: document.metadata || {},
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      return Response.json(
        { error: `Failed to save document: ${error}` },
        { status: 500 },
      );
    }

    return Response.json({ status: 200 });
  } catch (err) {
    return Response.json(
      { error: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};
