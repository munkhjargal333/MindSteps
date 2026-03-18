import { BaseAPIClient } from '../core/client';
import { ApiResponse } from '../core/types';
import { User,DashboardStats } from '@/lib/types';

export class UserAPI extends BaseAPIClient {
  /**
   * Get current user profile
   */
  async getMe(token?: string) {
    const { data } = await this.axiosInstance.get<{ 
      success: boolean; 
      user: User 
    }>('/users/me', this.getConfig(token));
    return data.user;
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<User>, token?: string) {
    const { data } = await this.axiosInstance.put<{ 
      success: boolean; 
      user: User 
    }>(
      '/users/me',
      profileData,
      this.getConfig(token)
    );
    return data.user;
  }

  /**
   * Change password
   */
  async changePassword(
    currentPassword: string, 
    newPassword: string, 
    confirmPassword: string, 
    token?: string
  ) {
    const { data } = await this.axiosInstance.post<ApiResponse<any>>(
      '/users/change-password',
      {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      },
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Delete user account
   */
  async deleteAccount(token?: string) {
    const { data } = await this.axiosInstance.delete<ApiResponse<any>>(
      '/users/me', 
      this.getConfig(token)
    );
    return data;
  }

  // /**
  //  * Get user progress
  //  */
  // async getUserProgress(period: 'weekly' | 'monthly', token?: string) {
  //   const { data } = await this.axiosInstance.get('/users/progress', {
  //     ...this.getConfig(token),
  //     params: { period }
  //   });
  //   return data;
  // }
    /**
   * Get user dashboard statistics
   */
  async getUserStats(token?: string) {
    const { data } = await this.axiosInstance.get<DashboardStats>(
      '/gamification/dashboard', 
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Get user progress by period
   */
  async getUserProgress(period: 'weekly' | 'monthly', token?: string) {
    const { data } = await this.axiosInstance.get('/users/progress', {
      ...this.getConfig(token),
      params: { period }
    });
    return data;
  }
}
