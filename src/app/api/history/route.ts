import { NextResponse } from "next/server";
import { authenticate } from "@/utils/auth";
import { db } from "@/db";
import { documents, organizationMembers, type DocumentType } from "@/db/schema";
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get documents for the organization
    const orgDocuments = await db
      .select()
      .from(documents)
      .where(eq(documents.organizationId, membership.organizationId));

    // Filter for published documents (equivalent to "sent" status)
    const newsletters = orgDocuments
      .filter((doc: DocumentType) => doc.status === "published")
      .map((doc: DocumentType) => {
        return {
          newsletter: doc.content,
          newsletterId: doc.id,
          newsletterStatus: doc.status,
          newsletterSentDate: doc.publishedAt,
        };
      });

    return NextResponse.json({ newsletters });
  } catch (err) {
    return NextResponse.json(
      { error: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};
