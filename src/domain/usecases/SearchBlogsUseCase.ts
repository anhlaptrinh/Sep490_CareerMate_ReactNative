import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";
import { BlogRepo } from "../../data/repository/BlogRepo";
import { BlogsApiResponse, BlogQueryParams } from "../models/Blog";

/**
 * Search Blogs Use Case
 * Searches blogs by keyword using dedicated search endpoint
 */
@injectable()
export class SearchBlogsUseCase {
  constructor(@inject(TYPES.BlogRepo) private blogRepo: BlogRepo) {}

  async execute(query: string, params?: BlogQueryParams): Promise<BlogsApiResponse> {
    try {
      if (!query || query.trim().length === 0) {
        throw new Error("Search query cannot be empty");
      }

      return await this.blogRepo.searchBlogs(query.trim(), params);
    } catch (error: any) {
      console.error("❌ SearchBlogsUseCase Error:", error);
      throw new Error(error.message || "Failed to search blogs");
    }
  }
}