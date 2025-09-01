from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.db.session import get_db
from app.models.user import User
from app.models.tiktok_profile import TikTokProfile
from app.models.tiktok_video import TikTokVideo
from app.services.tiktok_scraper import TikTokScraper
from app.api.v1.endpoints.users import get_current_user
from datetime import datetime

router = APIRouter()

class TikTokProfileResponse(BaseModel):
    id: int
    tiktok_username: str
    display_name: Optional[str]
    bio: Optional[str]
    follower_count: Optional[int]
    following_count: Optional[int]
    likes_count: Optional[int]
    video_count: Optional[int]
    avatar_url: Optional[str]
    is_verified: bool
    last_scraped_at: Optional[datetime]

class TikTokVideoResponse(BaseModel):
    id: int
    video_id: str
    video_url: str
    description: Optional[str]
    view_count: Optional[int]
    like_count: Optional[int]
    comment_count: Optional[int]
    share_count: Optional[int]
    engagement_rate: Optional[float]
    posted_at: Optional[datetime]

class ScrapeProfileRequest(BaseModel):
    username: str

@router.post("/scrape-profile")
async def scrape_tiktok_profile(
    request: ScrapeProfileRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Scrape TikTok profile data"""
    username = request.username.lstrip('@')
    
    # Check if profile already exists for this user
    existing_profile = db.query(TikTokProfile).filter(
        TikTokProfile.user_id == current_user.id,
        TikTokProfile.tiktok_username == username
    ).first()
    
    if existing_profile:
        # Update existing profile in background
        background_tasks.add_task(update_profile_data, existing_profile.id, db)
        return {"message": "Profile update started", "profile_id": existing_profile.id}
    
    # Create new profile and scrape data
    scraper = TikTokScraper()
    profile_data = await scraper.get_profile_data(username)
    await scraper.close()
    
    if not profile_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TikTok profile not found or could not be scraped"
        )
    
    # Create new profile record
    new_profile = TikTokProfile(
        user_id=current_user.id,
        tiktok_username=profile_data['username'],
        display_name=profile_data.get('display_name'),
        bio=profile_data.get('bio'),
        follower_count=profile_data.get('follower_count'),
        following_count=profile_data.get('following_count'),
        likes_count=profile_data.get('likes_count'),
        video_count=profile_data.get('video_count'),
        avatar_url=profile_data.get('avatar_url'),
        is_verified=profile_data.get('is_verified', False),
        last_scraped_at=datetime.utcnow()
    )
    
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    
    # Scrape recent videos in background
    background_tasks.add_task(scrape_recent_videos, new_profile.id, username, db)
    
    return {
        "message": "Profile scraped successfully",
        "profile": TikTokProfileResponse(
            id=new_profile.id,
            tiktok_username=new_profile.tiktok_username,
            display_name=new_profile.display_name,
            bio=new_profile.bio,
            follower_count=new_profile.follower_count,
            following_count=new_profile.following_count,
            likes_count=new_profile.likes_count,
            video_count=new_profile.video_count,
            avatar_url=new_profile.avatar_url,
            is_verified=new_profile.is_verified,
            last_scraped_at=new_profile.last_scraped_at
        )
    }

@router.get("/profile", response_model=TikTokProfileResponse)
async def get_user_tiktok_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's TikTok profile data"""
    profile = db.query(TikTokProfile).filter(
        TikTokProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TikTok profile not found. Please scrape your profile first."
        )
    
    return TikTokProfileResponse(
        id=profile.id,
        tiktok_username=profile.tiktok_username,
        display_name=profile.display_name,
        bio=profile.bio,
        follower_count=profile.follower_count,
        following_count=profile.following_count,
        likes_count=profile.likes_count,
        video_count=profile.video_count,
        avatar_url=profile.avatar_url,
        is_verified=profile.is_verified,
        last_scraped_at=profile.last_scraped_at
    )

@router.get("/videos", response_model=List[TikTokVideoResponse])
async def get_user_videos(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's TikTok videos"""
    profile = db.query(TikTokProfile).filter(
        TikTokProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TikTok profile not found"
        )
    
    videos = db.query(TikTokVideo).filter(
        TikTokVideo.profile_id == profile.id
    ).order_by(TikTokVideo.posted_at.desc()).limit(limit).all()
    
    return [
        TikTokVideoResponse(
            id=video.id,
            video_id=video.video_id,
            video_url=video.video_url,
            description=video.description,
            view_count=video.view_count,
            like_count=video.like_count,
            comment_count=video.comment_count,
            share_count=video.share_count,
            engagement_rate=video.engagement_rate,
            posted_at=video.posted_at
        ) for video in videos
    ]

@router.post("/refresh-profile")
async def refresh_profile_data(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Refresh user's TikTok profile data"""
    profile = db.query(TikTokProfile).filter(
        TikTokProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TikTok profile not found"
        )
    
    # Update profile data in background
    background_tasks.add_task(update_profile_data, profile.id, db)
    
    return {"message": "Profile refresh started"}

async def update_profile_data(profile_id: int, db: Session):
    """Background task to update profile data"""
    profile = db.query(TikTokProfile).filter(TikTokProfile.id == profile_id).first()
    if not profile:
        return
    
    scraper = TikTokScraper()
    try:
        profile_data = await scraper.get_profile_data(profile.tiktok_username)
        if profile_data:
            profile.display_name = profile_data.get('display_name')
            profile.bio = profile_data.get('bio')
            profile.follower_count = profile_data.get('follower_count')
            profile.following_count = profile_data.get('following_count')
            profile.likes_count = profile_data.get('likes_count')
            profile.video_count = profile_data.get('video_count')
            profile.avatar_url = profile_data.get('avatar_url')
            profile.is_verified = profile_data.get('is_verified', False)
            profile.last_scraped_at = datetime.utcnow()
            
            db.commit()
    finally:
        await scraper.close()

async def scrape_recent_videos(profile_id: int, username: str, db: Session):
    """Background task to scrape recent videos"""
    scraper = TikTokScraper()
    try:
        videos_data = await scraper.get_recent_videos(username, limit=20)
        
        for video_data in videos_data:
            # Extract video ID from URL
            video_id = video_data['video_url'].split('/')[-1]
            
            # Check if video already exists
            existing_video = db.query(TikTokVideo).filter(
                TikTokVideo.video_id == video_id
            ).first()
            
            if not existing_video:
                new_video = TikTokVideo(
                    profile_id=profile_id,
                    video_id=video_id,
                    video_url=video_data['video_url'],
                    description=video_data.get('description'),
                    view_count=video_data.get('view_count'),
                    last_scraped_at=datetime.utcnow()
                )
                db.add(new_video)
        
        db.commit()
    finally:
        await scraper.close()
