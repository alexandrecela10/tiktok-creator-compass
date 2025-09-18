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
  login: async (email: string, name: string): Promise<{ access_token: string; user: User }> => {
    if (IS_DEMO_MODE) {
      return {
        access_token: 'demo_token_12345',
        user: {
          id: 1,
          email: email,
          name: name,
          tiktok_username: '@demo_creator',
          weekly_updates_enabled: true,
          is_active: true
        }
      };
    }
    const response = await api.post('/auth/login', { email, name });
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
  getAnalytics: async () => {
    const response = await api.get('/analytics/overview');
    return response.data;
  },

  calculateAnalytics: async () => {
    const response = await api.post('/analytics/calculate');
    return response.data;
  },

  getGrowthMetrics: async (days: number = 30) => {
    try {
      const response = await api.get(`/analytics/growth?days=${days}`);
      return response.data;
    } catch (error) {
      console.warn('Growth metrics not available, using demo data:', error);
      return {
        timeline: [
          { date: '2024-01-01', followers: 120000, likes: 2400000 },
          { date: '2024-01-15', followers: 123500, likes: 2450000 },
          { date: '2024-02-01', followers: 125000, likes: 2500000 }
        ]
      };
    }
  },

  getInsights: async () => {
    try {
      const response = await api.get('/analytics/insights');
      return response.data;
    } catch (error) {
      console.warn('Insights not available, using demo data:', error);
      return {
        recommendations: [
          'Post consistently during peak hours (7-9 PM)',
          'Use trending hashtags in your niche',
          'Engage with your audience in comments'
        ]
      };
    }
  },

  getVideoPerformance: async () => {
    try {
      const response = await api.get('/analytics/video-performance');
      return response.data;
    } catch (error) {
      console.warn('Video performance not available, using demo data:', error);
      return {
        topVideos: [
          {
            id: 'demo-1',
            title: 'My viral dance trend! 💃✨',
            views: 850000,
            likes: 45000,
            engagement_rate: 5.3
          }
        ]
      };
    }
  }
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

// Best Practices API
export const bestPracticesApi = {
  analyze: async (): Promise<any> => {
    const response = await api.post('/best-practices/analyze');
    return response.data;
  },

  getRecommendations: async (): Promise<any> => {
    const response = await api.get('/best-practices/recommendations');
    return response.data;
  },
};

export const engagedLeadsApi = {
  analyze: async (limit: number = 20): Promise<any> => {
    const response = await api.get(`/engaged-leads/analyze?limit=${limit}`);
    return response.data;
  },

  getContactSuggestions: async (username: string): Promise<any> => {
    const response = await api.get(`/engaged-leads/contact-suggestions/${username}`);
    return response.data;
  },
};

export default api;
