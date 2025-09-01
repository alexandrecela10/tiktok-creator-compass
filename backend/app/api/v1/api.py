from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, tiktok, analytics, recommendations

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(tiktok.router, prefix="/tiktok", tags=["tiktok"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
