export interface SearchableNewsletter {
  newsletter: string;
  newsletterId: string;
  newsletterStatus: string;
  newsletterSentDate?: Date | string;
  preview?: string;
  date?: string;
  campaignId: string;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  query: string;
}
