/**
 * Newsletter email data
 */
export interface NewsletterType {
  to: string;
  subject: string;
  preview: string;
  body: string;
}

/**
 * Newsletter document from database
 */
export interface Newsletter {
  id: string;
  header: string;
  html: string;
  scheduled: number; // epoch date
  media: string[];
  recipients: string[];
}
