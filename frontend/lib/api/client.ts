import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

import {
  Journal,
  User,
  UserStreak,
  MoodCategory,
  Mood,
  MoodEntry,
  Goal,
  Lesson,
  MeditationSession,
  UserLevel,
  CoreValue,
  Milestone
} from './../types/index';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Response types
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// interface PaginatedResponse<T> {
//   page: number;
//   limit: number;
//   total: number;
//   data: T[];
// }

interface JournalListResponse {
  journals: Journal[];
  total: number;
  page: number;
  limit: number;
}

interface MoodEntryListResponse {
  entries: MoodEntry[];
  total: number;
  page: number;
  limit: number;
}

interface GoalListResponse {
  success: boolean;
  summary: {
    total: number;
    active: number;
    completed: number;
    paused: number;
  };
  goals: {
    active: Goal[];
    completed: Goal[];
    paused: Goal[];
  };
}

interface GoalStatistics {
  total_goals: number;
  active_goals: number;
  completed_goals: number;
  paused_goals: number;
  total_milestones: number;
  completed_milestones: number;
  average_progress: number;
  goals_by_type: {
    short_term: number;
    long_term: number;
    habit: number;
  };
  goals_by_priority: {
    low: number;
    medium: number;
    high: number;
  };
}

interface MoodStatistics {
  total_entries: number;
  period_days: number;
  average_intensity?: number;
  mood_distribution?: Record<number, number>;
}

interface CoreValueListResponse {
  core_values: CoreValue[];
  total: number;
}

