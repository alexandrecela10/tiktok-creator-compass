#!/usr/bin/env python3

"""
Database creation script for TikTok Creator Compass
Run this script to create the database tables
"""

from sqlalchemy import create_engine
from app.core.config import settings
from app.db.base import Base

def create_database():
    """Create all database tables"""
    engine = create_engine(settings.DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    create_database()
