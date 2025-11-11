/**
 * API response and request types
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

/**
 * API error response
 */
export interface ApiError {
  error: string;
  message?: string;
  status: number;
}

/**
 * Pagination params
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  uid?: string;
  message?: string;
  orgId?: string;
  auth: number;
}
