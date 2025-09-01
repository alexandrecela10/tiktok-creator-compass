from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from app.db.session import get_db
from app.models.user import User
from app.models.tiktok_profile import TikTokProfile
from app.models.tiktok_video import TikTokVideo
from app.models.analytics import ProfileAnalytics
from app.api.v1.endpoints.users import get_current_user

router = APIRouter()

class AnalyticsOverview(BaseModel):
    total_followers: Optional[int]
    total_videos: Optional[int]
    total_likes: Optional[int]
    avg_engagement_rate: Optional[float]
    follower_growth_7d: Optional[int]
    follower_growth_30d: Optional[int]
    top_performing_video: Optional[dict]

class VideoPerformance(BaseModel):
    video_id: str
    video_url: str
    description: Optional[str]
    view_count: Optional[int]
    like_count: Optional[int]
    engagement_rate: Optional[float]
    posted_at: Optional[datetime]

class GrowthMetrics(BaseModel):
    date: str
    followers: Optional[int]
    following: Optional[int]
    videos: Optional[int]
    avg_views: Optional[float]
    avg_engagement: Optional[float]

@router.get("/overview", response_model=AnalyticsOverview)
async def get_analytics_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get analytics overview for the user's TikTok profile"""
    profile = db.query(TikTokProfile).filter(
        TikTokProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TikTok profile not found"
        )
    
    # Get recent analytics data
    recent_analytics = db.query(ProfileAnalytics).filter(
        ProfileAnalytics.profile_id == profile.id
    ).order_by(desc(ProfileAnalytics.date)).limit(30).all()
    
    # Calculate growth metrics
    follower_growth_7d = None
    follower_growth_30d = None
    
    if len(recent_analytics) >= 7:
        current_followers = profile.follower_count or 0
        followers_7d_ago = recent_analytics[6].profile.follower_count or 0
        follower_growth_7d = current_followers - followers_7d_ago
    
    if len(recent_analytics) >= 30:
        current_followers = profile.follower_count or 0
        followers_30d_ago = recent_analytics[29].profile.follower_count or 0
        follower_growth_30d = current_followers - followers_30d_ago
    
    # Get top performing video
    top_video = db.query(TikTokVideo).filter(
        TikTokVideo.profile_id == profile.id
    ).order_by(desc(TikTokVideo.view_count)).first()
    
    top_performing_video = None
    if top_video:
        top_performing_video = {
            "video_id": top_video.video_id,
            "video_url": top_video.video_url,
            "description": top_video.description,
            "view_count": top_video.view_count,
            "like_count": top_video.like_count,
            "engagement_rate": top_video.engagement_rate
        }
    
    # Calculate average engagement rate
    avg_engagement = db.query(func.avg(TikTokVideo.engagement_rate)).filter(
        TikTokVideo.profile_id == profile.id,
        TikTokVideo.engagement_rate.isnot(None)
    ).scalar()
    
    return AnalyticsOverview(
        total_followers=profile.follower_count,
        total_videos=profile.video_count,
        total_likes=profile.likes_count,
        avg_engagement_rate=float(avg_engagement) if avg_engagement else None,
        follower_growth_7d=follower_growth_7d,
        follower_growth_30d=follower_growth_30d,
        top_performing_video=top_performing_video
    )

