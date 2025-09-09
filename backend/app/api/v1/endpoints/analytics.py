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
from app.services.analytics_engine import AnalyticsEngine
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
    # Use the analytics engine for comprehensive calculations
    analytics_engine = AnalyticsEngine(db)
    analytics_data = analytics_engine.calculate_profile_analytics(current_user.id)
    
    if not analytics_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TikTok profile not found or no data available"
        )
    
    # Get top performing video
    profile = db.query(TikTokProfile).filter(
        TikTokProfile.user_id == current_user.id
    ).first()
    
    top_performing_video = None
    if profile:
        top_video = db.query(TikTokVideo).filter(
            TikTokVideo.profile_id == profile.id
        ).order_by(desc(TikTokVideo.view_count)).first()
        
        if top_video:
            top_performing_video = {
                "video_id": top_video.video_id,
                "video_url": top_video.video_url,
                "description": top_video.description,
                "view_count": top_video.view_count,
                "like_count": top_video.like_count,
                "engagement_rate": top_video.engagement_rate
            }
    
    return AnalyticsOverview(
        total_followers=analytics_data.get('total_followers'),
        total_videos=analytics_data.get('total_videos'),
        total_likes=analytics_data.get('total_likes'),
        avg_engagement_rate=analytics_data.get('avg_engagement_rate'),
        follower_growth_7d=analytics_data.get('follower_growth_7d'),
        follower_growth_30d=analytics_data.get('follower_growth_30d'),
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
    analytics_engine = AnalyticsEngine(db)
    timeline_data = analytics_engine.get_growth_timeline(current_user.id, days)
    
    return [
        GrowthMetrics(
            date=item['date'],
            followers=item['followers'],
            following=None,  # Not tracked in timeline
            videos=item['videos'],
            avg_views=None,  # Could be added later
            avg_engagement=item['engagement_rate']
        ) for item in timeline_data
    ]

@router.get("/insights")
async def get_performance_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get AI-powered performance insights and recommendations"""
    analytics_engine = AnalyticsEngine(db)
    insights_data = analytics_engine.get_content_insights(current_user.id)
    
    if not insights_data or 'message' in insights_data:
        return {
            "insights": [],
            "recommendations": [],
            "metrics": {
                "avg_views": 0,
                "avg_likes": 0,
                "avg_engagement_rate": 0,
                "total_videos_analyzed": 0
            }
        }
    
    # Convert insights to expected format
    insights = []
    recommendations = []
    
    # Add performance insights as formatted insights
    for insight in insights_data.get('performance_insights', []):
        insights.append({
            "type": "info",
            "title": "Performance Insight",
            "description": insight
        })
    
    # Add recommendations based on insights
    if insights_data.get('posting_consistency') == 'irregular':
        recommendations.append({
            "title": "Improve Posting Consistency",
            "description": "Try to maintain a regular posting schedule to keep your audience engaged."
        })
    
    return {
        "insights": insights,
        "recommendations": recommendations,
        "metrics": {
            "avg_views": insights_data.get('avg_views', 0),
            "avg_likes": insights_data.get('avg_likes', 0),
            "avg_engagement_rate": insights_data.get('avg_engagement_rate', 0),
            "total_videos_analyzed": insights_data.get('total_videos_analyzed', 0)
        }
    }

@router.post("/calculate")
async def calculate_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Trigger analytics calculation for the user's profile"""
    analytics_engine = AnalyticsEngine(db)
    analytics_data = analytics_engine.calculate_profile_analytics(current_user.id)
    
    if not analytics_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TikTok profile not found or no data available"
        )
    
    return {
        "message": "Analytics calculated successfully",
        "data": analytics_data
    }
