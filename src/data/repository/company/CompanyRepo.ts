// Company Repository Interface - Data Layer contract

export interface CompanyRepo {
  getCompanyDetail(recruiterId: number): Promise<any>;
  getCompanies(page?: number, size?: number, companyAddress?: string): Promise<any>;
}
