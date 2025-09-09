from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.sql import func
from app.db.base_class import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    google_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    tiktok_username = Column(String, unique=True, index=True, nullable=True)
    
    # Onboarding questions
    offer_description = Column(Text, nullable=True)
    target_audience = Column(Text, nullable=True)
    
    # User preferences
    is_active = Column(Boolean, default=True)
    weekly_updates_enabled = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    tiktok_profile = relationship("TikTokProfile", back_populates="user", uselist=False)
