/**
 * Utility functions for handling organization names and slugs in URLs
 * Uses organization IDs as the source of truth while providing user-friendly URLs
 */

/**
 * Convert organization name to URL slug
 * @param name - Organization name
 * @returns URL-safe slug
 */
export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Convert URL slug back to organization name
 * @param slug - URL slug
 * @returns Organization name
 */
export function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Find organization by slug from a list of organizations
 * @param organizations - Array of organizations
 * @param slug - URL slug
 * @returns Organization or undefined
 */
export function findOrganizationBySlug(
  organizations: Array<{ id: string; name: string }>,
  slug: string,
) {
  return organizations.find((org) => nameToSlug(org.name) === slug);
}

/**
 * Get organization slug from ID
 * @param organizations - Array of organizations
 * @param id - Organization ID
 * @returns URL slug or undefined
 */
export function getSlugFromId(
  organizations: Array<{ id: string; name: string }>,
  id: string,
) {
  const org = organizations.find((org) => org.id === id);
  return org ? nameToSlug(org.name) : undefined;
}

/**
 * Resolve organization ID from slug using sessionStorage and fallback
 * @param organizations - Array of organizations
 * @param slug - URL slug
 * @returns Organization or undefined
 */
export function resolveOrganizationFromSlug(
  organizations: Array<{ id: string; name: string }>,
  slug: string,
) {
  console.log("Resolving organization from slug:", slug);
  console.log("Available organizations:", organizations);

  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    console.log("Not in browser environment, using fallback");
    // Fallback: try to find by slug (for direct URL access)
    const org = findOrganizationBySlug(organizations, slug);
    console.log("Found organization by slug:", org);
    return org;
  }

  // First try to get the ID from sessionStorage (set by organization selector/switcher)
  const orgId = sessionStorage.getItem(`org-slug-${slug}`);
  console.log("SessionStorage orgId for slug:", orgId);

  if (orgId) {
    const org = organizations.find((o) => o.id === orgId);
    console.log("Found organization by ID:", org);
    if (org) {
      return org;
    }
  }

  // Fallback: try to find by slug (for direct URL access)
  const org = findOrganizationBySlug(organizations, slug);
  console.log("Found organization by slug:", org);
  if (org) {
    // Store the mapping for future use
    sessionStorage.setItem(`org-slug-${slug}`, org.id);
    return org;
  }

  console.log("No organization found for slug:", slug);
  return undefined;
}

/**
 * Store organization mapping in sessionStorage
 * @param org - Organization object
 */
export function storeOrganizationMapping(org: { id: string; name: string }) {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    console.log("Not in browser environment, cannot store mapping");
    return;
  }

  const slug = nameToSlug(org.name);
  console.log("Storing organization mapping:", { slug, orgId: org.id });
  sessionStorage.setItem(`org-slug-${slug}`, org.id);
}
