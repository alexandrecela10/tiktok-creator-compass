from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.db.session import get_db
from app.models.user import User
from app.core.security import verify_token

router = APIRouter()
security = HTTPBearer()

class OnboardingRequest(BaseModel):
    tiktok_username: str
    offer_description: str
    target_audience: str

class UserUpdateRequest(BaseModel):
    tiktok_username: Optional[str] = None
    offer_description: Optional[str] = None
    target_audience: Optional[str] = None
    weekly_updates_enabled: Optional[bool] = None

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    avatar_url: Optional[str]
    tiktok_username: Optional[str]
    offer_description: Optional[str]
    target_audience: Optional[str]
    weekly_updates_enabled: bool
    is_active: bool

def get_current_user(token: str = Depends(security), db: Session = Depends(get_db)) -> User:
    """Get current authenticated user"""
    payload = verify_token(token.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        avatar_url=current_user.avatar_url,
        tiktok_username=current_user.tiktok_username,
        offer_description=current_user.offer_description,
        target_audience=current_user.target_audience,
        weekly_updates_enabled=current_user.weekly_updates_enabled,
        is_active=current_user.is_active
    )

@router.post("/onboarding")
async def complete_onboarding(
    onboarding_data: OnboardingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Complete user onboarding with TikTok username and business info"""
    # Update user with onboarding information
    current_user.tiktok_username = onboarding_data.tiktok_username.lstrip('@')
    current_user.offer_description = onboarding_data.offer_description
    current_user.target_audience = onboarding_data.target_audience
    
    db.commit()
    db.refresh(current_user)
    
    return {
        "message": "Onboarding completed successfully",
        "user": UserResponse(
            id=current_user.id,
            email=current_user.email,
            name=current_user.name,
            avatar_url=current_user.avatar_url,
            tiktok_username=current_user.tiktok_username,
            offer_description=current_user.offer_description,
            target_audience=current_user.target_audience,
            weekly_updates_enabled=current_user.weekly_updates_enabled,
            is_active=current_user.is_active
        )
    }

@router.put("/me", response_model=UserResponse)
async def update_user(
    user_update: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user information"""
    if user_update.tiktok_username is not None:
        current_user.tiktok_username = user_update.tiktok_username.lstrip('@')
    
    if user_update.offer_description is not None:
        current_user.offer_description = user_update.offer_description
    
    if user_update.target_audience is not None:
        current_user.target_audience = user_update.target_audience
    
    if user_update.weekly_updates_enabled is not None:
        current_user.weekly_updates_enabled = user_update.weekly_updates_enabled
    
    db.commit()
    db.refresh(current_user)
    
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        avatar_url=current_user.avatar_url,
        tiktok_username=current_user.tiktok_username,
        offer_description=current_user.offer_description,
        target_audience=current_user.target_audience,
        weekly_updates_enabled=current_user.weekly_updates_enabled,
        is_active=current_user.is_active
    )
