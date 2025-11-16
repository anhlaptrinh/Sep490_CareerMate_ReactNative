import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";
import { ApiClient } from "../apis/apiClient";
import { BlogRepo } from "./BlogRepo";
import {
  Blog,
  BlogsApiResponse,
  BlogApiResponse,
  BlogQueryParams,
  BlogComment,
  BlogRatingRequest,
  BlogCommentRequest,
} from "../../domain/models/Blog";

/**
 * Blog Repository Implementation
 * Handles all blog-related API calls
 */
@injectable()
export class BlogRepoImpl implements BlogRepo {
  private apiClient: ApiClient;

  constructor(@inject(TYPES.ApiClient) apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Build query string from params
   */
  private buildQueryString(params?: BlogQueryParams): string {
    if (!params) return "";

    const queryParts: string[] = [];

    if (params.page !== undefined) queryParts.push(`page=${params.page}`);
    if (params.size !== undefined) queryParts.push(`size=${params.size}`);
    if (params.sort) queryParts.push(`sort=${params.sort}`);
    if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
    if (params.category) queryParts.push(`category=${params.category}`);
    if (params.status) queryParts.push(`status=${params.status}`);
    if (params.tags && params.tags.length > 0) {
      params.tags.forEach((tag) => queryParts.push(`tags=${encodeURIComponent(tag)}`));
    }

    return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  }

  async getBlogs(params?: BlogQueryParams): Promise<BlogsApiResponse> {
    const queryString = this.buildQueryString(params);
    const url = `/blogs${queryString}`;
    console.log(`🌐 BlogRepo - Fetching: ${url}`);
    return await this.apiClient.get<BlogsApiResponse>(url);
  }

  async getBlogById(blogId: number): Promise<BlogApiResponse> {
    const url = `/blogs/${blogId}`;
    console.log(`🌐 BlogRepo - Fetching: ${url}`);
    return await this.apiClient.get<BlogApiResponse>(url);
  }

  async getBlogBySlug(slug: string): Promise<BlogApiResponse> {
    const url = `/blogs/slug/${slug}`;
    console.log(`🌐 BlogRepo - Fetching: ${url}`);
    return await this.apiClient.get<BlogApiResponse>(url);
  }

  async getRelatedBlogs(blogId: number, limit: number = 5): Promise<BlogsApiResponse> {
    const url = `/blogs/${blogId}/related?limit=${limit}`;
    console.log(`🌐 BlogRepo - Fetching: ${url}`);
    return await this.apiClient.get<BlogsApiResponse>(url);
  }

  async getBlogsByCategory(category: string, params?: BlogQueryParams): Promise<BlogsApiResponse> {
    const queryString = this.buildQueryString(params);
    const url = `/blogs/category/${category}${queryString}`;
    console.log(`🌐 BlogRepo - Fetching: ${url}`);
    return await this.apiClient.get<BlogsApiResponse>(url);
  }

  async getBlogsByAuthor(authorId: number, params?: BlogQueryParams): Promise<BlogsApiResponse> {
    const queryString = this.buildQueryString(params);
    const url = `/blogs/author/${authorId}${queryString}`;
    console.log(`🌐 BlogRepo - Fetching: ${url}`);
    return await this.apiClient.get<BlogsApiResponse>(url);
  }

  async searchBlogs(query: string, params?: BlogQueryParams): Promise<BlogsApiResponse> {
    const searchParams = { ...params, search: query };
    const queryString = this.buildQueryString(searchParams);
    const url = `/blogs/search${queryString}`;
    console.log(`🌐 BlogRepo - Fetching: ${url}`);
    return await this.apiClient.get<BlogsApiResponse>(url);
  }

  async rateBlog(blogId: number, rating: BlogRatingRequest): Promise<void> {
    await this.apiClient.post(`/blogs/${blogId}/rate`, rating);
  }

  async addComment(blogId: number, comment: BlogCommentRequest): Promise<BlogComment> {
    const response = await this.apiClient.post<{ code: number; message: string; result: BlogComment }>(
      `/blogs/${blogId}/comments`,
      comment
    );
    return response.result;
  }

  async updateComment(
    blogId: number,
    commentId: number,
    comment: BlogCommentRequest
  ): Promise<BlogComment> {
    const response = await this.apiClient.put<{ code: number; message: string; result: BlogComment }>(
      `/blogs/${blogId}/comments/${commentId}`,
      comment
    );
    return response.result;
  }

  async deleteComment(blogId: number, commentId: number): Promise<void> {
    await this.apiClient.delete(`/blogs/${blogId}/comments/${commentId}`);
  }
}
