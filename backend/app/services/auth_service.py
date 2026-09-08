"""Authentication service."""

from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.user import User, UserRole
from app.schemas.auth import RegisterRequest, LoginRequest, DemoLoginRequest
from app.utils.security import hash_password, verify_password, create_access_token


def register_user(db: Session, req: RegisterRequest) -> User:
    """Register a new worker."""
    existing = db.query(User).filter(User.worker_id == req.worker_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Worker ID already registered")

    user = User(
        name=req.name,
        worker_id=req.worker_id,
        phone=req.phone,
        password_hash=hash_password(req.password),
        sector=req.sector,
        organization=req.organization,
        district=req.district,
        language=req.language,
        role=UserRole.WORKER,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def login_user(db: Session, req: LoginRequest) -> dict:
    """Authenticate a worker and return a JWT token."""
    user = db.query(User).filter(User.worker_id == req.worker_id).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid worker ID or password")

    token = create_access_token({"user_id": user.id, "role": user.role.value})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "name": user.name,
        "role": user.role.value,
    }


def demo_login(db: Session, req: DemoLoginRequest) -> dict:
    """
    Demo mode login — creates or retrieves a demo worker.
    No password required for quick hackathon demonstration.
    """
    user = db.query(User).filter(User.worker_id == req.worker_id).first()
    if not user:
        user = User(
            name=req.name,
            worker_id=req.worker_id,
            password_hash=hash_password("demo123"),
            sector=req.sector,
            district=req.district,
            language="hi",
            role=UserRole.WORKER,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({"user_id": user.id, "role": user.role.value})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "name": user.name,
        "role": user.role.value,
    }
