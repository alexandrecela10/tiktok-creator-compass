from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict
from app.api.v1.endpoints.users import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.services.engaged_leads_analyzer import EngagedLeadsAnalyzer
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/analyze", response_model=Dict)
async def get_engaged_leads(
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get most engaged followers from target audience for collaboration opportunities
    """
    try:
        analyzer = EngagedLeadsAnalyzer(db)
        result = analyzer.get_engaged_leads(current_user.id, limit)
        
        logger.info(f"Generated engaged leads analysis for user {current_user.id}")
        return result
        
    except Exception as e:
        logger.error(f"Error getting engaged leads: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze engaged leads"
        )

@router.get("/contact-suggestions/{username}")
async def get_contact_suggestions(
    username: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get specific contact suggestions for a target follower
    """
    try:
        # Generate personalized contact suggestions
        suggestions = {
            'username': username,
            'contact_methods': [
                {
                    'method': 'Direct Message',
                    'template': f"Hi @{username}! I love your fashion content and think we'd be great collaboration partners. Would you be interested in discussing a potential partnership?",
                    'success_rate': '75%',
                    'best_time': 'Weekday evenings'
                },
                {
                    'method': 'Comment Engagement',
                    'template': 'Start by genuinely engaging with their recent posts, then follow up with a DM after building rapport',
                    'success_rate': '85%',
                    'best_time': 'Within 2 hours of their posts'
                },
                {
                    'method': 'Story Mention',
                    'template': 'Share their content in your story with positive comments, tag them to get their attention',
                    'success_rate': '60%',
                    'best_time': 'Peak activity hours (7-9 PM)'
                }
            ],
            'collaboration_ideas': [
                'Joint outfit styling challenge',
                'Fashion haul collaboration',
                'Style swap content series',
                'Brand partnership opportunities'
            ]
        }
        
        return suggestions
        
    except Exception as e:
        logger.error(f"Error getting contact suggestions: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to get contact suggestions"
        )
