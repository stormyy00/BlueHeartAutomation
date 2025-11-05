"use server";

import { db } from "@/db";
import { documents, organizationMembers } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getServerSession } from "@/utils/auth";

export async function getDocuments(organizationId: string) {
  try {
    const session = await getServerSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Check if user is member of organization
    const member = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.userId, session.user.id),
        ),
      )
      .limit(1);

    if (member.length === 0) {
      throw new Error("Unauthorized to access organization documents");
    }

    const docs = await db
      .select()
      .from(documents)
      .where(eq(documents.organizationId, organizationId))
      .orderBy(desc(documents.createdAt));

    return docs;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw new Error("Failed to fetch documents");
  }
}

export async function createDocument(data: {
  title: string;
  content: string;
  htmlContent?: string;
  organizationId: string;
  status?: "draft" | "published" | "archived";
  tags?: string[];
  template?: string;
}) {
  try {
    const session = await getServerSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Check if user is member of organization
    const member = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, data.organizationId),
          eq(organizationMembers.userId, session.user.id),
        ),
      )
      .limit(1);

    if (member.length === 0) {
      throw new Error("Unauthorized to create documents in this organization");
    }

    const [newDoc] = await db
      .insert(documents)
      .values({
        id: crypto.randomUUID(),
        title: data.title,
        content: data.content,
        htmlContent: data.htmlContent,
        authorId: session.user.id,
        organizationId: data.organizationId,
        status: data.status || "draft",
        tags: data.tags || [],
        template: data.template || "default",
      })
      .returning();

    return newDoc;
  } catch (error) {
    console.error("Error creating document:", error);
    throw new Error("Failed to create document");
  }
}

export async function updateDocument(
  id: string,
  data: {
    title?: string;
    content?: string;
    htmlContent?: string;
    status?: "draft" | "published" | "archived";
    tags?: string[];
    template?: string;
  },
) {
  try {
    const session = await getServerSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Check if user is the author or has admin rights
    const doc = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);

    if (doc.length === 0) {
      throw new Error("Document not found");
    }

    // Check if user is author or admin
    const isAuthor = doc[0].authorId === session.user.id;

    if (!isAuthor) {
      const member = await db
        .select()
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organizationId, doc[0].organizationId),
            eq(organizationMembers.userId, session.user.id),
          ),
        )
        .limit(1);

      if (member.length === 0 || member[0].role !== "admin") {
        throw new Error("Unauthorized to update this document");
      }
    }

    const [updatedDoc] = await db
      .update(documents)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, id))
      .returning();

    return updatedDoc;
  } catch (error) {
    console.error("Error updating document:", error);
    throw new Error("Failed to update document");
  }
}

export async function deleteDocument(id: string) {
  try {
    const session = await getServerSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Check if user is the author or has admin rights
    const doc = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);

    if (doc.length === 0) {
      throw new Error("Document not found");
    }

    const isAuthor = doc[0].authorId === session.user.id;

    if (!isAuthor) {
      const member = await db
        .select()
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organizationId, doc[0].organizationId),
            eq(organizationMembers.userId, session.user.id),
          ),
        )
        .limit(1);

      if (member.length === 0 || member[0].role !== "admin") {
        throw new Error("Unauthorized to delete this document");
      }
    }

    await db.delete(documents).where(eq(documents.id, id));

    return { success: true };
  } catch (error) {
    console.error("Error deleting document:", error);
    throw new Error("Failed to delete document");
  }
}
