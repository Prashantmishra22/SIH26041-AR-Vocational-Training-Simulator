"""Authentication service."""

from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.user import User, UserRole
from app.schemas.auth import RegisterRequest, LoginRequest, DemoLoginRequest
from app.utils.security import hash_password, verify_password, create_access_token


from datetime import datetime, timezone

def register_user(db: Session, req: RegisterRequest) -> User:
    """Register a new worker or update profile if already registered."""
    existing = db.query(User).filter(User.worker_id == req.worker_id).first()
    now = datetime.now(timezone.utc)
    if existing:
        existing.name = req.name
        if req.phone:
            existing.phone = req.phone
        if req.sector:
            existing.sector = req.sector
        if req.organization:
            existing.organization = req.organization
        if req.district:
            existing.district = req.district
        if req.language:
            existing.language = req.language
        existing.password_hash = hash_password(req.password)
        existing.last_active = now
        db.commit()
        db.refresh(existing)
        return existing

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
        created_at=now,
        last_active=now,
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

    user.last_active = datetime.now(timezone.utc)
    db.commit()

    token = create_access_token({"user_id": user.id, "role": user.role.value})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "worker_id": user.worker_id,
        "name": user.name,
        "sector": user.sector,
        "district": user.district,
        "language": user.language,
        "role": user.role.value,
    }


def demo_login(db: Session, req: DemoLoginRequest) -> dict:
    """
    Demo mode login — creates or retrieves a demo worker.
    No password required for quick hackathon demonstration.
    """
    user = db.query(User).filter(User.worker_id == req.worker_id).first()
    now = datetime.now(timezone.utc)
    if not user:
        user = User(
            name=req.name,
            worker_id=req.worker_id,
            password_hash=hash_password("demo123"),
            sector=req.sector,
            district=req.district,
            language="hi",
            role=UserRole.WORKER,
            created_at=now,
            last_active=now,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.last_active = now
        db.commit()

    token = create_access_token({"user_id": user.id, "role": user.role.value})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "worker_id": user.worker_id,
        "name": user.name,
        "sector": user.sector,
        "district": user.district,
        "language": user.language,
        "role": user.role.value,
    }


def update_user_profile(db: Session, user: User, updates: dict) -> User:
    """Update profile attributes for the specified user."""
    if updates.get("name"):
        user.name = updates["name"]
    if updates.get("phone") is not None:
        user.phone = updates["phone"]
    if updates.get("organization") is not None:
        user.organization = updates["organization"]
    if updates.get("sector"):
        user.sector = updates["sector"]
    if updates.get("district"):
        user.district = updates["district"]
    if updates.get("language"):
        user.language = updates["language"]
    
    user.last_active = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)
    return user
