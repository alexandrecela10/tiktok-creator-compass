from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Date
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class ProfileAnalytics(Base):
    __tablename__ = "profile_analytics"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("tiktok_profiles.id"), nullable=False)
    
    # Date for the analytics snapshot
    date = Column(Date, nullable=False)
    
    # Growth metrics
    follower_growth = Column(Integer, nullable=True)
    following_growth = Column(Integer, nullable=True)
    video_count_growth = Column(Integer, nullable=True)
    
    # Engagement metrics
    avg_views = Column(Float, nullable=True)
    avg_likes = Column(Float, nullable=True)
    avg_comments = Column(Float, nullable=True)
    avg_shares = Column(Float, nullable=True)
    avg_engagement_rate = Column(Float, nullable=True)
    
    # Performance metrics
    total_views_period = Column(Integer, nullable=True)
    total_likes_period = Column(Integer, nullable=True)
    reach_estimate = Column(Integer, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    profile = relationship("TikTokProfile", back_populates="analytics")

class CreatorRecommendation(Base):
    __tablename__ = "creator_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Recommended creator info
    recommended_username = Column(String, nullable=False)
    recommended_display_name = Column(String, nullable=True)
    recommended_avatar_url = Column(String, nullable=True)
    
    # Recommendation metrics
    similarity_score = Column(Float, nullable=True)
    engagement_score = Column(Float, nullable=True)
    growth_score = Column(Float, nullable=True)
    
    # Insights about what they do well
    success_factors = Column(String, nullable=True)  # JSON string
    content_themes = Column(String, nullable=True)  # JSON string
    posting_frequency = Column(String, nullable=True)
    
    # Recommendation metadata
    is_active = Column(Integer, default=1)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")
