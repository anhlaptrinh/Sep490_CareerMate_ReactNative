import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";
import { BlogRepo } from "../../data/repository/BlogRepo";
import { BlogApiResponse } from "../models/Blog";

/**
 * Get Blog By ID Use Case
 * Fetches a single blog and increments view count
 */
@injectable()
export class GetBlogByIdUseCase {
  constructor(@inject(TYPES.BlogRepo) private blogRepo: BlogRepo) {}

  async execute(blogId: number): Promise<BlogApiResponse> {
    try {
      if (!blogId || blogId <= 0) {
        throw new Error("Invalid blog ID");
      }

      return await this.blogRepo.getBlogById(blogId);
    } catch (error: any) {
      console.error("❌ GetBlogByIdUseCase Error:", error);
      throw new Error(error.message || "Failed to fetch blog");
    }
  }
}
