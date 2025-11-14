// Job Repository Implementation - uses ApiClient from DI
import { JobsApiResponse, JobPosting } from "../../../domain/models/JobModel";
import { ApiClient } from "../../apis/apiClient";
import { TYPES } from "../../../di/types";
import { JobRepo } from "./JobRepo";
import { injectable, inject } from "inversify";
import "reflect-metadata";

@injectable()
class JobRepoImpl implements JobRepo {
  private apiClient: ApiClient;

  constructor(@inject(TYPES.ApiClient) apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Lấy danh sách jobs từ API
   * @param page - Số trang (mặc định 0)
   * @param size - Kích thước trang (mặc định 5)
   * @param sortBy - Trường sort (mặc định 'createAt')
   * @param sortDir - Hướng sort (mặc định 'desc')
   */
  async getJobs(
    page: number = 0,
    size: number = 5,
    sortBy: string = 'createAt',
    sortDir: string = 'desc'
  ): Promise<JobsApiResponse> {
    try {
      const response = await this.apiClient.get<JobsApiResponse>(
        `/job-postings?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
      );
      return response;
    } catch (error) {
      console.error('JobRepoImpl.getJobs Error:', error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết một job theo ID
   * @param jobId - ID của job
   */
  async getJobById(jobId: number): Promise<JobPosting> {
    try {
      const response = await this.apiClient.get<{ result: JobPosting }>(
        `/job-postings/${jobId}`
      );
      return response.result || (response as any);
    } catch (error) {
      console.error('JobRepoImpl.getJobById Error:', error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết công ty theo recruiterId
   * @param recruiterId - ID của recruiter (company)
   */
  async getCompanyDetail(recruiterId: number): Promise<any> {
    try {
      const response = await this.apiClient.get<any>(
        `/job-postings/company/${recruiterId}`
      );
      return response.result || response;
    } catch (error) {
      console.error('JobRepoImpl.getCompanyDetail Error:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách jobs của một công ty với phân trang
   * @param recruiterId - ID của recruiter (company)
   * @param page - Số trang (mặc định 0)
   * @param size - Kích thước trang (mặc định 5)
   */
  async getCompanyJobs(
    recruiterId: number,
    page: number = 0,
    size: number = 5
  ): Promise<JobsApiResponse> {
    try {
      const response = await this.apiClient.get<JobsApiResponse>(
        `/job-postings/company/list/${recruiterId}?page=${page}&size=${size}`
      );
      return response;
    } catch (error) {
      console.error('JobRepoImpl.getCompanyJobs Error:', error);
      throw error;
    }
  }
}

export { JobRepoImpl };
