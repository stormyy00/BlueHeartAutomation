/**
 * Image and media types
 */

/**
 * Image data interface
 */
export interface ImageData {
  id: string;
  url: string;
  name?: string;
  size?: number;
  type?: string;
  uploadedAt?: Date;
  organizationId?: string;
  userId?: string;
}

/**
 * Image upload result
 */
export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  id?: string;
}

/**
 * Image filter options
 */
export interface ImageFilterOptions {
  type?: string;
  dateFrom?: Date;
  dateTo?: Date;
  uploadedBy?: string;
}
