from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, BigInteger, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class TikTokProfile(Base):
    __tablename__ = "tiktok_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # TikTok Profile Data
    tiktok_username = Column(String, unique=True, index=True, nullable=False)
    display_name = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    follower_count = Column(BigInteger, nullable=True)
    following_count = Column(BigInteger, nullable=True)
    likes_count = Column(BigInteger, nullable=True)
    video_count = Column(Integer, nullable=True)
    avatar_url = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    
    # Profile metadata
    last_scraped_at = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="tiktok_profile")
    videos = relationship("TikTokVideo", back_populates="profile")
    analytics = relationship("ProfileAnalytics", back_populates="profile")
