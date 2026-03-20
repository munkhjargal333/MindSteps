import { CoreValue } from "./coreValue";

export interface MoodCategory {
  id: number;
  name_mn: string;
  color?: string;
  emoji?: string;
  created_at: string;
}

export interface PlutchikEmotion {
  id: number;
  category_id: number;
  name_mn: string;
  name_en: string;
  //description?: string;
  intensity_level: number;
  emoji: string;
  color: string;
  created_at: string;
}

export interface PlutchikCombination {
  id: number;
  emotion1_id: number;
  emotion2_id: number;
  combined_name_en: string;
  combined_name_mn: string;
  combined_type: 'primary' | 'secondary' | 'tertiary';
  description?: string;
  emoji?: string;
  color?: string;
  Emotion1? : PlutchikEmotion
  Emotion2? : PlutchikEmotion
}

export interface MoodUnit{
  id: number;
  category_id: number;
  plutchik_id?: number;
  combination_id?: number;
  type: 'primary' | 'dyad';
  description?: string;
  display_name_mn: string;
  display_name_en: string;
  display_color: string;
  display_emoji: string;

  MoodCategories?: MoodCategory;
  PlutchikEmotions?: PlutchikEmotion;
  PlutchikCombinations?: PlutchikCombination;
}

export interface MoodEntry {
  id: number;
  user_id: number;
  mood_unit_id: number;
  entry_date: string;
  intensity: number;
  when_felt?: string;
  trigger_event?: string;
  coping_strategy?: string;
  notes?: string;
  location?: string;
  weather?: string;
  created_at: string;
  core_value_id: number;
  CoreValues?:  CoreValue;
  MoodUnit: MoodUnit;
}