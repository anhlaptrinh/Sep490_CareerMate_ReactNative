import { Blog, BlogsApiResponse, BlogApiResponse, BlogQueryParams, BlogComment, BlogRatingRequest, BlogCommentRequest } from "../../domain/models/Blog";

/**
 * Blog Repository Interface
 * Defines all blog-related data operations
 */
export interface BlogRepo {
  /**
   * Get all published blogs with optional filters
   */
  getBlogs(params?: BlogQueryParams): Promise<BlogsApiResponse>;

  /**
   * Get a single blog by ID (increments view count)
   */
  getBlogById(blogId: number): Promise<BlogApiResponse>;

  /**
   * Get a single blog by slug
   */
  getBlogBySlug(slug: string): Promise<BlogApiResponse>;

  /**
   * Get related blogs based on category/tags
   */
  getRelatedBlogs(blogId: number, limit?: number): Promise<BlogsApiResponse>;

  /**
   * Get blogs by category
   */
  getBlogsByCategory(category: string, params?: BlogQueryParams): Promise<BlogsApiResponse>;

  /**
   * Get blogs by author
   */
  getBlogsByAuthor(authorId: number, params?: BlogQueryParams): Promise<BlogsApiResponse>;

  /**
   * Search blogs
   */
  searchBlogs(query: string, params?: BlogQueryParams): Promise<BlogsApiResponse>;

  /**
   * Rate a blog (requires authentication)
   */
  rateBlog(blogId: number, rating: BlogRatingRequest): Promise<void>;

  /**
   * Add comment to blog (requires authentication)
   */
  addComment(blogId: number, comment: BlogCommentRequest): Promise<BlogComment>;

  /**
   * Update comment (requires authentication)
   */
  updateComment(blogId: number, commentId: number, comment: BlogCommentRequest): Promise<BlogComment>;

  /**
   * Delete comment (requires authentication)
   */
  deleteComment(blogId: number, commentId: number): Promise<void>;
}
