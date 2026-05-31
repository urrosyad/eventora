export type UserRole = "admin" | "organisasi" | "perusahaan";

export interface User {
  id: number;
  email: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Organization {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  category: string | null;
  province: string | null;
  city: string | null;
  address: string | null;
  logo_path: string | null;
  logo_url: string | null;
  email: string | null;
  phone: string | null;
  instagram: string | null;
  linkedin: string | null;
  website: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Company {
  id: number;
  user_id: number;
  name: string;
  industry: string | null;
  description: string | null;
  province: string | null;
  city: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  linkedin: string | null;
  logo_path: string | null;
  logo_url: string | null;
  sponsorship_preferences: string[] | null;
  support_types_offered: string[] | null;
  created_at?: string;
  updated_at?: string;
}

export type EventStatus = "draft" | "active" | "archived" | "hidden" | "removed";

export interface EventModel {
  id: number;
  organization_id: number;
  name: string;
  description: string;
  target_audience: string;
  participant_count: number;
  province: string;
  city: string;
  event_date: string;
  category: string;
  support_types_needed: string[];
  budget_range: string;
  proposal_path: string | null;
  proposal_url: string | null;
  status: EventStatus;
  organization?: Organization;
  created_at?: string;
  updated_at?: string;
}

export type SponsorshipStatus = "pending" | "reviewed" | "accepted" | "rejected" | "cancelled";

export interface SponsorshipApplication {
  id: number;
  event_id: number;
  company_id: number;
  organization_id: number;
  support_type_requested: string;
  cover_letter: string;
  additional_message: string | null;
  response_message: string | null;
  status: SponsorshipStatus;
  reviewed_at: string | null;
  decided_at: string | null;
  event?: EventModel;
  company?: Company;
  organization?: Organization;
  pitching_session?: PitchingSession | null;
  created_at?: string;
  updated_at?: string;
}

export interface Bookmark {
  id: number;
  organization_id: number;
  company_id: number;
  company?: Company;
  created_at?: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type:
    | "sponsorship_received"
    | "sponsorship_reviewed"
    | "sponsorship_accepted"
    | "sponsorship_rejected"
    | "sponsorship_cancelled"
    | "pitching_scheduled";
  related_id: number | null;
  related_type: "sponsorship_application" | "pitching_session" | null;
  is_read: boolean;
  created_at?: string;
}

export interface PitchingSession {
  id: number;
  sponsorship_application_id: number;
  type: "online" | "offline";
  meet_link: string | null;
  location: string | null;
  scheduled_at: string;
  notes: string | null;
  created_by: number;
  created_at?: string;
  updated_at?: string;
}

export interface Province {
  id: string;
  name: string;
}

export interface City {
  id: string;
  province_id: string;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
}

export interface ApiMeta {
  current_page?: number;
  per_page?: number;
  total?: number;
  has_more?: boolean;
  next_cursor?: string | null;
}
