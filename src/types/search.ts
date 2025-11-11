/**
 * Search-related types
 */

/**
 * Searchable newsletter item
 */
export interface SearchableNewsletter {
  newsletter: string;
  newsletterId: string;
  newsletterStatus: string;
  preview?: string;
  date?: string;
  campaignId: string;
}

/**
 * Search result generic type
 */
export interface SearchResult<T> {
  items: T[];
  total: number;
  query: string;
}
