from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.session import get_db
from app.services.google_auth import GoogleAuthService
from app.core.security import create_access_token
from app.models.user import User

router = APIRouter()
security = HTTPBearer()

class GoogleAuthRequest(BaseModel):
    token: str

class GoogleAuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

class AuthUrlResponse(BaseModel):
    auth_url: str

@router.get("/google/url", response_model=AuthUrlResponse)
async def get_google_auth_url():
    """Get Google OAuth authorization URL"""
    auth_service = GoogleAuthService()
    auth_url = auth_service.get_authorization_url()
    return AuthUrlResponse(auth_url=auth_url)

@router.post("/google/callback", response_model=GoogleAuthResponse)
async def google_auth_callback(
    auth_request: GoogleAuthRequest,
    db: Session = Depends(get_db)
):
    """Handle Google OAuth callback"""
    auth_service = GoogleAuthService()
    
    # Exchange authorization code for token and get user info
    user_info = await auth_service.exchange_code_for_token(auth_request.token)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google authorization code"
        )
    
    # Check if user exists
    user = db.query(User).filter(User.google_id == user_info['google_id']).first()
    
    if not user:
        # Create new user
        user = User(
            email=user_info['email'],
            google_id=user_info['google_id'],
            name=user_info['name'],
            avatar_url=user_info.get('avatar_url')
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update existing user info
        user.name = user_info['name']
        user.avatar_url = user_info.get('avatar_url')
        db.commit()
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return GoogleAuthResponse(
        access_token=access_token,
        token_type="bearer",
        user={
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "avatar_url": user.avatar_url,
            "tiktok_username": user.tiktok_username,
            "offer_description": user.offer_description,
            "target_audience": user.target_audience
        }
    )

@router.post("/verify")
async def verify_token(
    token: str = Depends(security),
    db: Session = Depends(get_db)
):
    """Verify JWT token and return user info"""
    from app.core.security import verify_token
    
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
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "avatar_url": user.avatar_url,
        "tiktok_username": user.tiktok_username,
        "offer_description": user.offer_description,
        "target_audience": user.target_audience
    }
