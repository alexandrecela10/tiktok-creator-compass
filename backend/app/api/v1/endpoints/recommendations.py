from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from pydantic import BaseModel
from typing import List, Optional
from app.db.session import get_db
from app.models.user import User
from app.models.tiktok_profile import TikTokProfile
from app.models.analytics import CreatorRecommendation
from app.api.v1.endpoints.users import get_current_user
import json

router = APIRouter()

class CreatorRecommendationResponse(BaseModel):
    id: int
    recommended_username: str
    recommended_display_name: Optional[str]
    recommended_avatar_url: Optional[str]
    similarity_score: Optional[float]
    engagement_score: Optional[float]
    growth_score: Optional[float]
    success_factors: List[str]
    content_themes: List[str]
    posting_frequency: Optional[str]

class RecommendationInsight(BaseModel):
    title: str
    description: str
    actionable_tip: str

@router.get("/creators", response_model=List[CreatorRecommendationResponse])
async def get_creator_recommendations(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get recommended creators to follow and learn from"""
    profile = db.query(TikTokProfile).filter(
        TikTokProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TikTok profile not found"
        )
    
    # Get existing recommendations
    recommendations = db.query(CreatorRecommendation).filter(
        CreatorRecommendation.user_id == current_user.id,
        CreatorRecommendation.is_active == 1
    ).order_by(desc(CreatorRecommendation.similarity_score)).limit(limit).all()
    
    # If no recommendations exist, generate some sample ones
    if not recommendations:
        sample_recommendations = await generate_sample_recommendations(current_user, db)
        recommendations = sample_recommendations
    
    return [
        CreatorRecommendationResponse(
            id=rec.id,
            recommended_username=rec.recommended_username,
            recommended_display_name=rec.recommended_display_name,
            recommended_avatar_url=rec.recommended_avatar_url,
            similarity_score=rec.similarity_score,
            engagement_score=rec.engagement_score,
            growth_score=rec.growth_score,
            success_factors=json.loads(rec.success_factors) if rec.success_factors else [],
            content_themes=json.loads(rec.content_themes) if rec.content_themes else [],
            posting_frequency=rec.posting_frequency
        ) for rec in recommendations
    ]

@router.get("/insights", response_model=List[RecommendationInsight])
async def get_recommendation_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get insights based on recommended creators"""
    recommendations = db.query(CreatorRecommendation).filter(
        CreatorRecommendation.user_id == current_user.id,
        CreatorRecommendation.is_active == 1
    ).limit(5).all()
    
    if not recommendations:
        return []
    
    insights = []
    
    # Analyze common success factors
    all_success_factors = []
    for rec in recommendations:
        if rec.success_factors:
            factors = json.loads(rec.success_factors)
            all_success_factors.extend(factors)
    
    # Find most common success factors
    factor_counts = {}
    for factor in all_success_factors:
        factor_counts[factor] = factor_counts.get(factor, 0) + 1
    
    top_factors = sorted(factor_counts.items(), key=lambda x: x[1], reverse=True)[:3]
    
    for factor, count in top_factors:
        insights.append(RecommendationInsight(
            title=f"Common Success Pattern: {factor}",
            description=f"{count} of your recommended creators excel at {factor.lower()}.",
            actionable_tip=get_actionable_tip_for_factor(factor)
        ))
    
    # Analyze content themes
    all_themes = []
    for rec in recommendations:
        if rec.content_themes:
            themes = json.loads(rec.content_themes)
            all_themes.extend(themes)
    
    theme_counts = {}
    for theme in all_themes:
        theme_counts[theme] = theme_counts.get(theme, 0) + 1
    
    top_themes = sorted(theme_counts.items(), key=lambda x: x[1], reverse=True)[:2]
    
    for theme, count in top_themes:
        insights.append(RecommendationInsight(
            title=f"Popular Content Theme: {theme}",
            description=f"Many successful creators in your niche focus on {theme.lower()} content.",
            actionable_tip=f"Consider creating more content around {theme.lower()} to tap into this successful theme."
        ))
    
    return insights

@router.post("/refresh")
async def refresh_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Refresh creator recommendations based on current profile and preferences"""
    profile = db.query(TikTokProfile).filter(
        TikTokProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TikTok profile not found"
        )
    
    # Deactivate old recommendations
    old_recommendations = db.query(CreatorRecommendation).filter(
        CreatorRecommendation.user_id == current_user.id
    ).all()
    
    for rec in old_recommendations:
        rec.is_active = 0
    
    # Generate new recommendations
    new_recommendations = await generate_sample_recommendations(current_user, db)
    
    db.commit()
    
    return {
        "message": "Recommendations refreshed successfully",
        "count": len(new_recommendations)
    }

async def generate_sample_recommendations(user: User, db: Session) -> List[CreatorRecommendation]:
    """Generate sample creator recommendations based on user's niche"""
    # This would typically use ML algorithms to find similar creators
    # For now, we'll create sample recommendations based on common niches
    
    sample_creators = [
        {
            "username": "charlidamelio",
            "display_name": "Charli D'Amelio",
            "avatar_url": "https://example.com/charli.jpg",
            "similarity_score": 0.85,
            "engagement_score": 0.92,
            "growth_score": 0.88,
            "success_factors": ["Consistent posting", "Trending sounds", "Dance content"],
            "content_themes": ["Dance", "Lifestyle", "Trends"],
            "posting_frequency": "2-3 times daily"
        },
        {
            "username": "khaby.lame",
            "display_name": "Khabane Lame",
            "avatar_url": "https://example.com/khaby.jpg",
            "similarity_score": 0.78,
            "engagement_score": 0.89,
            "growth_score": 0.95,
            "success_factors": ["Relatable content", "No dialogue needed", "Universal humor"],
            "content_themes": ["Comedy", "Life hacks", "Reactions"],
            "posting_frequency": "1-2 times daily"
        },
        {
            "username": "zach.king",
            "display_name": "Zach King",
            "avatar_url": "https://example.com/zach.jpg",
            "similarity_score": 0.72,
            "engagement_score": 0.87,
            "growth_score": 0.82,
            "success_factors": ["High production value", "Magic editing", "Storytelling"],
            "content_themes": ["Magic", "Illusions", "Creative editing"],
            "posting_frequency": "3-4 times weekly"
        }
    ]
    
    recommendations = []
    for creator_data in sample_creators:
        recommendation = CreatorRecommendation(
            user_id=user.id,
            recommended_username=creator_data["username"],
            recommended_display_name=creator_data["display_name"],
            recommended_avatar_url=creator_data["avatar_url"],
            similarity_score=creator_data["similarity_score"],
            engagement_score=creator_data["engagement_score"],
            growth_score=creator_data["growth_score"],
            success_factors=json.dumps(creator_data["success_factors"]),
            content_themes=json.dumps(creator_data["content_themes"]),
            posting_frequency=creator_data["posting_frequency"]
        )
        
        db.add(recommendation)
        recommendations.append(recommendation)
    
    db.commit()
    
    for rec in recommendations:
        db.refresh(rec)
    
    return recommendations

def get_actionable_tip_for_factor(factor: str) -> str:
    """Get actionable tips based on success factors"""
    tips = {
        "Consistent posting": "Set a regular posting schedule and stick to it. Consistency helps with algorithm visibility.",
        "Trending sounds": "Use the Discover page to find trending sounds and incorporate them into your content quickly.",
        "Dance content": "Learn popular dance trends early and add your own creative twist to stand out.",
        "Relatable content": "Focus on everyday situations your audience can connect with and relate to.",
        "High production value": "Invest time in good lighting, clear audio, and smooth editing to make your content stand out.",
        "Storytelling": "Structure your videos with a clear beginning, middle, and end to keep viewers engaged.",
        "Universal humor": "Create content that doesn't rely on language barriers - visual comedy works globally."
    }
    
    return tips.get(factor, "Study this creator's approach and adapt it to your own content style.")
