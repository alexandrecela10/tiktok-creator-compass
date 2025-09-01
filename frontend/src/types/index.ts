export interface User {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
  tiktok_username?: string;
  offer_description?: string;
  target_audience?: string;
  weekly_updates_enabled: boolean;
  is_active: boolean;
}

export interface TikTokProfile {
  id: number;
  tiktok_username: string;
  display_name?: string;
  bio?: string;
  follower_count?: number;
  following_count?: number;
  likes_count?: number;
  video_count?: number;
  avatar_url?: string;
  is_verified: boolean;
  last_scraped_at?: string;
}

export interface TikTokVideo {
  id: number;
  video_id: string;
  video_url: string;
  description?: string;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  share_count?: number;
  engagement_rate?: number;
  posted_at?: string;
}

export interface AnalyticsOverview {
  total_followers?: number;
  total_videos?: number;
  total_likes?: number;
  avg_engagement_rate?: number;
  follower_growth_7d?: number;
  follower_growth_30d?: number;
  top_performing_video?: {
    video_id: string;
    video_url: string;
    description?: string;
    view_count?: number;
    like_count?: number;
    engagement_rate?: number;
  };
}

export interface CreatorRecommendation {
  id: number;
  recommended_username: string;
  recommended_display_name?: string;
  recommended_avatar_url?: string;
  similarity_score?: number;
  engagement_score?: number;
  growth_score?: number;
  success_factors: string[];
  content_themes: string[];
  posting_frequency?: string;
}

export interface GrowthMetrics {
  date: string;
  followers?: number;
  following?: number;
  videos?: number;
  avg_views?: number;
  avg_engagement?: number;
}

export interface PerformanceInsight {
  type: 'positive' | 'warning' | 'info';
  title: string;
  description: string;
}

export interface Recommendation {
  title: string;
  description: string;
}
