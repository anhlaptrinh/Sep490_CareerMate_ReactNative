// Company Repository Implementation - uses ApiClient from DI
import { ApiClient } from "../../apis/apiClient";
import { TYPES } from "../../../di/types";
import { CompanyRepo } from "./CompanyRepo";
import { injectable, inject } from "inversify";
import "reflect-metadata";

@injectable()
class CompanyRepoImpl implements CompanyRepo {
  private apiClient: ApiClient;

  constructor(@inject(TYPES.ApiClient) apiClient: ApiClient) {
    this.apiClient = apiClient;
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
      console.error('CompanyRepoImpl.getCompanyDetail Error:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách công ty với phân trang
   * @param page - Số trang (mặc định 0)
   * @param size - Kích thước trang (mặc định 5)
   * @param companyAddress - Địa chỉ công ty (tuỳ chọn, nếu không truyền thì lấy tất cả)
   */
  async getCompanies(
    page: number = 0,
    size: number = 5,
    companyAddress?: string
  ): Promise<any> {
    try {
      let url = `/job-postings/company?page=${page}&size=${size}`;
      if (companyAddress) {
        url += `&companyAddress=${companyAddress}`;
      }
      const response = await this.apiClient.get<any>(url);
      return response;
    } catch (error) {
      console.error('CompanyRepoImpl.getCompanies Error:', error);
      throw error;
    }
  }
}

export default CompanyRepoImpl;
