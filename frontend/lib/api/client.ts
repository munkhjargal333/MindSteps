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
  UserLevel
} from './../types/index';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class APIClient {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Request interceptor - automatically adds token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Use stored token if no token provided in config
        if (this.token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Request:', config.method?.toUpperCase(), config.url);
          console.log('Token present:', !!config.headers.Authorization);
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const status = error.response.status;
          const message = error.response?.data?.message || error.message;
          
          switch (status) {
            case 401:
              console.error('Unauthorized - token may be invalid or expired');
              // Clear invalid token
              this.clearToken();
              // You could dispatch a logout action here
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('unauthorized'));
              }
              break;
            case 403:
              console.error('Forbidden - insufficient permissions');
              break;
            case 404:
              console.error('Resource not found');
              break;
            case 500:
              console.error('Server error');
              break;
          }
          
          return Promise.reject(new Error(message || `Request failed with status ${status}`));
        }
        
        if (error.request) {
          return Promise.reject(new Error('Network error - please check your connection'));
        }
        
        return Promise.reject(new Error(error.message || 'Request failed'));
      }
    );
  }

  // Token management methods
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
    console.log('Token set successfully');
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    console.log('Token cleared');
  }

  private getConfig(token?: string): AxiosRequestConfig {
    const config: AxiosRequestConfig = {};
    
    // Use provided token, or fall back to stored token
    const authToken = token || this.token;
    
    if (authToken) {
      config.headers = {
        Authorization: `Bearer ${authToken}`,
      };
    }
    
    return config;
  }

  // Auth
  async login(email: string, password: string) {
    const res = await this.axiosInstance.post('/auth/login', { email, password });
    const { message } = res.data;
    const token = res.data.message;

    if (!token) {
      console.error('❌ Token not found in message field:', res.data);
      throw new Error('Token not received from backend');
    }
    this.setToken(token);
    // Хэрэглэгчийн мэдээлэл авна (хэрвээ API байгаа бол)
      let user = null;
      try {
        user = await this.getMe();
      } catch {
        console.warn('⚠️ getMe() failed after login');
      }

      return { token, user };
  }


  async register(name: string, email: string, password: string) {
    const { data } = await this.axiosInstance.post<{ token: string; user: User }>(
      '/auth/register',
      { name, email, password }
    );
    // Automatically store token after successful registration
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async getMe(token?: string) {
    const { data } = await this.axiosInstance.get<User>('/user/me', this.getConfig(token));
    return data;
  }
  
  async logout(token?: string) {
    try {
      const { data } = await this.axiosInstance.post(
        '/auth/logout',
        {},
        this.getConfig(token)
      );
      this.clearToken();
      return data;
    } catch (error) {
      // Clear token even if logout request fails
      this.clearToken();
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    const { data } = await this.axiosInstance.post<{ token: string }>(
      '/auth/refresh',
      { refresh_token: refreshToken }
    );
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  // Journal - token optional (uses stored token by default)
  async getJournals(page = 1, limit = 10, token?: string) {
    const { data } = await this.axiosInstance.get<{
      journals: Journal[];
      total: number;
      page: number;
    }>(`/journals`, {
      ...this.getConfig(token),
      params: { page, limit },
    });
    return data;
  }

  async getJournal(id: number, token?: string) {
    const { data } = await this.axiosInstance.get<Journal>(
      `/journals/${id}`,
      this.getConfig(token)
    );
    return data;
  }

  async createJournal(journalData: Partial<Journal>, token?: string) {
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
    const { data } = await this.axiosInstance.delete<{ success: boolean }>(
      `/journals/${id}`,
      this.getConfig(token)
    );
    return data;
  }

  async searchJournals(query: string, page = 1, limit = 10, token?: string) {
    const { data } = await this.axiosInstance.get<{
      journals: Journal[];
      total: number;
      page: number;
    }>(`/journals/search`, {
      ...this.getConfig(token),
      params: { q: query, page, limit },
    });
    return data;
  }

  // Mood
  async getMoodCategories(token?: string) {
    const { data } = await this.axiosInstance.get<MoodCategory[]>(
      '/moods/categories',
      this.getConfig(token)
    );
    return data;
  }

  async getMoods(token?: string) {
    const { data } = await this.axiosInstance.get<Mood[]>('/moods', this.getConfig(token));
    return data;
  }

  async createMoodEntry(moodData: Partial<MoodEntry>, token?: string) {
    const { data } = await this.axiosInstance.post<MoodEntry>(
      '/moods/entries',
      moodData,
      this.getConfig(token)
    );
    return data;
  }

  async getMoodEntries(startDate?: string, endDate?: string, token?: string) {
    const { data } = await this.axiosInstance.get<MoodEntry[]>('/moods/entries', {
      ...this.getConfig(token),
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    return data;
  }

  async getMoodEntry(id: number, token?: string) {
    const { data } = await this.axiosInstance.get<MoodEntry>(
      `/moods/entries/${id}`,
      this.getConfig(token)
    );
    return data;
  }

  async updateMoodEntry(id: number, moodData: Partial<MoodEntry>, token?: string) {
    const { data } = await this.axiosInstance.put<MoodEntry>(
      `/moods/entries/${id}`,
      moodData,
      this.getConfig(token)
    );
    return data;
  }

  async deleteMoodEntry(id: number, token?: string) {
    const { data } = await this.axiosInstance.delete<{ success: boolean }>(
      `/moods/entries/${id}`,
      this.getConfig(token)
    );
    return data;
  }

  // Goals
  async getGoals(status?: string, token?: string) {
    const { data } = await this.axiosInstance.get<Goal[]>('/goals', {
      ...this.getConfig(token),
      params: status ? { status } : {},
    });
    return data;
  }

  async getGoal(id: number, token?: string) {
    const { data } = await this.axiosInstance.get<Goal>(
      `/goals/${id}`,
      this.getConfig(token)
    );
    return data;
  }

  async createGoal(goalData: Partial<Goal>, token?: string) {
    const { data } = await this.axiosInstance.post<Goal>(
      '/goals',
      goalData,
      this.getConfig(token)
    );
    return data;
  }

  async updateGoal(id: number, goalData: Partial<Goal>, token?: string) {
    const { data } = await this.axiosInstance.put<Goal>(
      `/goals/${id}`,
      goalData,
      this.getConfig(token)
    );
    return data;
  }

  async deleteGoal(id: number, token?: string) {
    const { data } = await this.axiosInstance.delete<{ success: boolean }>(
      `/goals/${id}`,
      this.getConfig(token)
    );
    return data;
  }

  // Lessons
  async getLessons(category?: number, token?: string) {
    const { data } = await this.axiosInstance.get<Lesson[]>('/lessons', {
      ...this.getConfig(token),
      params: category ? { category } : {},
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

  async markLessonProgress(lessonId: number, progressData: any, token?: string) {
    const { data } = await this.axiosInstance.post(
      `/lessons/${lessonId}/progress`,
      progressData,
      this.getConfig(token)
    );
    return data;
  }

  // Meditation
  async getMeditationTechniques(token?: string) {
    const { data } = await this.axiosInstance.get(
      '/meditation/techniques',
      this.getConfig(token)
    );
    return data;
  }

  async createMeditationSession(sessionData: Partial<MeditationSession>, token?: string) {
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
        params: {
          start_date: startDate,
          end_date: endDate,
        },
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

  // User Stats
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
      params: { period },
    });
    return data;
  }

  async updateUserProfile(profileData: Partial<User>, token?: string) {
    const { data } = await this.axiosInstance.put<User>(
      '/user/profile',
      profileData,
      this.getConfig(token)
    );
    return data;
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    token?: string
  ) {
    const { data } = await this.axiosInstance.post(
      '/user/change-password',
      { current_password: currentPassword, new_password: newPassword },
      this.getConfig(token)
    );
    return data;
  }
}

export const apiClient = new APIClient();