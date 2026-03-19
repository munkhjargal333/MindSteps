import { BaseAPIClient } from '../core/client';
import { CoreValueListResponse } from '../core/types';
import { CoreValue, Maslow } from '@/lib/types';

export class CoreValuesAPI extends BaseAPIClient {
  /**
   * Get user's core values
   */
  async getCoreValues(token?: string) {
    const { data } = await this.axiosInstance.get<CoreValueListResponse>(
      '/core-values/me',
      this.getConfig(token)
    );
    return data.core_values;
  }

  /**
   * Get Maslow hierarchy levels
   */
  async getMaslow(token?: string) {
    const { data } = await this.axiosInstance.get<Maslow[]>(
      '/core-values/maslow',
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Get single core value
   */
  async getCoreValue(id: number, token?: string) {
    const { data } = await this.axiosInstance.get<CoreValue>(
      `/core-values/${id}`,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Create core value
   */
  async createCoreValue(
    valueData: {
      name: string;
      description?: string;
      maslow_level_id?: number;
      color: string;
      icon?: string;
      priority_order: number;
    }, 
    token?: string
  ) {
    const { data } = await this.axiosInstance.post<CoreValue>(
      '/core-values',
      valueData,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Update core value
   */
  async updateCoreValue(id: number, valueData: Partial<CoreValue>, token?: string) {
    const { data } = await this.axiosInstance.put<CoreValue>(
      `/core-values/${id}`,
      valueData,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Delete core value
   */
  async deleteCoreValue(id: number, token?: string) {
    await this.axiosInstance.delete(`/core-values/${id}`, this.getConfig(token));
  }
}