@router.get("/videos/performance", response_model=List[VideoPerformance])
async def get_video_performance(
    limit: int = 20,
    sort_by: str = "view_count",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get video performance metrics"""
    profile = db.query(TikTokProfile).filter(
        TikTokProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TikTok profile not found"
        )
    
    # Sort videos by specified metric
    order_column = TikTokVideo.view_count
    if sort_by == "like_count":
        order_column = TikTokVideo.like_count
    elif sort_by == "engagement_rate":
        order_column = TikTokVideo.engagement_rate
    elif sort_by == "posted_at":
        order_column = TikTokVideo.posted_at
    
    videos = db.query(TikTokVideo).filter(
        TikTokVideo.profile_id == profile.id
    ).order_by(desc(order_column)).limit(limit).all()
    
    return [
        VideoPerformance(
            video_id=video.video_id,
            video_url=video.video_url,
            description=video.description,
            view_count=video.view_count,
            like_count=video.like_count,
            engagement_rate=video.engagement_rate,
            posted_at=video.posted_at
        ) for video in videos
    ]

@router.get("/growth", response_model=List[GrowthMetrics])
async def get_growth_metrics(
    days: int = 30,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get growth metrics over time"""
    profile = db.query(TikTokProfile).filter(
        TikTokProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TikTok profile not found"
        )
    
    # Get analytics data for the specified period
    start_date = datetime.utcnow().date() - timedelta(days=days)
    
    analytics_data = db.query(ProfileAnalytics).filter(
        ProfileAnalytics.profile_id == profile.id,
        ProfileAnalytics.date >= start_date
    ).order_by(ProfileAnalytics.date).all()
    
    return [
        GrowthMetrics(
            date=analytics.date.isoformat(),
            followers=analytics.profile.follower_count,
            following=analytics.profile.following_count,
            videos=analytics.profile.video_count,
            avg_views=analytics.avg_views,
            avg_engagement=analytics.avg_engagement_rate
        ) for analytics in analytics_data
    ]

@router.get("/insights")
async def get_performance_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get AI-powered performance insights and recommendations"""
    profile = db.query(TikTokProfile).filter(
        TikTokProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TikTok profile not found"
        )
    
    # Get recent videos for analysis
    recent_videos = db.query(TikTokVideo).filter(
        TikTokVideo.profile_id == profile.id
    ).order_by(desc(TikTokVideo.posted_at)).limit(10).all()
    
    if not recent_videos:
        return {"insights": [], "recommendations": []}
    
    # Calculate performance metrics
    avg_views = sum(v.view_count or 0 for v in recent_videos) / len(recent_videos)
    avg_likes = sum(v.like_count or 0 for v in recent_videos) / len(recent_videos)
    avg_engagement = avg_likes / avg_views if avg_views > 0 else 0
    
    # Generate insights
    insights = []
    recommendations = []
    
    # Engagement rate insight
    if avg_engagement > 0.05:
        insights.append({
            "type": "positive",
            "title": "Strong Engagement Rate",
            "description": f"Your average engagement rate of {avg_engagement:.2%} is above the typical TikTok average of 3-5%."
        })
    elif avg_engagement < 0.02:
        insights.append({
            "type": "warning",
            "title": "Low Engagement Rate",
            "description": f"Your engagement rate of {avg_engagement:.2%} could be improved. Consider more interactive content."
        })
        recommendations.append({
            "title": "Boost Engagement",
            "description": "Try asking questions in your videos, using trending sounds, or creating content that encourages comments."
        })
    
    # Video performance consistency
    view_counts = [v.view_count or 0 for v in recent_videos]
    if len(view_counts) > 1:
        view_variance = max(view_counts) / min(view_counts) if min(view_counts) > 0 else 0
        if view_variance > 10:
            insights.append({
                "type": "info",
                "title": "Inconsistent Performance",
                "description": "Your video performance varies significantly. Some content types may resonate better with your audience."
            })
            recommendations.append({
                "title": "Analyze Top Performers",
                "description": "Study your highest-performing videos to identify successful patterns in content, timing, or hashtags."
            })
    
    # Posting frequency
    if len(recent_videos) < 5:
        recommendations.append({
            "title": "Increase Posting Frequency",
            "description": "Consider posting more regularly to maintain audience engagement and algorithm visibility."
        })
    
    return {
        "insights": insights,
        "recommendations": recommendations,
        "metrics": {
            "avg_views": avg_views,
            "avg_likes": avg_likes,
            "avg_engagement_rate": avg_engagement,
            "total_videos_analyzed": len(recent_videos)
        }
    }
