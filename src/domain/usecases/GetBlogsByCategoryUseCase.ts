import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";
import { BlogRepo } from "../../data/repository/BlogRepo";
import { BlogsApiResponse, BlogQueryParams } from "../models/Blog";

/**
 * Get Blogs By Category Use Case
 * Fetches blogs filtered by category
 */
@injectable()
export class GetBlogsByCategoryUseCase {
  constructor(@inject(TYPES.BlogRepo) private blogRepo: BlogRepo) {}

  async execute(category: string, params?: BlogQueryParams): Promise<BlogsApiResponse> {
    try {
      if (!category) {
        throw new Error("Category is required");
      }

      console.log(`🔍 GetBlogsByCategoryUseCase - Fetching blogs for category: ${category}`, params);
      const response = await this.blogRepo.getBlogsByCategory(category, params);
      console.log(`📦 GetBlogsByCategoryUseCase - Response received:`, response);
      return response;
    } catch (error: any) {
      console.error("❌ GetBlogsByCategoryUseCase Error:", error);
      console.error("❌ Error details:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch blogs by category");
    }
  }
}
