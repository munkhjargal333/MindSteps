import { BaseAPIClient } from '../core/client';
import { MoodUnit, PlutchikCombination, PlutchikEmotion } from '@/lib/types';

export class AdminAPI extends BaseAPIClient {
  // ==================== MOOD UNITS MANAGEMENT ====================
  
  /**
   * Get all mood units with pagination
   */
  async getMoodUnits(page: number, limit: number, token: string) {
    const { data } = await this.axiosInstance.get(
      `mood-units?page=${page}&limit=${limit}`,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Get mood units by category
   */
  async getMoodUnitsByCategory(categoryId: number, token: string) {
    const { data } = await this.axiosInstance.get(
      `/mood-units/category/${categoryId}`,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Get mood units by type
   */
  async getMoodUnitsByType(type: string, token: string) {
    const { data } = await this.axiosInstance.get(
      `/mood-units/type/${type}`,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Get mood unit by ID
   */
  async getMoodUnitById(id: number, token: string) {
    const { data } = await this.axiosInstance.get(
      `/mood-units/${id}`,
      this.getConfig(token)
    );
    return data;
  }

  // ==================== PLUTCHIK COMBINATIONS MANAGEMENT ====================
  
  /**
   * Get all Plutchik combinations
   */
  async getPlutchikCombinations(token: string) {
    const { data } = await this.axiosInstance.get(
      `/plutchik-combinations`,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Get Plutchik emotions
   */
  async getPlutchikEmotions(token: string) {
    const { data } = await this.axiosInstance.get<PlutchikEmotion[]>(
      `/plutchik-combinations/emotions`,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Get Plutchik combination by ID
   */
  async getPlutchikCombinationById(id: number, token: string) {
    const { data } = await this.axiosInstance.get<PlutchikCombination>(
      `/plutchik-combinations/${id}`,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Create Plutchik combination
   */
  async createPlutchikCombination(plutchik: any, token: string) {
    const { data } = await this.axiosInstance.post<PlutchikCombination>(
      `/plutchik-combinations/`,
      plutchik,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Update Plutchik combination
   */
  async updatePlutchikCombination(id: number, plutchik: any, token: string) {
    const { data } = await this.axiosInstance.put<PlutchikCombination>(
      `/plutchik-combinations/${id}`,
      plutchik,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Delete Plutchik combination
   */
  async deletePlutchikCombination(id: number, token: string) {
    const { data } = await this.axiosInstance.delete(
      `/plutchik-combinations/${id}`,
      this.getConfig(token)
    );
    return data;
  }
}