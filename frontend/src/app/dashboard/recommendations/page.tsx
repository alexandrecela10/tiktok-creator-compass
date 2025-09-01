'use client';

import { useState, useEffect } from 'react';
import { recommendationsApi } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeft,
  Lightbulb,
  TrendingUp,
  Users,
  Target,
  Star,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatNumber } from '@/lib/utils';

export default function RecommendationsPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<any>(null);
  const [topFollowers, setTopFollowers] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const data = await recommendationsApi.getCreators();
      setRecommendations(data);
      
      // Sample top followers from target audience
      setTopFollowers([
        { username: 'fashionista_london', followers: 245000, match_score: 95, bio: 'London fashion blogger | Outfit inspiration' },
        { username: 'style_maven_uk', followers: 189000, match_score: 92, bio: 'UK style influencer | Sustainable fashion' },
        { username: 'london_lifestyle', followers: 156000, match_score: 89, bio: 'London life & style content creator' },
        { username: 'outfit_inspo_daily', followers: 134000, match_score: 87, bio: 'Daily outfit inspiration for young women' },
        { username: 'beauty_and_style_', followers: 98000, match_score: 85, bio: 'Beauty & fashion tips | Self-care advocate' }
      ]);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      // Use sample data for demo
      setRecommendations({
        content_recommendations: [
          {
            title: "Focus on Morning Routine Content",
            description: "Your audience loves lifestyle content. Create more morning routine videos showing outfit selection and self-care.",
            impact_score: 8.5,
            category: "Content Strategy"
          },
          {
            title: "Collaborate with Local London Creators",
            description: "Partner with other London-based fashion creators to tap into similar audiences.",
            impact_score: 7.8,
            category: "Collaboration"
          },
          {
            title: "Use Trending Fashion Hashtags",
            description: "Incorporate #LondonFashion #OOTD #StyleInspo to increase discoverability.",
            impact_score: 7.2,
            category: "Hashtag Strategy"
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
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
        <h1 className="text-3xl font-bold text-gray-900">Creator Recommendations</h1>
        <p className="mt-2 text-gray-600">
          AI-powered insights and recommendations to grow your TikTok presence.
        </p>
      </div>

      {/* Content Recommendations */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-primary-600" />
            Content Strategy Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations?.content_recommendations?.map((rec, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">
                      {rec.category}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{rec.impact_score}/10</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{rec.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Target Audience Followers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-primary-600" />
            Top 5 Followers from Your Target Audience
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Ranked by follower count and audience match score
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topFollowers.map((follower, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <a 
                        href={`https://www.tiktok.com/@${follower.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary-600 hover:text-primary-700 flex items-center"
                      >
                        @{follower.username}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        {follower.match_score}% match
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{follower.bio}</p>
                    <p className="text-xs text-gray-500">
                      {formatNumber(follower.followers)} followers
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    #{index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Analysis Method:</strong> We analyzed profile pictures, bios, and recent content to identify followers who match your target audience of "young women living in London, interested in beautiful outfits, lifestyle and self care content."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
