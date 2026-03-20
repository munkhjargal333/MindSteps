import { BaseAPIClient } from '../core/client';
import { MoodEntryListResponse, MoodStatistics } from '../core/types';
import { MoodCategory, MoodUnit, MoodEntry } from '@/lib/types';

export class MoodAPI extends BaseAPIClient {
  // ==================== MOOD CATEGORIES & UNITS ====================
  
  /**
   * Get all mood categories
   */
  async getMoodCategories(token?: string) {
    const { data } = await this.axiosInstance.get<MoodCategory[]>(
      'moods/types/categories',
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Get moods by category
   */
  async getMoodsByCategory(categoryId: number, token?: string) {
    const { data } = await this.axiosInstance.get<MoodUnit[]>(
      `/mood-units/category/${categoryId}`,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Get all user's moods
   */
  async getAllMoods(token?: string) {
    const { data } = await this.axiosInstance.get<MoodEntry[]>(
      '/moods/me',
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Get single mood
   */
  async getMood(id: number, token?: string) {
    const { data } = await this.axiosInstance.get<MoodEntry>(
      `/moods/${id}`,
      this.getConfig(token)
    );
    return data;
  }

  // ==================== MOOD ENTRIES ====================
  
  /**
   * Get mood entries with pagination
   */
  async getMoodEntries(page = 1, limit = 10, token?: string) {
    const { data } = await this.axiosInstance.get<MoodEntryListResponse>(
      '/mood-entries/me',
      {
        ...this.getConfig(token),
        params: { page, limit }
      }
    );
    return data;
  }

  /**
   * Get single mood entry
   */
  async getMoodEntry(id: number, token?: string) {
    const { data } = await this.axiosInstance.get<MoodEntry>(
      `/mood-entries/${id}`,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Create mood entry
   */
  async createMoodEntry(
    moodData: {
      mood_unit_id: number;
      core_value_id?: number;
      intensity: number;
      when_felt?: string;
      trigger_event?: string;
      coping_strategy?: string;
      notes?: string;
      location?: string;
      weather?: string;
    }, 
    token?: string
  ) {
    const { data } = await this.axiosInstance.post<MoodEntry>(
      '/mood-entries',
      moodData,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Update mood entry
   */
  async updateMoodEntry(id: number, moodData: Partial<MoodEntry>, token?: string) {
    const { data } = await this.axiosInstance.put<MoodEntry>(
      `/mood-entries/${id}`,
      moodData,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Delete mood entry
   */
  async deleteMoodEntry(id: number, token?: string) {
    await this.axiosInstance.delete(`/mood-entries/${id}`, this.getConfig(token));
  }

  /**
   * Get mood statistics
   */
  async getMoodStatistics(days = 30, token?: string) {
    const { data } = await this.axiosInstance.get<MoodStatistics>(
      '/mood-entries/statistics',
      {
        ...this.getConfig(token),
        params: { days }
      }
    );
    return data;
  }
}