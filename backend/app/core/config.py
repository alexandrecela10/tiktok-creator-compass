from pydantic_settings import BaseSettings
from typing import Optional
import os

# Fix malformed DATABASE_URL that starts with https://
# This logic must be outside the Settings class to avoid Pydantic validation
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# Debug: Print original DATABASE_URL
print(f"DEBUG: Original DATABASE_URL = {DATABASE_URL}")

# Check if DATABASE_URL is malformed (starts with https://)
if DATABASE_URL and DATABASE_URL.startswith("https://"):
    print("DEBUG: Detected malformed DATABASE_URL starting with https://, constructing from Railway variables...")
    
    # Railway provides database variables separately, construct proper URL
    PGHOST = os.getenv("PGHOST", "localhost")
    PGUSER = os.getenv("PGUSER", "postgres")
    PGPASSWORD = os.getenv("PGPASSWORD", "")
    PGDATABASE = os.getenv("PGDATABASE", "postgres")
    PGPORT = os.getenv("PGPORT", "5432")
    
    # URL encode password for special characters
    from urllib.parse import quote_plus
    encoded_password = quote_plus(PGPASSWORD)
    
    DATABASE_URL = f"postgresql://{PGUSER}:{encoded_password}@{PGHOST}:{PGPORT}/{PGDATABASE}"
    print(f"DEBUG: Constructed DATABASE_URL = {DATABASE_URL}")
else:
    print("DEBUG: DATABASE_URL looks valid, using as-is")

class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "TikTok Creator Compass"
    
    # Database - use the corrected DATABASE_URL
    DATABASE_URL: Optional[str] = DATABASE_URL
    
    # Security - make optional with fallback
    SECRET_KEY: Optional[str] = os.getenv("SECRET_KEY", "fallback-secret-key-for-health-checks")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Google OAuth - make optional with fallbacks
    GOOGLE_CLIENT_ID: Optional[str] = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: Optional[str] = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GOOGLE_REDIRECT_URI: Optional[str] = os.getenv("GOOGLE_REDIRECT_URI", "")
    
    # TikTok API
    TIKTOK_CLIENT_KEY: Optional[str] = None
    TIKTOK_CLIENT_SECRET: Optional[str] = None
    
    # Redis - make optional with fallback
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    ALLOWED_HOSTS: list = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
