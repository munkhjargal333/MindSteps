import { BaseAPIClient } from '../core/client';
import { ApiResponse, GoalListResponse, GoalStatistics, MilestoneCompleteResponse } from '../core/types';
import { Goal, Milestone } from '@/lib/types';

export class GoalsAPI extends BaseAPIClient {
  // ==================== GOALS ====================
  
  /**
   * Get all user goals
   */
  async getGoals(token?: string) {
    const { data } = await this.axiosInstance.get<GoalListResponse>(
      '/goals/me',
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Get goal statistics
   */
  async getGoalStatistics(token?: string) {
    const { data } = await this.axiosInstance.get<{ 
      success: boolean; 
      statistics: GoalStatistics 
    }>(
      '/goals/statistics',
      this.getConfig(token)
    );
    return data.statistics;
  }

  /**
   * Get single goal by ID
   */
  async getGoal(id: number, token?: string) {
    const { data } = await this.axiosInstance.get<{ 
      success: boolean; 
      goal: Goal 
    }>(
      `/goals/${id}`,
      this.getConfig(token)
    );
    return data.goal;
  }

  /**
   * Create new goal
   */
  async createGoal(
    goalData: {
      value_id?: number;
      title: string;
      description?: string;
      goal_type: string;
      target_date?: string;
      priority: string;
      is_public?: boolean;
    }, 
    token?: string
  ) {
    const { data } = await this.axiosInstance.post<{ 
      success: boolean; 
      goal: Goal 
    }>(
      '/goals',
      goalData,
      this.getConfig(token)
    );
    return data.goal;
  }

  /**
   * Update goal
   */
  async updateGoal(id: number, goalData: Partial<Goal>, token?: string) {
    const { data } = await this.axiosInstance.put<{ 
      success: boolean; 
      goal: Goal 
    }>(
      `/goals/${id}`,
      goalData,
      this.getConfig(token)
    );
    return data.goal;
  }

  /**
   * Delete goal
   */
  async deleteGoal(id: number, token?: string) {
    const { data } = await this.axiosInstance.delete<ApiResponse<any>>(
      `/goals/${id}`, 
      this.getConfig(token)
    );
    return data;
  }

  /**
   * Pause goal
   */
  async pauseGoal(id: number, token?: string) {
    const { data } = await this.axiosInstance.post<{ 
      success: boolean; 
      goal: Goal 
    }>(
      `/goals/${id}/pause`,
      {},
      this.getConfig(token)
    );
    return data.goal;
  }

  /**
   * Resume goal
   */
  async resumeGoal(id: number, token?: string) {
    const { data } = await this.axiosInstance.post<{ 
      success: boolean; 
      goal: Goal 
    }>(
      `/goals/${id}/resume`,
      {},
      this.getConfig(token)
    );
    return data.goal;
  }

  // ==================== MILESTONES ====================
  
  /**
   * Create milestone for goal
   */
  async createMilestone(
    goalId: number, 
    milestoneData: {
      title: string;
      description?: string;
      target_date?: string;
      sort_order: number;
    }, 
    token?: string
  ) {
    const { data } = await this.axiosInstance.post<{ 
      success: boolean; 
      milestone: Milestone 
    }>(
      `/goals/${goalId}/milestones`,
      milestoneData,
      this.getConfig(token)
    );
    return data.milestone;
  }

  /**
   * Update milestone
   */
  async updateMilestone(
    milestoneId: number, 
    milestoneData: Partial<Milestone>, 
    token?: string
  ) {
    const { data } = await this.axiosInstance.put<{ 
      success: boolean; 
      milestone: Milestone 
    }>(
      `/goals/milestones/${milestoneId}`,
      milestoneData,
      this.getConfig(token)
    );
    return data.milestone;
  }

  /**
   * Complete milestone
   */
  async completeMilestone(milestoneId: number, token?: string) {
    const { data } = await this.axiosInstance.post<MilestoneCompleteResponse>(
      `/goals/milestones/${milestoneId}/complete`,
      {},
      this.getConfig(token)
    );
    return data;
  }
}