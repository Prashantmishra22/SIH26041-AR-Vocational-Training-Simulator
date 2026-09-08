"""Authentication routes — register, login, demo mode."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, DemoLoginRequest, TokenResponse
from app.schemas.user import UserResponse
from app.services.auth_service import register_user, login_user, demo_login
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new worker account."""
    user = register_user(db, req)
    result = login_user(db, LoginRequest(worker_id=req.worker_id, password=req.password))
    return result


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Login with worker ID and password."""
    return login_user(db, req)


@router.post("/demo", response_model=TokenResponse)
def demo(req: DemoLoginRequest = DemoLoginRequest(), db: Session = Depends(get_db)):
    """Demo mode — quick login for hackathon judges. No password required."""
    return demo_login(db, req)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user profile."""
    return current_user
