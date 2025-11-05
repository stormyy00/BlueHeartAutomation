"use server";

import {
  createCampaignQuery,
  deleteCampaignQuery,
  updateCampaignQuery,
  updateDocumentCampaignIdQuery,
} from "@/db/queries/campaigns";
import { authenticate } from "@/utils/auth";

export const createCampaignAction = async (
  title: string,
  description: string,
) => {
  return createCampaignQuery(title, description);
};

export const updateCampaignAction = async (
  campaignId: string,
  title: string,
  description: string,
) => {
  return updateCampaignQuery(campaignId, title, description);
};

export const deleteCampaignAction = async (campaignId: string) => {
  return deleteCampaignQuery(campaignId);
};

export const updateDocumentCampaignId = async (
  documentId: string,
  campaignId: string | null,
) => {
  return updateDocumentCampaignIdQuery(documentId, campaignId);
};
