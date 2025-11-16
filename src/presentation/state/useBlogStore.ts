import { create } from 'zustand';
import { container } from '../../di/dependencies';
import { TYPES } from '../../di/types';
import { GetBlogsUseCase } from '../../domain/usecases/GetBlogsUseCase';
import { GetBlogByIdUseCase } from '../../domain/usecases/GetBlogByIdUseCase';
import { GetBlogsByCategoryUseCase } from '../../domain/usecases/GetBlogsByCategoryUseCase';
import { GetRelatedBlogsUseCase } from '../../domain/usecases/GetRelatedBlogsUseCase';
import { Blog, BlogCategory, BlogQueryParams } from '../../domain/models/Blog';

/**
 * Map API blog data to our Blog interface
 * Handles field name differences between API and our interface
 */
const mapApiBlogToBlog = (apiBlog: any): Blog => {
  return {
    ...apiBlog,
    excerpt: apiBlog.summary || apiBlog.excerpt || '',
    authorName: apiBlog.admin?.name || apiBlog.authorName || 'Unknown Author',
    authorId: apiBlog.admin?.adminId || apiBlog.authorId || 0,
    averageRating: apiBlog.averageRating || 0,
    ratingCount: apiBlog.ratingCount || 0,
    commentCount: apiBlog.commentCount || 0,
  };
};

/**
 * Blog State Interface
 */
interface BlogState {
  // State
  blogs: Blog[];
  featuredBlogs: Blog[];
  technologyBlogs: Blog[];
  hrBlogs: Blog[];
  itReportBlogs: Blog[];
  currentBlog: Blog | null;
  relatedBlogs: Blog[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;

  // Actions
  fetchBlogs: (params?: BlogQueryParams) => Promise<void>;
  fetchBlogById: (blogId: number) => Promise<void>;
  fetchBlogsByCategory: (category: BlogCategory, params?: BlogQueryParams) => Promise<void>;
  fetchRelatedBlogs: (blogId: number, limit?: number) => Promise<void>;
  clearError: () => void;
  clearCurrentBlog: () => void;
}

/**
 * Zustand Blog Store
 * Manages blog state globally
 */
export const useBlogStore = create<BlogState>((set, get) => ({
  // Initial state
  blogs: [],
  featuredBlogs: [],
  technologyBlogs: [],
  hrBlogs: [],
  itReportBlogs: [],
  currentBlog: null,
  relatedBlogs: [],
  isLoading: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,

  /**
   * Fetch all blogs with optional filters
   */
  fetchBlogs: async (params?: BlogQueryParams) => {
    set({ isLoading: true, error: null });
    try {
      const useCase = container.get<GetBlogsUseCase>(TYPES.GetBlogsUseCase);
      const response = await useCase.execute(params);

      console.log('✅ Fetch blogs response:', JSON.stringify(response, null, 2));

      // Check if response has the expected structure
      if (response && response.result && response.result.content) {
                const mappedBlogs = response.result.content.map((blog: any) => mapApiBlogToBlog(blog));
        set({
          blogs: mappedBlogs,
          currentPage: response.result.page,
          totalPages: response.result.totalPages,
          totalElements: response.result.totalElements,
          isLoading: false,
        });
      } else {
        console.error('⚠️ Unexpected response structure:', response);
        set({
          blogs: [],
          error: 'Unexpected response format',
          isLoading: false,
        });
      }
    } catch (error: any) {
      console.error('❌ Fetch blogs error:', error);
      set({
        error: error.message || 'Failed to fetch blogs',
        isLoading: false,
        blogs: [],
      });
    }
  },

  /**
   * Fetch a single blog by ID
   */
  fetchBlogById: async (blogId: number) => {
    set({ isLoading: true, error: null });
    try {
      const useCase = container.get<GetBlogByIdUseCase>(TYPES.GetBlogByIdUseCase);
      const response = await useCase.execute(blogId);

      console.log('✅ Fetch blog by ID response:', JSON.stringify(response, null, 2));

      // Handle different response formats and map fields
      let blogData: Blog | null = null;
      
      if (response && response.result) {
        // Standard wrapped response format
        blogData = mapApiBlogToBlog(response.result);
      } else if (response && (response as any).id) {
        // Direct blog object format (fallback)
        blogData = mapApiBlogToBlog(response as any);
      }

      if (blogData) {
        set({
          currentBlog: blogData,
          isLoading: false,
        });
      } else {
        console.error('⚠️ Unexpected blog response structure:', response);
        set({
          error: 'Unexpected response format',
          isLoading: false,
        });
      }
    } catch (error: any) {
      console.error('❌ Fetch blog by ID error:', error);
      set({
        error: error.message || 'Failed to fetch blog',
        isLoading: false,
      });
    }
  },

  /**
   * Fetch blogs by category
   */
  fetchBlogsByCategory: async (category: BlogCategory, params?: BlogQueryParams) => {
    set({ isLoading: true, error: null });
    try {
      const useCase = container.get<GetBlogsByCategoryUseCase>(TYPES.GetBlogsByCategoryUseCase);
      const response = await useCase.execute(category, params);

      console.log(`✅ Fetch blogs by category ${category} response:`, JSON.stringify(response, null, 2));

      // Check if response has the expected structure
      if (response && response.result && response.result.content) {
        const mappedBlogs = response.result.content.map((blog: any) => mapApiBlogToBlog(blog));
        // Store in appropriate category array
        switch (category) {
          case 'TECHNOLOGY':
            set({ technologyBlogs: mappedBlogs });
            break;
          case 'HR':
            set({ hrBlogs: mappedBlogs });
            break;
          case 'IT_MARKET':
            set({ itReportBlogs: mappedBlogs });
            break;
          default:
            set({ blogs: mappedBlogs });
        }
        set({ isLoading: false });
      } else {
        console.error('⚠️ Unexpected response structure:', response);
        set({
          error: 'Unexpected response format',
          isLoading: false,
        });
      }
    } catch (error: any) {
      console.error('❌ Fetch blogs by category error:', error);
      set({
        error: error.message || 'Failed to fetch blogs by category',
        isLoading: false,
      });
    }
  },

  /**
   * Fetch related blogs
   */
  fetchRelatedBlogs: async (blogId: number, limit: number = 5) => {
    try {
      const useCase = container.get<GetRelatedBlogsUseCase>(TYPES.GetRelatedBlogsUseCase);
      const response = await useCase.execute(blogId, limit);

      console.log('✅ Fetch related blogs response:', JSON.stringify(response, null, 2));

      let relatedBlogs: Blog[] = [];
      
      if (response && response.result) {
        if (Array.isArray(response.result)) {
          // Direct array format
          relatedBlogs = response.result.map((blog: any) => mapApiBlogToBlog(blog));
        } else if (response.result.content && Array.isArray(response.result.content)) {
          // Paginated format
          relatedBlogs = response.result.content.map((blog: any) => mapApiBlogToBlog(blog));
        }
        set({ relatedBlogs });
      } else {
        console.error('⚠️ Unexpected response structure:', response);
        set({ relatedBlogs: [] });
      }
    } catch (error: any) {
      console.error('❌ Fetch related blogs error:', error);
      set({ relatedBlogs: [] });
    }
  },

  /**
   * Clear error
   */
  clearError: () => set({ error: null }),

  /**
   * Clear current blog
   */
  clearCurrentBlog: () => set({ currentBlog: null, relatedBlogs: [] }),
}));
