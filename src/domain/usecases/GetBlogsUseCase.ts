import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";
import { BlogRepo } from "../../data/repository/BlogRepo";
import { BlogsApiResponse, BlogQueryParams } from "../models/Blog";

/**
 * Get Blogs Use Case
 * Business logic for fetching blogs with filters and pagination
 */
@injectable()
export class GetBlogsUseCase {
  constructor(@inject(TYPES.BlogRepo) private blogRepo: BlogRepo) {}

  async execute(params?: BlogQueryParams): Promise<BlogsApiResponse> {
    try {
      console.log('🔍 GetBlogsUseCase - Fetching blogs with params:', params);
      const response = await this.blogRepo.getBlogs(params);
      console.log('📦 GetBlogsUseCase - Response received:', response);
      return response;
    } catch (error: any) {
      console.error("❌ GetBlogsUseCase Error:", error);
      console.error("❌ Error details:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch blogs");
    }
  }
}
