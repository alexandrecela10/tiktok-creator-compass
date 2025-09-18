from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.session import get_db
from app.core.security import create_access_token
from app.models.user import User

router = APIRouter()
security = HTTPBearer()

class LoginRequest(BaseModel):
    email: str
    name: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

@router.post("/login", response_model=AuthResponse)
async def login(
    login_request: LoginRequest,
    db: Session = Depends(get_db)
):
    """Simple login endpoint - creates or finds user by email"""
    
    # Check if user exists
    user = db.query(User).filter(User.email == login_request.email).first()
    
    if not user:
        # Create new user
        user = User(
            email=login_request.email,
            name=login_request.name
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update existing user info
        user.name = login_request.name
        db.commit()
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return AuthResponse(
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
