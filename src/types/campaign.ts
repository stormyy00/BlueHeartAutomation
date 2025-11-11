/**
 * Campaign types
 */

/**
 * Base campaign from database
 */
export interface Campaign {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Campaign with newsletter/document count for list views
 */
export interface CampaignWithCount extends Campaign {
  documentCount?: number;
  newsletters?: number;
}

/**
 * Campaign with full document details
 */
export interface CampaignWithDocuments extends Campaign {
  updatedAt: string;
  documents: {
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }[];
}

/**
 * Campaign status colors mapping
 */
export const CAMPAIGN_STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  draft: "bg-yellow-100 text-yellow-800",
  completed: "bg-gray-100 text-gray-800",
};
