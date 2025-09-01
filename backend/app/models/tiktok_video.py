from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, BigInteger, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class TikTokVideo(Base):
    __tablename__ = "tiktok_videos"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("tiktok_profiles.id"), nullable=False)
    
    # Video identifiers
    video_id = Column(String, unique=True, index=True, nullable=False)
    video_url = Column(String, nullable=False)
    
    # Video content
    description = Column(Text, nullable=True)
    hashtags = Column(Text, nullable=True)  # JSON string of hashtags
    duration = Column(Integer, nullable=True)  # in seconds
    
    # Engagement metrics
    view_count = Column(BigInteger, nullable=True)
    like_count = Column(BigInteger, nullable=True)
    comment_count = Column(BigInteger, nullable=True)
    share_count = Column(BigInteger, nullable=True)
    
    # Performance metrics
    engagement_rate = Column(Float, nullable=True)
    completion_rate = Column(Float, nullable=True)
    
    # Video metadata
    posted_at = Column(DateTime(timezone=True), nullable=True)
    last_scraped_at = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    profile = relationship("TikTokProfile", back_populates="videos")
