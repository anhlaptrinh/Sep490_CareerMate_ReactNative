import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";
import { BlogRepo } from "../../data/repository/BlogRepo";
import { BlogsApiResponse } from "../models/Blog";

/**
 * Get Related Blogs Use Case
 * Fetches blogs related to a specific blog based on category/tags
 */
@injectable()
export class GetRelatedBlogsUseCase {
  constructor(@inject(TYPES.BlogRepo) private blogRepo: BlogRepo) {}

  async execute(blogId: number, limit: number = 5): Promise<BlogsApiResponse> {
    try {
      if (!blogId || blogId <= 0) {
        throw new Error("Invalid blog ID");
      }

      return await this.blogRepo.getRelatedBlogs(blogId, limit);
    } catch (error: any) {
      console.error("❌ GetRelatedBlogsUseCase Error:", error);
      throw new Error(error.message || "Failed to fetch related blogs");
    }
  }
}
