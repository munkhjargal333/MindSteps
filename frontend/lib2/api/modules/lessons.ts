import { BaseAPIClient } from '../core/client';
import { LessonListResponse, CategoriesList, CreateLessonData, UpdateLessonData } from '../core/types';
import { Lesson, CompleteLessonPayload } from '@/lib/types';

export class LessonsAPI extends BaseAPIClient {
  // ==================== LESSON CATEGORIES ====================
  
  /**
   * Get all lesson categories
   */
  async getLessonCategories(token?: string) {
    const { data } = await this.axiosInstance.get<CategoriesList>(
      '/lessons/category',
      this.getConfig(token)
    );
    return data;
  }

  // ==================== LESSONS ====================
  
  /**
   * Get lessons with optional category filter
   */
  async getLessons(
    page = 1, 
    limit = 10, 
    token: string, 
    categoryId?: number, 
    isParent?: boolean
  ) {
    let url = `/lessons?page=${page}&limit=${limit}`;

    if (categoryId) {
      url = isParent 
        ? `/lessons/parent/${categoryId}?page=${page}&limit=${limit}` 
        : `/lessons/category/${categoryId}?page=${page}&limit=${limit}`;
    }

    const { data } = await this.axiosInstance.get<LessonListResponse>(
      url, 
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Get lessons by category
   */
  async getLessonsByCategory(categoryId: number, token?: string) {
    const { data } = await this.axiosInstance.get<Lesson[]>(
      `/lessons/category/${categoryId}`,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Get single lesson by ID
   */
  async getLesson(id: number, token?: string) {
    const { data } = await this.axiosInstance.get<Lesson>(
      `/lessons/${id}`,
      this.getConfig(token)
    );
    return data;
  }

  // ==================== USER LESSON PROGRESS ====================
  
  /**
   * Mark lesson progress
   */
  async markLessonProgress(
    lessonId: number, 
    progressData: {
      progress_percentage?: number;
      status?: string;
      time_spent?: number;
    }, 
    token?: string
  ) {
    const { data } = await this.axiosInstance.post(
      `/lessons/${lessonId}/progress`,
      progressData,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Complete lesson
   */
  async completeLesson(payload: CompleteLessonPayload, token?: string) {
    const { data } = await this.axiosInstance.post(
      `/lessons/complete`,
      payload,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Rate lesson
   */
  async rateLesson(lessonId: number, rating: number, review?: string, token?: string) {
    const { data } = await this.axiosInstance.post(
      `/lessons/${lessonId}/rate`,
      { rating, review },
      this.getConfig(token)
    );
    return data;
  }

  // ==================== ADMIN LESSON MANAGEMENT ====================
  
  /**
   * Create lesson (Admin)
   */
  async createLesson(lessonData: CreateLessonData, token?: string) {
    const formData = this.buildLessonFormData(lessonData);

    const { data } = await this.axiosInstance.post<Lesson>(
      '/admin/lessons',
      formData,
      {
        ...this.getConfig(token),
        headers: {
          ...this.getConfig(token).headers,
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    return data;
  }

  /**
   * Create lesson with file uploads (Admin)
   */
  async createLessonWithFiles(
    lessonData: CreateLessonData,
    files?: {
      thumbnail?: File;
      media?: File;
    },
    token?: string
  ) {
    const formData = this.buildLessonFormData(lessonData);
    
    // Add file uploads
    if (files?.thumbnail) {
      formData.append('thumbnail', files.thumbnail);
    }
    
    if (files?.media) {
      formData.append('media', files.media);
    }

    const { data } = await this.axiosInstance.post<Lesson>(
      '/admin/lessons',
      formData,
      {
        ...this.getConfig(token),
        headers: {
          ...this.getConfig(token).headers,
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    return data;
  }

  /**
   * Update lesson (Admin)
   */
  async updateLesson(
    id: number,
    lessonData: UpdateLessonData,
    files?: {
      thumbnail?: File;
      media?: File;
    },
    token?: string
  ) {
    const formData = this.buildLessonFormData(lessonData, true);
    
    // Add file uploads
    if (files?.thumbnail) {
      formData.append('thumbnail', files.thumbnail);
    }
    
    if (files?.media) {
      formData.append('media', files.media);
    }

    const { data } = await this.axiosInstance.put<Lesson>(
      `/admin/lessons/${id}`,
      formData,
      {
        ...this.getConfig(token),
        headers: {
          ...this.getConfig(token).headers,
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    return data;
  }

  /**
   * Delete lesson (Admin)
   */
  async deleteLesson(id: number, token?: string) {
    const { data } = await this.axiosInstance.delete<{ message: string }>(
      `/admin/lessons/${id}`,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Delete lesson thumbnail (Admin)
   */
  async deleteLessonThumbnail(id: number, token?: string) {
    const { data } = await this.axiosInstance.delete<{ message: string }>(
      `/admin/lessons/${id}/thumbnail`,
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Delete lesson media (Admin)
   */
  async deleteLessonMedia(id: number, token?: string) {
    const { data } = await this.axiosInstance.delete<{ message: string }>(
      `/admin/lessons/${id}/media`,
      this.getConfig(token)
    );
    return data;
  }

  // ==================== HELPER METHODS ====================
  
  /**
   * Build FormData for lesson creation/update
   */
  private buildLessonFormData(
    lessonData: CreateLessonData | UpdateLessonData, 
    isUpdate = false
  ): FormData {
    const formData = new FormData();
    
    // Required fields for creation
    if (!isUpdate) {
      formData.append('title', (lessonData as CreateLessonData).title);
      formData.append('category_id', (lessonData as CreateLessonData).category_id.toString());
      formData.append('content', (lessonData as CreateLessonData).content);
      formData.append('lesson_type', (lessonData as CreateLessonData).lesson_type);
      formData.append('difficulty_level', (lessonData as CreateLessonData).difficulty_level);
    }
    
    // Optional fields
    if (lessonData.title) formData.append('title', lessonData.title);
    if (lessonData.category_id) formData.append('category_id', lessonData.category_id.toString());
    if (lessonData.slug) formData.append('slug', lessonData.slug);
    if (lessonData.description !== undefined) formData.append('description', lessonData.description);
    if (lessonData.content) formData.append('content', lessonData.content);
    if (lessonData.lesson_type) formData.append('lesson_type', lessonData.lesson_type);
    if (lessonData.difficulty_level) formData.append('difficulty_level', lessonData.difficulty_level);
    if (lessonData.required_level !== undefined) formData.append('required_level', lessonData.required_level.toString());
    if (lessonData.estimated_duration !== undefined) formData.append('estimated_duration', lessonData.estimated_duration.toString());
    if (lessonData.points_reward !== undefined) formData.append('points_reward', lessonData.points_reward.toString());
    if (lessonData.sort_order !== undefined) formData.append('sort_order', lessonData.sort_order.toString());
    if (lessonData.media_url) formData.append('media_url', lessonData.media_url);
    if (lessonData.thumbnail_url) formData.append('thumbnail_url', lessonData.thumbnail_url);
    if (lessonData.related_value_keywords !== undefined) formData.append('related_value_keywords', lessonData.related_value_keywords);
    if (lessonData.related_emotion_keywords !== undefined) formData.append('related_emotion_keywords', lessonData.related_emotion_keywords);
    if (lessonData.is_premium !== undefined) formData.append('is_premium', lessonData.is_premium ? 'true' : 'false');
    if (lessonData.is_published !== undefined) formData.append('is_published', lessonData.is_published ? 'true' : 'false');
    
    // Add tags
    if (lessonData.tags && lessonData.tags.length > 0) {
      lessonData.tags.forEach(tag => formData.append('tags[]', tag));
    }

    return formData;
  }
}