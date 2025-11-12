import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/utils/auth";
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from "@/lib/actions/documents";
import type { DocumentContentNode } from "@/types/document";

export const GET = async () => {
  try {
    const { uid, message, orgId, auth } = await authenticate();
    if (auth !== 200 || !uid || !orgId) {
      return NextResponse.json(
        { error: message || "Unauthorized" },
        { status: auth },
      );
    }

    const documents = await getDocuments(orgId);
    const toPlainText = (value: unknown): string => {
      if (!value) return "";
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed === "" || trimmed === " ") return "";
        try {
          const parsed = JSON.parse(value);
          return toPlainText(parsed);
        } catch {
          return value;
        }
      }

      if (Array.isArray(value)) {
        return value.map((child) => toPlainText(child)).join(" ");
      }

      if (typeof value === "object" && value !== null) {
        const node = value as DocumentContentNode;
        if (node.type === "text" && typeof node.text === "string")
          return node.text;
        if (node.type === "doc" && Array.isArray(node.content)) {
          return node.content.map((child) => toPlainText(child)).join(" ");
        }
        if (Array.isArray(node.content)) {
          return node.content.map((child) => toPlainText(child)).join(" ");
        }
        // Handle objects with numeric keys (like {0: node1, 1: node2})
        if (Object.keys(node).every((key) => !isNaN(Number(key)))) {
          const values = Object.values(node);
          return values.map((child) => toPlainText(child)).join(" ");
        }
      }
      return "";
    };

    const preview = (content: unknown, limit = 20): string => {
      const text = toPlainText(content).replace(/\s+/g, " ").trim();
      if (!text) return "Untitled";
      const words = text.split(" ");
      return words.length > limit
        ? words.slice(0, limit).join(" ") + "…"
        : text;
    };

    const newsletters = documents.map(
      (doc: {
        id: string;
        title: string | null;
        status: string;
        content: unknown;
        campaignId?: string | null;
      }) => {
        const content = doc?.content;
        const title = doc.title?.trim() || "Untitled";
        const contentPreview = preview(content);

        return {
          newsletter: title,
          newsletterId: doc.id,
          newsletterStatus: doc.status,
          preview:
            contentPreview !== "Untitled" ? contentPreview : "No content yet",
          campaignId: doc.campaignId,
        };
      },
    );
    return NextResponse.json({ newsletters });
  } catch (err) {
    return NextResponse.json(
      { error: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};

export const POST = async () => {
  try {
    const { uid, message, orgId, auth } = await authenticate();
    if (auth !== 200 || !uid || !orgId) {
      return NextResponse.json(
        { error: message || "Unauthorized" },
        { status: auth },
      );
    }

    const result = await createDocument({
      title: "New Document",
      content: " ",
      organizationId: orgId,
      status: "draft",
      tags: [],
      template: "default",
    });

    return NextResponse.json({ newsletterId: result.id });
  } catch (err) {
    return NextResponse.json(
      { error: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { uid, message, auth } = await authenticate();
    if (auth !== 200 || !uid) {
      return NextResponse.json(
        { error: message || "Unauthorized" },
        { status: auth },
      );
    }

    const { newsletterId } = await req.json();
    const deletePromises = newsletterId.map((id: string) => deleteDocument(id));
    await Promise.all(deletePromises);

    return NextResponse.json({ status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const { uid, message, auth } = await authenticate();
    if (auth !== 200 || !uid) {
      return NextResponse.json(
        { error: message || "Unauthorized" },
        { status: auth },
      );
    }

    const { newsletterIds, newStatus } = await req.json();
    const updatePromises = newsletterIds.map((id: string) =>
      updateDocument(id, { status: newStatus }),
    );
    await Promise.all(updatePromises);

    return NextResponse.json({ status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};
