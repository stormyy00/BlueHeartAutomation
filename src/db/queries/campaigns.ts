"use server";
import { authenticate } from "@/utils/auth";
import { campaigns, documents } from "../schema";
import { db } from "..";
import { eq, and, count } from "drizzle-orm";

export const createCampaignQuery = async (
  title: string,
  description: string,
) => {
  const { uid, auth, message, orgId } = await authenticate();

  if (!uid || !auth || !orgId) {
    return { success: false, message: message || "Authentication failed" };
  }
  await db.insert(campaigns).values({
    id: crypto.randomUUID(),
    title,
    description,
    organizationId: orgId,
    createdBy: uid,
  });

  return { success: true, message: "Campaign created successfully" };
};

export const updateCampaignQuery = async (
  campaignId: string,
  title: string,
  description: string,
) => {
  const { uid, auth, message, orgId } = await authenticate();
  if (!uid || !auth || !orgId) {
    return { success: false, message: message || "Authentication failed" };
  }
  await db
    .update(campaigns)
    .set({ title, description })
    .where(
      and(eq(campaigns.id, campaignId), eq(campaigns.organizationId, orgId)),
    );
  return { success: true, message: "Campaign updated successfully" };
};

export const deleteCampaignQuery = async (campaignId: string) => {
  const { uid, auth, message, orgId } = await authenticate();
  if (!uid || !auth || !orgId) {
    return { success: false, message: message || "Authentication failed" };
  }
  await db
    .delete(campaigns)
    .where(
      and(eq(campaigns.id, campaignId), eq(campaigns.organizationId, orgId)),
    );
  return { success: true, message: "Campaign deleted successfully" };
};

export const getCampaignById = async (campaignId: string) => {
  const { orgId } = await authenticate();
  if (!orgId) {
    return { success: false, message: "Authentication failed" };
  }

  const rows = await db
    .select({
      campaignId: campaigns.id,
      title: campaigns.title,
      description: campaigns.description,
      status: campaigns.status,
      createdAt: campaigns.createdAt,
      updatedAt: campaigns.updatedAt,
      documentId: documents.id,
      documentTitle: documents.title,
      documentStatus: documents.status,
      documentCreatedAt: documents.createdAt,
    })
    .from(campaigns)
    .leftJoin(documents, eq(campaigns.id, documents.campaignId))
    .where(
      and(eq(campaigns.organizationId, orgId), eq(campaigns.id, campaignId)),
    );

  if (rows.length === 0) return null;

  const campaign = {
    id: rows[0].campaignId,
    title: rows[0].title,
    description: rows[0].description,
    status: rows[0].status,
    createdAt: rows[0].createdAt,
    updatedAt: rows[0].updatedAt,
    documents: rows
      .filter((r) => r.documentId)
      .map((r) => ({
        id: r.documentId,
        title: r.documentTitle,
        status: r.documentStatus,
        createdAt: r.documentCreatedAt,
      })),
  };

  return campaign;
};

export const getCampaignsbyOrg = async () => {
  const { orgId } = await authenticate();
  if (!orgId) {
    return { success: false, message: "Authentication failed" };
  }

  const campaignsList = await db
    .select({
      id: campaigns.id,
      title: campaigns.title,
      description: campaigns.description,
      status: campaigns.status,
      createdAt: campaigns.createdAt,
      updatedAt: campaigns.updatedAt,
      documentCount: count(documents.id).as("documentCount"),
    })
    .from(campaigns)
    .leftJoin(documents, eq(campaigns.id, documents.campaignId))
    .where(eq(campaigns.organizationId, orgId))
    .groupBy(
      campaigns.id,
      campaigns.title,
      campaigns.description,
      campaigns.status,
      campaigns.createdAt,
      campaigns.updatedAt,
    );

  return campaignsList;
};

export const updateDocumentCampaignIdQuery = async (
  documentId: string,
  campaignId: string | null,
) => {
  const { uid, auth, message, orgId } = await authenticate();
  if (!uid || !auth || !orgId) {
    return { success: false, message: message || "Authentication failed" };
  }
  await db
    .update(documents)
    .set({ campaignId })
    .where(
      and(eq(documents.id, documentId), eq(documents.organizationId, orgId)),
    );
  return { success: true, message: "Document campaign updated successfully" };
};
