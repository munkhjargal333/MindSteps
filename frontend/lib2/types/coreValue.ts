export interface Maslow {
  id: number;
  level_number: number;
  name: string;
  description?: string;
  sort_order?: number;
  color?: string;
  icon: string;
}

export interface CoreValue {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  priority_order?: number;
  maslow_level_id?: number
  color?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  MaslowLevel?: Maslow;
}