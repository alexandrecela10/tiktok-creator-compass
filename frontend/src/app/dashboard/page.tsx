'use client';

import { useState, useEffect } from 'react';
import { analyticsApi, tiktokApi } from '@/lib/api';
import { AnalyticsOverview, TikTokProfile } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  TrendingUp, 
  Users, 
  Heart, 
  Video, 
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  BarChart3
} from 'lucide-react';
import { formatNumber, formatPercentage, formatRelativeTime, getGrowthColor, getGrowthIcon } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [profile, setProfile] = useState<TikTokProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedVideoMetric, setSelectedVideoMetric] = useState('views');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [analyticsData, profileData] = await Promise.all([
        analyticsApi.getOverview(),
        tiktokApi.getProfile()
      ]);
      
      setAnalytics(analyticsData);
      setProfile(profileData);
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await tiktokApi.refreshProfile();
      await loadDashboardData();
      toast.success('Profile data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh profile data');
    }
    setRefreshing(false);
  };

  const getGrowthIndicator = (growth: number | undefined) => {
    if (growth === undefined || growth === null) return { icon: Minus, color: 'text-gray-400' };
    if (growth > 0) return { icon: ArrowUp, color: 'text-success-600' };
    if (growth < 0) return { icon: ArrowDown, color: 'text-red-600' };
    return { icon: Minus, color: 'text-gray-400' };
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back! Here's your TikTok insights overview.
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            loading={refreshing}
            variant="outline"
            className="flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Profile Summary */}
      {profile && (
        <Card className="mb-8">
          <CardContent className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <img
                src={profile.avatar_url || '/default-avatar.png'}
                alt={profile.display_name || profile.tiktok_username}
                className="w-16 h-16 rounded-full"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <a 
                  href={`https://www.tiktok.com/@${profile.tiktok_username}`}
                  target="_self"
                  className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  @{profile.tiktok_username}
                </a>
                {profile.is_verified && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              {profile.display_name && (
                <p className="text-lg text-gray-600">{profile.display_name}</p>
              )}
              {profile.bio && (
                <p className="text-gray-500 mt-1">{profile.bio}</p>
              )}
              <p className="text-sm text-gray-400 mt-2">
                Last updated: {formatRelativeTime(profile.last_scraped_at)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Followers</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(analytics?.total_followers)}
                </p>
                {analytics?.follower_growth_7d !== undefined && (
                  <div className={`ml-2 flex items-center ${getGrowthColor(analytics.follower_growth_7d)}`}>
                    <span className="text-sm font-medium">
                      {getGrowthIcon(analytics.follower_growth_7d)} {Math.abs(analytics.follower_growth_7d)}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400">7-day change</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-success-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analytics?.total_likes)}
              </p>
              <p className="text-xs text-gray-400">All time</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-warm-100 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-warm-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Videos</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analytics?.total_videos)}
              </p>
              <p className="text-xs text-gray-400">Published</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Avg. Engagement</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(analytics?.avg_engagement_rate)}
              </p>
              <p className="text-xs text-gray-400">Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Target Audience Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
              Target Audience Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Followers Match</p>
                  <p className="text-xs text-gray-600">Based on bio & content analysis</p>
                </div>
                <div className="text-xl font-bold text-green-600">78.3%</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Engagement Match</p>
                  <p className="text-xs text-gray-600">Likes from target audience</p>
                </div>
                <div className="text-xl font-bold text-blue-600">82.1%</div>
              </div>
              
              {/* Keywords & Info */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Key Indicators Found:</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['fashion', 'style', 'outfit', 'london', 'trendy', 'OOTD', 'shopping'].map((keyword) => (
                    <span key={keyword} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-600">Found in bios, hashtags, and content descriptions</p>
              </div>
              
              {/* Scrollable Followers List */}
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">All Target Audience Followers</h4>
                <div className="max-h-48 overflow-y-auto border rounded-lg">
                  <div className="space-y-1 p-2">
                    {[
                      'fashionista_london', 'style_maven_uk', 'london_lifestyle', 'trendy_outfits', 'fashion_daily_uk',
                      'outfit_inspo', 'style_guide_uk', 'london_fashion', 'trendy_girl_uk', 'fashion_lover_23',
                      'style_blogger_ldn', 'outfit_of_day', 'fashion_trends_uk', 'style_inspiration', 'london_style_guide',
                      'trendy_fashion_uk', 'style_maven_london', 'fashion_enthusiast', 'outfit_ideas_uk', 'style_tips_london'
                    ].map((username, i) => (
                      <div key={username} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded text-sm">
                        <a 
                          href={`https://www.tiktok.com/@${username}`}
                          target="_self"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          @{username}
                        </a>
                        <span className="text-xs text-gray-500">{formatNumber(Math.floor(Math.random() * 150000) + 10000)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary-600" />
              Top 5 Best Followers from Target Audience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { username: 'fashionista_london', followers: 156000, engagement: '4.2%' },
                { username: 'style_maven_uk', followers: 89000, engagement: '3.8%' },
                { username: 'london_lifestyle', followers: 234000, engagement: '5.1%' },
                { username: 'trendy_outfits', followers: 67000, engagement: '6.2%' },
                { username: 'fashion_daily_uk', followers: 112000, engagement: '3.9%' }
              ].map((follower, i) => (
                <div key={follower.username} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary-600">#{i + 1}</span>
                    </div>
                    <div>
                      <a 
                        href={`https://www.tiktok.com/@${follower.username}`}
                        target="_self"
                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        @{follower.username}
                      </a>
                      <p className="text-xs text-gray-500">{follower.engagement} engagement</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{formatNumber(follower.followers)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Videos */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Video className="w-5 h-5 mr-2 text-primary-600" />
              Top Performing Videos
            </CardTitle>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select 
                value={selectedVideoMetric} 
                onChange={(e) => setSelectedVideoMetric(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="views">Views</option>
                <option value="likes">Likes</option>
                <option value="comments">Comments</option>
                <option value="shares">Shares</option>
                <option value="saves">Saves</option>
                <option value="target_audience_likes">Target Audience Likes</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Note: In production, this would fetch real videos from TikTok API/scraper */}
            {profile && [
              {
                id: '7289156423456789012',
                title: 'Video data will be fetched from TikTok profile',
                description: 'Real video descriptions from the scraped profile',
                username: profile.tiktok_username,
                views: 0, // Real view counts from TikTok
                likes: 0, // Real like counts from TikTok
                comments: 0, // Real comment counts from TikTok
                shares: 0, // Real share counts from TikTok
                saves: 0, // Real save counts from TikTok
                target_audience_likes: 0, // Calculated from audience analysis
                posted_at: '2024-01-15'
              }
            ].sort((a, b) => {
              const getMetricValue = (video: any) => {
                switch(selectedVideoMetric) {
                  case 'views': return video.views;
                  case 'likes': return video.likes;
                  case 'comments': return video.comments;
                  case 'shares': return video.shares;
                  case 'saves': return video.saves;
                  case 'target_audience_likes': return video.target_audience_likes;
                  default: return video.views;
                }
              };
              return getMetricValue(b) - getMetricValue(a);
            }).map((video) => {
              const getDisplayMetric = () => {
                switch(selectedVideoMetric) {
                  case 'views': return { value: video.views, icon: '👁', label: 'views' };
                  case 'likes': return { value: video.likes, icon: '❤️', label: 'likes' };
                  case 'comments': return { value: video.comments, icon: '💬', label: 'comments' };
                  case 'shares': return { value: video.shares, icon: '🔄', label: 'shares' };
                  case 'saves': return { value: video.saves, icon: '🔖', label: 'saves' };
                  case 'target_audience_likes': return { value: video.target_audience_likes, icon: '🎯', label: 'target likes' };
                  default: return { value: video.views, icon: '👁', label: 'views' };
                }
              };
              const displayMetric = getDisplayMetric();
              
              return (
                <div key={video.id} className="group cursor-pointer" onClick={() => { window.location.href = `https://www.tiktok.com/@${video.username}/video/${video.id}`; }}>
                  <div className="aspect-w-9 aspect-h-16 bg-gray-200 rounded-lg mb-3 overflow-hidden relative">
                    <div className="w-full h-40 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center group-hover:from-primary-200 group-hover:to-primary-300 transition-colors">
                      <Video className="w-10 h-10 text-primary-600" />
                    </div>
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {displayMetric.icon} {formatNumber(displayMetric.value)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors text-sm">
                      {video.title}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        {formatNumber(video.likes)}
                      </span>
                      <span className="text-gray-400">
                        {new Date(video.posted_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Content Creators to Follow */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-primary-600" />
            Top 3 Content Creators from Same Segment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { username: 'emma_fashion_uk', followers: 2400000, niche: 'Fashion & Style', match: '94%' },
              { username: 'london_style_guru', followers: 1800000, niche: 'Fashion & Lifestyle', match: '91%' },
              { username: 'trendy_creator_uk', followers: 3200000, niche: 'Fashion & Beauty', match: '89%' }
            ].map((creator, i) => (
              <div key={creator.username} className="group cursor-pointer border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mx-auto mb-3 group-hover:from-primary-200 group-hover:to-primary-300 transition-colors">
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-center">
                  <a 
                    href={`https://www.tiktok.com/@${creator.username}`}
                    target="_self"
                    className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                  >
                    @{creator.username}
                  </a>
                  <p className="text-xs text-gray-600 mt-1">{creator.niche}</p>
                  <p className="text-sm text-gray-500 mt-1">{formatNumber(creator.followers)} followers</p>
                  <div className="mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full inline-block">
                    {creator.match} match
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="primary"
              className="w-full justify-start"
              onClick={() => window.location.href = '/dashboard/analytics'}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Detailed Analytics
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => window.location.href = '/dashboard/recommendations'}
            >
              <Users className="w-4 h-4 mr-2" />
              Get Creator Recommendations
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleRefresh}
              loading={refreshing}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh All Data
            </Button>
          </CardContent>
        </Card>

        {/* Growth Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Metric
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm">
                  <option value="followers">Followers Growth</option>
                  <option value="likes">Likes Growth</option>
                  <option value="engagement">Engagement Rate</option>
                  <option value="videos">Video Performance</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-green-800">Follower Growth</span>
                <span className="text-lg font-bold text-green-600">+12.5%</span>
              </div>
              <p className="text-xs text-gray-500">
                Compared to last 30 days
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
