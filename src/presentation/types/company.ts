export interface CompanyData {
  id: number;
  name: string;
  about: string;
  website: string;
  logoUrl: string;
  jobs: any[];
}


export interface Company {
  id: string;
  companyName: string;
  logoUrl?: string;
  companyAddress: string;
  jobCount?: number;
}

export interface CompanyListSectionProps {
  companies: Company[];
  onCompanyPress: (company: Company) => void;
  onViewMorePress: () => void;
  onBookmarkPress?: (company: Company) => void;
}
