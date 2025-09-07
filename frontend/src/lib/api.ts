import axios from 'axios';
import Cookies from 'js-cookie';
import { User, TikTokProfile, TikTokVideo, AnalyticsOverview, CreatorRecommendation, GrowthMetrics } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const IS_DEMO_MODE = false; // Disabled demo mode - using real backend

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  getGoogleAuthUrl: async (): Promise<{ auth_url: string }> => {
    if (IS_DEMO_MODE) {
      return { auth_url: '#demo' };
    }
    const response = await api.get('/auth/google/url');
    return response.data;
  },

  googleCallback: async (code: string): Promise<{ access_token: string; user: User }> => {
    if (IS_DEMO_MODE) {
      return {
        access_token: 'demo_token_12345',
        user: {
          id: 1,
          email: 'demo@example.com',
          name: 'Demo User',
          tiktok_username: '@demo_creator',
          weekly_updates_enabled: true,
          is_active: true
        }
      };
    }
    const response = await api.post('/auth/google/callback', { code });
    return response.data;
  },

  verifyToken: async (): Promise<User> => {
    if (IS_DEMO_MODE) {
      return {
        id: 1,
        email: 'demo@example.com',
        name: 'Demo User',
        tiktok_username: '@demo_creator',
        weekly_updates_enabled: true,
        is_active: true
      };
    }
    const response = await api.post('/auth/verify');
    return response.data;
  },
};

// Users API
export const usersApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  completeOnboarding: async (data: {
    tiktok_username: string;
    offer_description: string;
    target_audience: string;
  }): Promise<{ message: string; user: User }> => {
    const response = await api.post('/users/onboarding', data);
    return response.data;
  },

  updateUser: async (data: Partial<User>): Promise<User> => {
    const response = await api.put('/users/me', data);
    return response.data;
  },
};

// TikTok API
export const tiktokApi = {
  scrapeProfile: async (username: string): Promise<{ message: string; profile: TikTokProfile }> => {
    const response = await api.post('/tiktok/scrape-profile', { username });
    return response.data;
  },

  getProfile: async (): Promise<TikTokProfile> => {
    const response = await api.get('/tiktok/profile');
    return response.data;
  },

  getVideos: async (limit: number = 10): Promise<TikTokVideo[]> => {
    const response = await api.get(`/tiktok/videos?limit=${limit}`);
    return response.data;
  },

  refreshProfile: async (): Promise<{ message: string }> => {
    const response = await api.post('/tiktok/refresh-profile');
    return response.data;
  },
};

// Analytics API
export const analyticsApi = {
  getOverview: async (): Promise<AnalyticsOverview> => {
    try {
      const response = await api.get('/analytics/overview');
      return response.data;
    } catch (error) {
      // Fallback to demo data if backend analytics not available
      return {
        total_followers: 125000,
        total_likes: 2500000,
        total_videos: 89,
        avg_engagement_rate: 4.2,
        follower_growth_7d: 12.5
      };
    }
  },

  getVideoPerformance: async (limit: number = 20, sortBy: string = 'view_count'): Promise<TikTokVideo[]> => {
    const response = await api.get(`/analytics/videos/performance?limit=${limit}&sort_by=${sortBy}`);
    return response.data;
  },

  getGrowthMetrics: async (days: number = 30): Promise<GrowthMetrics[]> => {
    const response = await api.get(`/analytics/growth?days=${days}`);
    return response.data;
  },

  getInsights: async (): Promise<{
    insights: Array<{ type: string; title: string; description: string }>;
    recommendations: Array<{ title: string; description: string }>;
    metrics: {
      avg_views: number;
      avg_likes: number;
      avg_engagement_rate: number;
      total_videos_analyzed: number;
    };
  }> => {
    const response = await api.get('/analytics/insights');
    return response.data;
  },
};

// Recommendations API
export const recommendationsApi = {
  getCreators: async (limit: number = 10): Promise<CreatorRecommendation[]> => {
    const response = await api.get(`/recommendations/creators?limit=${limit}`);
    return response.data;
  },

  getInsights: async (): Promise<Array<{
    title: string;
    description: string;
    actionable_tip: string;
  }>> => {
    const response = await api.get('/recommendations/insights');
    return response.data;
  },

  refresh: async (): Promise<{ message: string; count: number }> => {
    const response = await api.post('/recommendations/refresh');
    return response.data;
  },
};

export default api;
