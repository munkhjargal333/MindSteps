export interface JournalListResponse {
  journals: Journal[];
  total: number;
  page: number;
  limit: number;
}

export interface Journal {
  id: number;
  user_id: number;
  title: string;
  entry_date: string;
  content: string;
  word_count?: number;
  sentiment_score?: number;
  is_private: boolean;
  tags?: string;
  created_at: string;
  updated_at: string;
  related_value_ids?: number;
}


