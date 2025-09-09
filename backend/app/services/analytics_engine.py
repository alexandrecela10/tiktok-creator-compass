from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.models.user import User
from app.models.tiktok_profile import TikTokProfile
from app.models.tiktok_video import TikTokVideo
from app.models.analytics import ProfileAnalytics
import statistics
import logging

logger = logging.getLogger(__name__)

class AnalyticsEngine:
    """
    Analytics engine for calculating TikTok growth metrics and insights
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def calculate_profile_analytics(self, user_id: int) -> Optional[Dict]:
        """Calculate comprehensive analytics for a user's TikTok profile"""
        try:
            # Get user's TikTok profile
            profile = self.db.query(TikTokProfile).filter(
                TikTokProfile.user_id == user_id
            ).first()
            
            if not profile:
                return None
            
            # Get historical analytics for growth calculation (skip for now since no ProfileAnalytics table)
            previous_analytics = []
            
            # Calculate current metrics
            current_metrics = self._calculate_current_metrics(profile)
            
            # Calculate growth metrics
            growth_metrics = self._calculate_growth_metrics(profile, previous_analytics)
            
            # Calculate video performance metrics
            video_metrics = self._calculate_video_metrics(profile.id)
            
            # Calculate engagement metrics
            engagement_metrics = self._calculate_engagement_metrics(profile.id)
            
            # Combine all metrics
            analytics = {
                **current_metrics,
                **growth_metrics,
                **video_metrics,
                **engagement_metrics,
                'profile_id': profile.id,
                'calculated_at': datetime.utcnow().isoformat()
            }
            
            # Store analytics in database
            self._store_analytics(profile.id, analytics)
            
            return analytics
            
        except Exception as e:
            logger.error(f"Error calculating analytics for user {user_id}: {str(e)}")
            return None
    
    def _calculate_current_metrics(self, profile: TikTokProfile) -> Dict:
        """Calculate current profile metrics"""
        return {
            'total_followers': profile.follower_count or 0,
            'total_following': profile.following_count or 0,
            'total_likes': profile.likes_count or 0,
            'total_videos': profile.video_count or 0,
            'is_verified': profile.is_verified or False,
            'username': profile.tiktok_username,
            'display_name': profile.display_name,
            'last_updated': profile.last_scraped_at.isoformat() if profile.last_scraped_at else None
        }
    
    def _calculate_growth_metrics(self, profile: TikTokProfile, previous_analytics: List) -> Dict:
        """Calculate growth metrics compared to previous periods"""
        growth_metrics = {
            'follower_growth_7d': 0,
            'follower_growth_30d': 0,
            'likes_growth_7d': 0,
            'likes_growth_30d': 0,
            'growth_rate_7d': 0.0,
            'growth_rate_30d': 0.0
        }
        
        if not previous_analytics:
            return growth_metrics
        
        # Find analytics from 7 days ago and 30 days ago
        now = datetime.utcnow()
        seven_days_ago = now - timedelta(days=7)
        thirty_days_ago = now - timedelta(days=30)
        
        analytics_7d = None
        analytics_30d = None
        
        for analytics in previous_analytics:
            if analytics.created_at >= seven_days_ago and not analytics_7d:
                analytics_7d = analytics
            if analytics.created_at >= thirty_days_ago and not analytics_30d:
                analytics_30d = analytics
        
        current_followers = profile.follower_count or 0
        current_likes = profile.likes_count or 0
        
        # Calculate 7-day growth
        if analytics_7d:
            prev_followers_7d = analytics_7d.total_followers or 0
            prev_likes_7d = analytics_7d.total_likes or 0
            
            growth_metrics['follower_growth_7d'] = current_followers - prev_followers_7d
            growth_metrics['likes_growth_7d'] = current_likes - prev_likes_7d
            
            if prev_followers_7d > 0:
                growth_metrics['growth_rate_7d'] = (
                    (current_followers - prev_followers_7d) / prev_followers_7d * 100
                )
        
        # Calculate 30-day growth
        if analytics_30d:
            prev_followers_30d = analytics_30d.total_followers or 0
            prev_likes_30d = analytics_30d.total_likes or 0
            
            growth_metrics['follower_growth_30d'] = current_followers - prev_followers_30d
            growth_metrics['likes_growth_30d'] = current_likes - prev_likes_30d
            
            if prev_followers_30d > 0:
                growth_metrics['growth_rate_30d'] = (
                    (current_followers - prev_followers_30d) / prev_followers_30d * 100
                )
        
        return growth_metrics
    
    def _calculate_video_metrics(self, profile_id: int) -> Dict:
        """Calculate video performance metrics"""
        videos = self.db.query(TikTokVideo).filter(
            TikTokVideo.profile_id == profile_id
        ).order_by(desc(TikTokVideo.view_count)).all()
        
        if not videos:
            return {
                'avg_views': 0,
                'avg_likes': 0,
                'best_performing_video_views': 0,
                'worst_performing_video_views': 0,
                'total_videos': 0,
                'top_performing_video': None
            }
        
        # Calculate averages
        total_views = sum(video.view_count or 0 for video in videos)
        total_likes = sum(video.like_count or 0 for video in videos)
        
        avg_views = total_views / len(videos) if videos else 0
        avg_likes = total_likes / len(videos) if videos else 0
        
        # Get best and worst performing videos
        best_video = videos[0] if videos else None
        worst_video = videos[-1] if videos else None
        
        # Create top performing video object
        top_video = None
        if best_video:
            top_video = {
                'video_id': str(best_video.id),
                'video_url': best_video.video_url or f'https://tiktok.com/@profile/video/{best_video.id}',
                'description': best_video.description or 'No description available',
                'view_count': best_video.view_count or 0,
                'like_count': best_video.like_count or 0,
                'comment_count': best_video.comment_count or 0,
                'share_count': best_video.share_count or 0,
                'engagement_rate': self._calculate_single_video_engagement(best_video)
            }
        
        return {
            'avg_views': round(avg_views),
            'avg_likes': round(avg_likes),
            'best_performing_video_views': best_video.view_count if best_video else 0,
            'worst_performing_video_views': worst_video.view_count if worst_video else 0,
            'total_videos': len(videos),
            'top_performing_video': top_video
        }
    
    def _calculate_single_video_engagement(self, video: 'TikTokVideo') -> float:
        """Calculate engagement rate for a single video"""
        if not video.view_count or video.view_count == 0:
            return 0.0
        
        total_engagement = (video.like_count or 0) + (video.comment_count or 0) + (video.share_count or 0)
        return round((total_engagement / video.view_count) * 100, 2)
    
    def _calculate_engagement_metrics(self, profile_id: int) -> Dict:
        """Calculate engagement rate and related metrics"""
        videos = self.db.query(TikTokVideo).filter(
            TikTokVideo.profile_id == profile_id
        ).all()
        
        if not videos:
            return {
                'avg_engagement_rate': 0.0,
                'engagement_trend': 'stable'
            }
        
        # Calculate engagement rates for each video
        engagement_rates = []
        total_views = 0
        videos_with_data = 0
        
        for video in videos:
            if video.view_count and video.view_count > 0:
                total_views += video.view_count
                videos_with_data += 1
                
                # If we have engagement data, calculate rate
                if video.like_count is not None or video.comment_count is not None or video.share_count is not None:
                    total_engagement = (video.like_count or 0) + (video.comment_count or 0) + (video.share_count or 0)
                    engagement_rate = (total_engagement / video.view_count) * 100
                    engagement_rates.append(engagement_rate)
        
        # If no engagement data available, estimate based on industry averages
        if not engagement_rates and videos_with_data > 0:
            # TikTok average engagement rate is 3-9%, use conservative 4%
            estimated_rate = 4.0
            return {
                'avg_engagement_rate': estimated_rate,
                'engagement_trend': 'stable',
                'is_estimated': True,
                'total_videos_analyzed': videos_with_data,
                'avg_views': total_views / videos_with_data if videos_with_data > 0 else 0
            }
        
        if not engagement_rates:
            return {
                'avg_engagement_rate': 0.0,
                'engagement_trend': 'stable',
                'is_estimated': False
            }
        
        avg_engagement = statistics.mean(engagement_rates)
        
        # Determine engagement trend (simplified)
        trend = 'stable'
        if len(engagement_rates) >= 3:
            recent_avg = statistics.mean(engagement_rates[-3:])
            older_avg = statistics.mean(engagement_rates[:-3]) if len(engagement_rates) > 3 else recent_avg
            
            if recent_avg > older_avg * 1.1:
                trend = 'increasing'
            elif recent_avg < older_avg * 0.9:
                trend = 'decreasing'
        
        return {
            'avg_engagement_rate': round(avg_engagement, 2),
            'engagement_trend': trend,
            'max_engagement_rate': max(engagement_rates),
            'min_engagement_rate': min(engagement_rates)
        }
    
    def _store_analytics(self, profile_id: int, analytics: Dict) -> None:
        """Store calculated analytics in database - skip for now"""
        # Skip storing analytics until ProfileAnalytics table is properly configured
        pass
    
    def get_growth_timeline(self, user_id: int, days: int = 30) -> List[Dict]:
        """Get growth timeline for charts and graphs"""
        profile = self.db.query(TikTokProfile).filter(
            TikTokProfile.user_id == user_id
        ).first()
        
        if not profile:
            return []
        
        # Skip analytics history for now - return current data point
        analytics_history = []
        
        timeline = []
        for analytics in analytics_history:
            timeline.append({
                'date': analytics.created_at.isoformat(),
                'followers': analytics.total_followers,
                'likes': analytics.total_likes,
                'videos': analytics.total_videos,
                'engagement_rate': analytics.avg_engagement_rate
            })
        
        return timeline
    
    def get_content_insights(self, user_id: int) -> Dict:
        """Analyze content patterns and provide insights"""
        profile = self.db.query(TikTokProfile).filter(
            TikTokProfile.user_id == user_id
        ).first()
        
        if not profile:
            return {}
        
        videos = self.db.query(TikTokVideo).filter(
            TikTokVideo.profile_id == profile.id
        ).all()
        
        if not videos:
            return {'message': 'No video data available for analysis'}
        
        # Analyze posting patterns, hashtags, descriptions, etc.
        insights = {
            'total_videos_analyzed': len(videos),
            'avg_description_length': statistics.mean([len(v.description or '') for v in videos]),
            'videos_with_descriptions': len([v for v in videos if v.description]),
            'posting_consistency': self._analyze_posting_consistency(videos),
            'performance_insights': self._generate_performance_insights(videos)
        }
        
        return insights
    
    def _analyze_posting_consistency(self, videos: List[TikTokVideo]) -> str:
        """Analyze how consistently the user posts content"""
        if len(videos) < 3:
            return 'insufficient_data'
        
        # This would analyze posting dates if available
        # For now, return a placeholder
        return 'regular'  # Could be 'regular', 'irregular', 'sporadic'
    
    def _generate_performance_insights(self, videos: List[TikTokVideo]) -> List[str]:
        """Generate actionable insights based on video performance"""
        insights = []
        
        if not videos:
            return insights
        
        # Analyze view counts
        views = [v.view_count for v in videos if v.view_count]
        if views:
            avg_views = statistics.mean(views)
            max_views = max(views)
            
            if max_views > avg_views * 2:
                insights.append("You have some viral content! Analyze your top-performing videos for patterns.")
            
            if avg_views < 1000:
                insights.append("Focus on trending hashtags and optimal posting times to increase visibility.")
        
        # Analyze engagement
        engagement_rates = []
        for video in videos:
            if video.view_count and video.view_count > 0:
                total_engagement = (video.like_count or 0) + (video.comment_count or 0)
                rate = (total_engagement / video.view_count) * 100
                engagement_rates.append(rate)
        
        if engagement_rates:
            avg_engagement = statistics.mean(engagement_rates)
            if avg_engagement > 5:
                insights.append("Great engagement rate! Your audience is highly engaged.")
            elif avg_engagement < 2:
                insights.append("Consider creating more interactive content to boost engagement.")
        
        return insights
