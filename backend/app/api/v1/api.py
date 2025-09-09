from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, tiktok, analytics, recommendations, best_practices, engaged_leads

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(tiktok.router, prefix="/tiktok", tags=["tiktok"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
api_router.include_router(best_practices.router, prefix="/best-practices", tags=["best-practices"])
api_router.include_router(engaged_leads.router, prefix="/engaged-leads", tags=["engaged-leads"])
