/**
 * Utility functions for working with organization metadata
 */

import { LegacyOrganization } from "@/types/organization";
import { OrganizationType } from "@/db/schema";
import type { OrganizationMetadata, ExtractedMetadata } from "@/types/metadata";

/**
 * Extract metadata fields from organization data
 */
export function extractMetadataFields(
  data: Record<string, unknown>,
): ExtractedMetadata {
  const metadata: OrganizationMetadata = {};
  const directFields: Record<string, unknown> = { ...data };

  // Extract fields that should be in metadata
  const metadataFields = [
    "media",
    "themes",
    "notes",
    "donors",
    "links",
    "groups",
  ];

  metadataFields.forEach((field) => {
    if (data[field] !== undefined) {
      // Type-safe assignment based on field name
      const key = field as keyof OrganizationMetadata;
      (metadata as Record<string, unknown>)[key] = data[field];
      delete directFields[field];
    }
  });

  return { metadata, directFields };
}

/**
 * Merge metadata with existing organization metadata
 */
export function mergeMetadata(
  existing: OrganizationMetadata = {},
  updates: OrganizationMetadata = {},
): OrganizationMetadata {
  return {
    ...existing,
    ...updates,
  };
}

/**
 * Get a specific field from organization metadata
 */
export function getMetadataField<T>(
  metadata: OrganizationMetadata | null | undefined,
  field: keyof OrganizationMetadata,
  defaultValue: T,
): T {
  if (!metadata) return defaultValue;
  return (metadata[field] as T) ?? defaultValue;
}

/**
 * Update a specific field in organization metadata
 */
export function updateMetadataField(
  metadata: OrganizationMetadata | null | undefined,
  field: keyof OrganizationMetadata,
  value: OrganizationMetadata[keyof OrganizationMetadata],
): OrganizationMetadata {
  return {
    ...metadata,
    [field]: value,
  };
}

/**
 * Convert old organization structure to new metadata structure
 */
export function migrateOrganizationToMetadata(
  org: LegacyOrganization,
): ExtractedMetadata {
  const metadata: OrganizationMetadata = {};
  const directFields: Record<string, unknown> = { ...org };

  // Move fields to metadata
  if (org.media) {
    metadata.media = org.media;
    delete directFields.media;
  }
  if (org.themes) {
    metadata.themes = org.themes;
    delete directFields.themes;
  }
  if (org.notes) {
    metadata.notes = org.notes;
    delete directFields.notes;
  }
  if (org.donors) {
    metadata.donors = org.donors;
    delete directFields.donors;
  }
  if (org.links) {
    metadata.links = org.links;
    delete directFields.links;
  }
  if (org.groups) {
    metadata.groups = org.groups;
    delete directFields.groups;
  }

  // Map icon to logo
  if (org.icon) {
    directFields.logo = org.icon;
    delete directFields.icon;
  }

  return { directFields, metadata };
}

/**
 * Convert new organization structure back to old format for compatibility
 */
export function convertMetadataToLegacy(org: OrganizationType) {
  const metadata = org.metadata || {};

  return {
    ...org,
    icon: org.logo, // Map logo back to icon
    media: metadata.media || [],
    themes: metadata.themes || [],
    notes: metadata.notes || [],
    donors: metadata.donors || [],
    links: metadata.links || [],
    groups: metadata.groups || [],
  };
}
