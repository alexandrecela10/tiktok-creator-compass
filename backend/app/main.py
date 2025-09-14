from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Create a simple health check app first
app = FastAPI(
    title="TikTok Creator Compass API",
    description="API for TikTok creator analytics and recommendations",
    version="1.0.0"
)

# Basic health check that doesn't depend on config
@app.get("/health")
async def health_check():
    return {"status": "healthy", "environment": os.getenv("ENVIRONMENT", "unknown")}

@app.get("/")
async def root():
    return {"message": "TikTok Creator Compass API", "version": "1.0.0"}

# Try to load config and API routes, but don't crash if they fail
try:
    from app.core.config import settings
    from app.api.v1.api import api_router
    
    # Update app with full config
    app.openapi_url = f"{settings.API_V1_STR}/openapi.json"
    
    # Set up CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"] if settings.ENVIRONMENT == "production" else [settings.FRONTEND_URL],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    app.include_router(api_router, prefix=settings.API_V1_STR)
    print(f"API routes loaded successfully with prefix: {settings.API_V1_STR}")
    
except Exception as e:
    print(f"Warning: Could not load full configuration: {e}")
    # Add basic CORS for health checks
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Try to load API routes without config
    try:
        from app.api.v1.api import api_router
        app.include_router(api_router, prefix="/api/v1")
        print("API routes loaded with default prefix")
    except Exception as e2:
        print(f"Failed to load API routes: {e2}")
