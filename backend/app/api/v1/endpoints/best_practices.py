from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.db.session import get_db
from app.services.best_practices_analyzer import BestPracticesAnalyzer
from app.api.v1.endpoints.users import get_current_user
from app.models.user import User

router = APIRouter()

class BestPracticeRecommendation(BaseModel):
    category: str
    title: str
    description: str
    action: str
    priority: str

class BestPracticesResponse(BaseModel):
    best_practices: dict
    recommendations: List[BestPracticeRecommendation]
    analyzed_creators: int
    target_audience: str
    note: Optional[str] = None

@router.get("/analyze", response_model=BestPracticesResponse)
async def analyze_best_practices(
    target_audience: str = "fashion",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze top creators and extract best practices"""
    try:
        analyzer = BestPracticesAnalyzer(db)
        
        # Analyze top creators in the target audience
        analysis = await analyzer.analyze_top_creators(
            user_id=current_user.id,
            target_audience=target_audience
        )
        
        await analyzer.close()
        
        return BestPracticesResponse(**analysis)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze best practices: {str(e)}"
        )

@router.get("/recommendations", response_model=List[BestPracticeRecommendation])
async def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get personalized recommendations based on best practices analysis"""
    try:
        analyzer = BestPracticesAnalyzer(db)
        
        # Get quick recommendations without full analysis
        analysis = await analyzer.analyze_top_creators(
            user_id=current_user.id,
            target_audience="fashion"
        )
        
        await analyzer.close()
        
        return analysis.get('recommendations', [])
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get recommendations: {str(e)}"
        )
