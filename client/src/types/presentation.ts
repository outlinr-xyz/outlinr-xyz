export interface Presentation {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  thumbnail_url?: string | null;
  last_opened_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePresentationInput {
  title?: string;
  description?: string;
}

export interface UpdatePresentationInput {
  title?: string;
  description?: string;
  thumbnail_url?: string;
  last_opened_at?: string;
}

export interface PaginatedPresentations {
  data: Presentation[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
