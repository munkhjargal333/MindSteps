import { BaseAPIClient } from './core/client';
import { UserAPI } from './modules/user';
import { JournalAPI } from './modules/journals';
import { MoodAPI } from './modules/mood';
import { GoalsAPI } from './modules/goals';
import { CoreValuesAPI } from './modules/coreValues';
import { LessonsAPI } from './modules/lessons';
import { AdminAPI } from './modules/admin';

/**
 * Main API Client that combines all modules
 * Provides a single entry point for all backend API calls
 */
class APIClient extends BaseAPIClient {
  public user: UserAPI;
  public journals: JournalAPI;
  public mood: MoodAPI;
  public goals: GoalsAPI;
  public coreValues: CoreValuesAPI;
  public lessons: LessonsAPI;
  public admin: AdminAPI;

  constructor() {
    super();
    
    // Initialize all modules
    this.user = new UserAPI();
    this.journals = new JournalAPI();
    this.mood = new MoodAPI();
    this.goals = new GoalsAPI();
    this.coreValues = new CoreValuesAPI();
    this.lessons = new LessonsAPI();
    this.admin = new AdminAPI();

    // Share token across all modules
    this.syncTokenAcrossModules();
  }

  /**
   * Sync token across all modules when it changes
   */
  private syncTokenAcrossModules() {
    // Override setToken to sync across modules
    const originalSetToken = this.setToken.bind(this);
    this.setToken = (token: string) => {
      originalSetToken(token);
      this.user.setToken(token);
      this.journals.setToken(token);
      this.mood.setToken(token);
      this.goals.setToken(token);
      this.coreValues.setToken(token);
      this.lessons.setToken(token);
      this.admin.setToken(token);
    };

    // Override clearToken to sync across modules
    const originalClearToken = this.clearToken.bind(this);
    this.clearToken = () => {
      originalClearToken();
      this.user.clearToken();
      this.journals.clearToken();
      this.mood.clearToken();
      this.goals.clearToken();
      this.coreValues.clearToken();
      this.lessons.clearToken();
      this.admin.clearToken();
    };
  }

  /**
   * Health check endpoint
   */
  async healthCheck() {
    const { data } = await this.axiosInstance.get<{ status: string }>('/health');
    return data;
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export individual modules for tree-shaking
export { UserAPI } from './modules/user';
export { JournalAPI } from './modules/journals';
export { MoodAPI } from './modules/mood';
export { GoalsAPI } from './modules/goals';
export { CoreValuesAPI } from './modules/coreValues';
export { LessonsAPI } from './modules/lessons';
export { AdminAPI } from './modules/admin';

// Export types
export * from './core/types';

// Export class for testing or multiple instances
export { APIClient };