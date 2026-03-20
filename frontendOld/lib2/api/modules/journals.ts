import { BaseAPIClient } from '../core/client';
import { JournalListResponse, JournalSearchParams, JournalSearchResponse } from '../core/types';
import { Journal } from '@/lib/types';

export class JournalAPI extends BaseAPIClient {
  /**
   * Get user's journals with pagination
   */
  async getJournals(page = 1, limit = 10, token?: string) {
    const { data } = await this.axiosInstance.get<JournalListResponse>(
      '/journals/me',
      {
        ...this.getConfig(token),
        params: { page, limit }
      }
    );
    return data;
  }

  /**
   * Get single journal by ID
   */
  async getJournal(id: number, token?: string) {
    const { data } = await this.axiosInstance.get<Journal>(
      `/journals/${id}`,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Create new journal entry
   */
  async createJournal(
    journalData: {
      title?: string;
      content: string;
      is_private?: boolean;
      tags?: string;
      related_value_ids?: number;
    }, 
    token?: string
  ) {
    const { data } = await this.axiosInstance.post<Journal>(
      '/journals',
      journalData,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Update existing journal
   */
  async updateJournal(id: number, journalData: Partial<Journal>, token?: string) {
    const { data } = await this.axiosInstance.put<Journal>(
      `/journals/${id}`,
      journalData,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Delete journal
   */
  async deleteJournal(id: number, token?: string) {
    await this.axiosInstance.delete(`/journals/${id}`, this.getConfig(token));
  }

  /**
   * Search journals
   */
  async searchJournals(params: JournalSearchParams, token?: string) {
    const { data } = await this.axiosInstance.get<JournalSearchResponse>(
      '/journals/search',
      {
        ...this.getConfig(token),
        params
      }
    );
    return data;
  }
}