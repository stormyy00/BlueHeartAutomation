/**
 * Organization metadata types
 */

export interface OrganizationLink {
  name: string;
  url: string;
}

export interface RecipientGroup {
  name: string;
  emails: string[];
}

export interface OrganizationMetadata {
  media?: string[];
  themes?: string[];
  notes?: string[];
  donors?: string[];
  links?: OrganizationLink[];
  groups?: RecipientGroup[];
}

/**
 * Extract metadata fields from organization data
 */
export interface ExtractedMetadata {
  metadata: OrganizationMetadata;
  directFields: Record<string, unknown>;
}
