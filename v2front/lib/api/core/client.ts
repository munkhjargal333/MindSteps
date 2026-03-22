import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_SITE_URL + '/api/v1/' || 'http://127.0.0.1:8080/api/v1/';

export class BaseAPIClient {
  protected axiosInstance: AxiosInstance;
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

    this.setupInterceptors();
  }

  private setupInterceptors() {
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

  protected getConfig(token?: string): AxiosRequestConfig {
    const authToken = token || this.token;
    return authToken ? {
      headers: { Authorization: `Bearer ${authToken}` }
    } : {};
  }
}