/**
 * Document types for newsletters and content
 */

/**
 * Document content node structure (TipTap/ProseMirror format)
 */
export interface DocumentContentNode {
  type?: string;
  content?: DocumentContentNode[] | unknown;
  text?: string;
  attrs?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Document from database (matches schema)
 */
export interface Document {
  id: string;
  title: string;
  content: string;
  htmlContent: string | null;
  authorId: string;
  organizationId: string;
  campaignId: string | null;
  status: string;
  scheduledAt: Date | null;
  publishedAt: Date | null;
  archivedAt: Date | null;
  tags: string[];
  recipients: string[];
  template: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Newsletter list item (formatted for display)
 */
export interface NewsletterListItem {
  newsletter: string;
  newsletterId: string;
  newsletterStatus: string;
  preview?: string;
  newsletterSentDate?: Date | null;
}
