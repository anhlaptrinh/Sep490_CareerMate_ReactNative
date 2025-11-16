/**
 * Blog Domain Models
 * Based on backend API response structure
 */

export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type BlogCategory = "TECHNOLOGY" | "HR" | "IT_MARKET" | "CAREER" | "TUTORIAL" | "NEWS" | "BUSINESS";

/**
 * Blog entity from API
 */
export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnailUrl: string;
  category: BlogCategory;
  tags: string[];
  status: BlogStatus;
  viewCount: number;
  readingTimeMinutes: number;
  averageRating: number;
  ratingCount: number;
  commentCount: number;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
}

/**
 * Paginated Blog Response - matches your project's API pattern
 */
export interface BlogsApiResponse {
  code: number;
  message: string;
  result: {
    content: Blog[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
  };
}

/**
 * Single Blog Response - matches your project's API pattern
 */
export interface BlogApiResponse {
  code: number;
  message: string;
  result: Blog;
}

/**
 * Blog Query Parameters
 */
export interface BlogQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
  category?: BlogCategory;
  tags?: string[];
  status?: BlogStatus;
}

/**
 * Blog Comment
 */
export interface BlogComment {
  id: number;
  blogId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Blog Rating Request
 */
export interface BlogRatingRequest {
  rating: number; // 1-5
}

/**
 * Blog Comment Request
 */
export interface BlogCommentRequest {
  content: string;
}

/**
 * Create/Update Blog Request (Admin only)
 */
export interface BlogRequest {
  title: string;
  content: string;
  excerpt: string;
  thumbnailUrl: string;
  category: BlogCategory;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
}
