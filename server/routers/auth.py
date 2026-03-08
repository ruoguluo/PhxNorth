from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from schemas.user import UserResponse
from utils.security import hash_password, verify_password, create_access_token
from utils.deps import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user and return JWT token."""
    # Check for existing email
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    # Check for existing username
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )

    user = User(
        email=req.email,
        username=req.username,
        full_name=req.full_name,
        hashed_password=hash_password(req.password),
        role=req.role,
        keep_name_private=req.keep_name_private,
        status=req.status,
        degree_level=req.degree_level,
        field_of_study=req.field_of_study,
        years_experience=req.years_experience,
        current_country=req.current_country,
        interested_countries=req.interested_countries,
        industry=req.industry,
        sector=req.sector,
        sub_sector=req.sub_sector,
        interested_industries=req.interested_industries,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": str(user.id)})
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token."""
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    token = create_access_token(data={"sub": str(user.id)})
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get the current authenticated user's profile."""
    return current_user
