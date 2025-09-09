'use client';

import { useState, useEffect } from 'react';
import { analyticsApi } from '@/lib/api';
import { Tooltip } from '@/components/Tooltip';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  TrendingUp, 
  Users, 
  Heart, 
  Video, 
  ArrowLeft,
  Target,
  Eye
} from 'lucide-react';
import { formatNumber, formatPercentage } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('followers');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await analyticsApi.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Don't use fallback demo data - show error instead
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  const getTooltipContent = (key: string, analytics: any) => {
    switch (key) {
      case 'followers':
        return 'Total number of people following your TikTok account. This data is scraped directly from your TikTok profile page.';
      case 'likes':
        return 'Total likes received across all your TikTok videos. This is the cumulative number displayed on your profile page.';
      case 'videos':
        return 'Total number of videos published on your TikTok account. This count is scraped from your profile page.';
      case 'engagement':
        return `Average engagement rate calculated as: (Likes + Comments + Shares) ÷ Views × 100. ${analytics?.is_estimated ? 'Currently estimated at 4% (industry average) due to limited engagement data from TikTok profile pages.' : 'Based on actual video engagement data.'}`;
      default:
        return 'Analytics metric calculated from your TikTok data.';
    }
  };

  const metrics = [
    { key: 'followers', label: 'Followers', icon: Users, value: analytics?.total_followers },
    { key: 'likes', label: 'Likes', icon: Heart, value: analytics?.total_likes },
    { key: 'videos', label: 'Videos', icon: Video, value: analytics?.total_videos },
    { key: 'engagement', label: 'Engagement Rate', icon: TrendingUp, value: analytics?.avg_engagement_rate, isPercentage: true }
  ];

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Detailed Analytics</h1>
        <p className="mt-2 text-gray-600">
          Deep dive into your TikTok performance metrics and audience insights.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <Card key={metric.key} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Tooltip content={getTooltipContent(metric.key, analytics)}>
                    <p className="text-sm font-medium text-gray-600 cursor-help">{metric.label} ℹ️</p>
                  </Tooltip>
                  <p className="text-3xl font-bold text-gray-900">
                    {metric.isPercentage 
                      ? formatPercentage(metric.value) 
                      : formatNumber(metric.value)
                    }
                    {metric.key === 'engagement' && analytics?.is_estimated && <span className="text-sm text-orange-500 ml-1">*</span>}
                  </p>
                </div>
                <metric.icon className="w-8 h-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Target Audience Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary-600" />
              Target Audience Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Followers from Target Audience</p>
                  <p className="text-sm text-gray-600">
                    Based on profile analysis of bio, content, and demographics
                  </p>
                </div>
                <div className="text-2xl font-bold text-primary-600">
                  {formatPercentage(analytics?.target_audience_followers)}
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Likes from Target Audience</p>
                  <p className="text-sm text-gray-600">
                    Engagement from your ideal audience segment
                  </p>
                </div>
                <div className="text-2xl font-bold text-primary-600">
                  {formatPercentage(analytics?.target_audience_likes)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Growth Insights with Metric Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
              Growth Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Metric to Analyze
                </label>
                <select 
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="followers">Followers Growth</option>
                  <option value="likes">Likes Growth</option>
                  <option value="engagement">Engagement Rate</option>
                  <option value="videos">Video Performance</option>
                </select>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-800">
                    {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Growth
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    +{formatPercentage(analytics?.follower_growth_rate)}
                  </span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  Compared to last 30 days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Videos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Video className="w-5 h-5 mr-2 text-primary-600" />
            Top Performing Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-w-9 aspect-h-16 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                  <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <Video className="w-12 h-12 text-primary-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    Video #{i} - Sample Title
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      {formatNumber(Math.floor(Math.random() * 100000) + 10000)}
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {formatNumber(Math.floor(Math.random() * 500000) + 50000)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
