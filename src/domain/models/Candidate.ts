
export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface CandidateRequest {
    dob: string; // ISO date string, ví dụ "2000-01-01"
    title: string;
    fullName: string;
    phone: string;
    address: string;
    image?: string; // optional field
    gender: Gender;
    link?: string;  
}

export interface CandidateResponse {
  id: number;
  dob: string;           // ISO
  title: string;
  fullName: string;
  phone: string;
  address: string;
  image?: string | null;
  gender: Gender;
  link?: string | null;

}