class APIClient {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('auth_token');
      if (savedToken) {
        this.token = savedToken;
      }
    }

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🔵 API Request:', config.method?.toUpperCase(), config.url);
        }
        
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ API Response:', response.config.url, response.status);
        }
        return response;
      },
      (error) => {
        if (error.response) {
          const status = error.response.status;
          const message = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message;
          
          switch (status) {
            case 401:
              console.error('🔒 Unauthorized');
              this.clearToken();
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('unauthorized'));
              }
              break;
            case 403:
              console.error('🚫 Forbidden');
              break;
            case 404:
              console.error('🔍 Not Found:', error.response.config.url);
              break;
            case 422:
              console.error('⚠️ Validation Error:', message);
              break;
            case 500:
              console.error('💥 Server Error');
              break;
          }
          
          return Promise.reject(new Error(message || `Request failed with status ${status}`));
        }
        
        if (error.request) {
          console.error('🌐 Network Error');
          return Promise.reject(new Error('Network error - please check your connection'));
        }
        
        return Promise.reject(new Error(error.message || 'Request failed'));
      }
    );
  }

  // ==================== TOKEN MANAGEMENT ====================
  
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
    console.log('🔑 Token saved');
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    console.log('🗑️ Token cleared');
  }

  private getConfig(token?: string): AxiosRequestConfig {
    const authToken = token || this.token;
    return authToken ? {
      headers: { Authorization: `Bearer ${authToken}` }
    } : {};
  }

  // ==================== AUTH ====================
  
  async register(name: string, email: string, password: string, confirmPassword: string) {
    const { data } = await this.axiosInstance.post<{ success: boolean; token: string; user: User }>('/auth/register', {
      name,
      email,
      password,
      confirm_password: confirmPassword
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async login(email: string, password: string) {
    const { data } = await this.axiosInstance.post<{ success: boolean; token: string; user: User }>('/auth/login', {
      email,
      password
    });

    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  async logout(token?: string) {
    try {
      await this.axiosInstance.post('/auth/logout', {}, this.getConfig(token));
    } finally {
      this.clearToken();
    }
  }

  async forgotPassword(email: string) {
    const { data } = await this.axiosInstance.post<ApiResponse<any>>('/auth/forgot-password', { email });
    return data;
  }

  async verifyOtp(email: string, otpCode: string) {
    const { data } = await this.axiosInstance.post<ApiResponse<any>>('/auth/verify-otp', {
      email,
      otp_code: otpCode
    });
    return data;
  }

  async resetPassword(email: string, otpCode: string, newPassword: string, confirmPassword: string) {
    const { data } = await this.axiosInstance.post<ApiResponse<any>>('/auth/reset-password', {
      email,
      otp_code: otpCode,
      new_password: newPassword,
      confirm_password: confirmPassword
    });
    return data;
  }

  // ==================== USER ====================
  
  async getMe(token?: string) {
    const { data } = await this.axiosInstance.get<{ success: boolean; user: User }>('/users/me', this.getConfig(token));
    return data.user;
  }

  async updateProfile(profileData: Partial<User>, token?: string) {
    const { data } = await this.axiosInstance.put<{ success: boolean; user: User }>(
      '/users/me',
      profileData,
      this.getConfig(token)
    );
    return data.user;
  }

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string, token?: string) {
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

  async deleteAccount(token?: string) {
    const { data } = await this.axiosInstance.delete<ApiResponse<any>>('/users/me', this.getConfig(token));
    return data;
  }

  // ==================== JOURNALS ====================
  
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

  async getJournal(id: number, token?: string) {
    const { data } = await this.axiosInstance.get<Journal>(
      `/journals/${id}`,
      this.getConfig(token)
    );
    return data;
  }

  async createJournal(journalData: {
    title?: string;
    content: string;
    is_private?: boolean;
    tags?: string;
    related_value_ids?: number;
  }, token?: string) {
    const { data } = await this.axiosInstance.post<Journal>(
      '/journals',
      journalData,
      this.getConfig(token)
    );
    return data;
  }

  async updateJournal(id: number, journalData: Partial<Journal>, token?: string) {
    const { data } = await this.axiosInstance.put<Journal>(
      `/journals/${id}`,
      journalData,
      this.getConfig(token)
    );
    return data;
  }

  async deleteJournal(id: number, token?: string) {
    await this.axiosInstance.delete(`/journals/${id}`, this.getConfig(token));
  }

  async searchJournals(params: {
    query?: string;
    tags?: string;
    from_date?: string;
    to_date?: string;
  }, token?: string) {
    const { data } = await this.axiosInstance.get<{ journals: Journal[]; total: number }>(
      '/journals/search',
      {
        ...this.getConfig(token),
        params
      }
    );
    return data;
  }

  // ==================== CORE VALUES ====================
  
  async getCoreValues(token?: string) {
    const { data } = await this.axiosInstance.get<CoreValueListResponse>(
      '/core-values/me',
      this.getConfig(token)
    );
    return data.core_values;
  }

  async getCoreValue(id: number, token?: string) {
    const { data } = await this.axiosInstance.get<CoreValue>(
      `/core-values/${id}`,
      this.getConfig(token)
    );
    return data;
  }

  async createCoreValue(valueData: {
    name: string;
    description?: string;
    maslow_level_id?: number;
    color: string;
    icon?: string;
    priority_order: number;
  }, token?: string) {
    const { data } = await this.axiosInstance.post<CoreValue>(
      '/core-values',
      valueData,
      this.getConfig(token)
    );
    return data;
  }

  async updateCoreValue(id: number, valueData: Partial<CoreValue>, token?: string) {
    const { data } = await this.axiosInstance.put<CoreValue>(
      `/core-values/${id}`,
      valueData,
      this.getConfig(token)
    );
    return data;
  }

  async deleteCoreValue(id: number, token?: string) {
    await this.axiosInstance.delete(`/core-values/${id}`, this.getConfig(token));
  }

  // ==================== MOOD CATEGORIES & MOODS ====================
  
  async getMoodCategories(token?: string) {
    const { data } = await this.axiosInstance.get<MoodCategory[]>(
      '/moods/categories',
      this.getConfig(token)
    );
    return data;
  }

  async getMoodsByCategory(categoryId: number, token?: string) {
    const { data } = await this.axiosInstance.get<Mood[]>(
      `/moods/categories/${categoryId}`,
      this.getConfig(token)
    );
    return data;
  }

  async getAllMoods(token?: string) {
    const { data } = await this.axiosInstance.get<Mood[]>(
      '/moods/me',
      this.getConfig(token)
    );
    return data;
  }

  async getMood(id: number, token?: string) {
    const { data } = await this.axiosInstance.get<Mood>(
      `/moods/${id}`,
      this.getConfig(token)
    );
    return data;
  }

  // ==================== MOOD ENTRIES ====================
  
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

  async getMoodEntry(id: number, token?: string) {
    const { data } = await this.axiosInstance.get<MoodEntry>(
      `/mood-entries/${id}`,
      this.getConfig(token)
    );
    return data;
  }

  async createMoodEntry(moodData: {
    mood_id: number;
    intensity: number;
    when_felt?: string;
    trigger_event?: string;
    coping_strategy?: string;
    notes?: string;
    location?: string;
    weather?: string;
    related_value_ids?: number[];
  }, token?: string) {
    const { data } = await this.axiosInstance.post<MoodEntry>(
      '/mood-entries',
      moodData,
      this.getConfig(token)
    );
    return data;
  }

  async updateMoodEntry(id: number, moodData: Partial<MoodEntry>, token?: string) {
    const { data } = await this.axiosInstance.put<MoodEntry>(
      `/mood-entries/${id}`,
      moodData,
      this.getConfig(token)
    );
    return data;
  }

  async deleteMoodEntry(id: number, token?: string) {
    await this.axiosInstance.delete(`/mood-entries/${id}`, this.getConfig(token));
  }

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

  // ==================== GOALS ====================
  
  async getGoals(token?: string) {
    const { data } = await this.axiosInstance.get<GoalListResponse>(
      '/goals/me',
      this.getConfig(token)
    );
    return data;
  }

  async getGoalStatistics(token?: string) {
    const { data } = await this.axiosInstance.get<{ success: boolean; statistics: GoalStatistics }>(
      '/goals/statistics',
      this.getConfig(token)
    );
    return data.statistics;
  }

  async getGoal(id: number, token?: string) {
    const { data } = await this.axiosInstance.get<{ success: boolean; goal: Goal }>(
      `/goals/${id}`,
      this.getConfig(token)
    );
    return data.goal;
  }

  async createGoal(goalData: {
    value_id?: number;
    title: string;
    description?: string;
    goal_type: string;
    target_date?: string;
    priority: string;
    is_public?: boolean;
  }, token?: string) {
    const { data } = await this.axiosInstance.post<{ success: boolean; goal: Goal }>(
      '/goals',
      goalData,
      this.getConfig(token)
    );
    return data.goal;
  }

  async updateGoal(id: number, goalData: Partial<Goal>, token?: string) {
    const { data } = await this.axiosInstance.put<{ success: boolean; goal: Goal }>(
      `/goals/${id}`,
      goalData,
      this.getConfig(token)
    );
    return data.goal;
  }

  async deleteGoal(id: number, token?: string) {
    const { data } = await this.axiosInstance.delete<ApiResponse<any>>(`/goals/${id}`, this.getConfig(token));
    return data;
  }

  async pauseGoal(id: number, token?: string) {
    const { data } = await this.axiosInstance.post<{ success: boolean; goal: Goal }>(
      `/goals/${id}/pause`,
      {},
      this.getConfig(token)
    );
    return data.goal;
  }

  async resumeGoal(id: number, token?: string) {
    const { data } = await this.axiosInstance.post<{ success: boolean; goal: Goal }>(
      `/goals/${id}/resume`,
      {},
      this.getConfig(token)
    );
    return data.goal;
  }

  // ==================== MILESTONES ====================
  
  async createMilestone(goalId: number, milestoneData: {
    title: string;
    description?: string;
    target_date?: string;
    sort_order: number;
  }, token?: string) {
    const { data } = await this.axiosInstance.post<{ success: boolean; milestone: Milestone }>(
      `/goals/${goalId}/milestones`,
      milestoneData,
      this.getConfig(token)
    );
    return data.milestone;
  }

  async updateMilestone(milestoneId: number, milestoneData: Partial<Milestone>, token?: string) {
    const { data } = await this.axiosInstance.put<{ success: boolean; milestone: Milestone }>(
      `/goals/milestones/${milestoneId}`,
      milestoneData,
      this.getConfig(token)
    );
    return data.milestone;
  }

  async completeMilestone(milestoneId: number, token?: string) {
    const { data } = await this.axiosInstance.post<{
      success: boolean;
      milestone: Milestone;
      goal_progress: {
        percentage: number;
        status: string;
        is_complete: boolean;
      };
    }>(
      `/goals/milestones/${milestoneId}/complete`,
      {},
      this.getConfig(token)
    );
    return data;
  }

  // ==================== LESSONS ====================
  
  async getLessons(category?: number, token?: string) {
    const { data } = await this.axiosInstance.get<Lesson[]>('/lessons', {
      ...this.getConfig(token),
      params: category ? { category } : {}
    });
    return data;
  }

  async getLesson(slug: string, token?: string) {
    const { data } = await this.axiosInstance.get<Lesson>(
      `/lessons/${slug}`,
      this.getConfig(token)
    );
    return data;
  }

  async markLessonProgress(lessonId: number, progressData: {
    progress_percentage?: number;
    status?: string;
    time_spent?: number;
  }, token?: string) {
    const { data } = await this.axiosInstance.post(
      `/lessons/${lessonId}/progress`,
      progressData,
      this.getConfig(token)
    );
    return data;
  }

 

 async completeLesson(lessonId: number, token?: string) {
    const { data } = await this.axiosInstance.post(
      `/lessons/${lessonId}/complete`,
      {},
      this.getConfig(token)
    );
    return data;
  }

  async rateLesson(lessonId: number, rating: number, review?: string, token?: string) {
    const { data } = await this.axiosInstance.post(
      `/lessons/${lessonId}/rate`,
      { rating, review },
      this.getConfig(token)
    );
    return data;
  }

  // ==================== MEDITATION ====================
  
  async getMeditationTechniques(token?: string) {
    const { data } = await this.axiosInstance.get(
      '/meditation/techniques',
      this.getConfig(token)
    );
    return data;
  }

  async createMeditationSession(sessionData: {
    meditation_id?: number;
    duration_seconds?: number;
    notes?: string;
  }, token?: string) {
    const { data } = await this.axiosInstance.post<MeditationSession>(
      '/meditation/sessions',
      sessionData,
      this.getConfig(token)
    );
    return data;
  }

  async getMeditationSessions(startDate?: string, endDate?: string, token?: string) {
    const { data } = await this.axiosInstance.get<MeditationSession[]>(
      '/meditation/sessions',
      {
        ...this.getConfig(token),
        params: { start_date: startDate, end_date: endDate }
      }
    );
    return data;
  }

  async getMeditationSession(id: number, token?: string) {
    const { data } = await this.axiosInstance.get<MeditationSession>(
      `/meditation/sessions/${id}`,
      this.getConfig(token)
    );
    return data;
  }

  async completeMeditationSession(id: number, sessionData: {
    duration_seconds: number;
    completed_percentage: number;
    notes?: string;
  }, token?: string) {
    const { data } = await this.axiosInstance.post(
      `/meditation/sessions/${id}/complete`,
      sessionData,
      this.getConfig(token)
    );
    return data;
  }

  // ==================== USER STATS ====================
  
  async getUserStats(token?: string) {
    const { data } = await this.axiosInstance.get<{
      level: UserLevel;
      streaks: UserStreak[];
      total_journals: number;
      total_mood_entries: number;
      total_meditation_minutes: number;
    }>('/users/stats', this.getConfig(token));
    return data;
  }

  async getUserProgress(period: 'weekly' | 'monthly', token?: string) {
    const { data } = await this.axiosInstance.get('/users/progress', {
      ...this.getConfig(token),
      params: { period }
    });
    return data;
  }

  // ==================== HEALTH CHECK ====================
  
  async healthCheck() {
    const { data } = await this.axiosInstance.get<{ status: string }>('/health');
    return data;
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export class for testing or multiple instances
export { APIClient };