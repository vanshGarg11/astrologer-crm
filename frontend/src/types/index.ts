export interface Astrologer {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  languages: string;
  rating: number;
  phone: string;
  email: string;
  status: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  dob: string;
  city: string;
}

export type ConsultationStatus = 'Pending' | 'Completed' | 'Cancelled';

export interface Consultation {
  id: string;
  customer_id: string;
  astrologer_id: string;
  customer_name?: string;
  astrologer_name?: string;
  consultation_date: string;
  consultation_time: string;
  status: ConsultationStatus;
  notes: string;
}

export interface DashboardStats {
  total_astrologers: number;
  total_customers: number;
  total_consultations: number;
  upcoming_consultations: number;
  status_breakdown: Record<ConsultationStatus, number>;
  recent_consultations: Consultation[];
}

export type FormErrors = Record<string, string>;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ListResult<T> {
  items: T[];
  meta: PaginationMeta;
}
