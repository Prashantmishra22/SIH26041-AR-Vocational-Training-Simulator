"""Training attempt routes."""

import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.attempt import TrainingAttempt
from app.models.module import Module
from app.models.user import User
from app.schemas.attempt import AttemptCreate, AttemptResponse
from app.schemas.user import UserProgressResponse, UserResponse
from app.utils.security import get_current_user
from app.services.certificate_service import issue_certificate

router = APIRouter(prefix="/api", tags=["Attempts"])


@router.post("/attempts", response_model=AttemptResponse)
def create_attempt(
    req: AttemptCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Submit a completed training attempt. Auto-issues certificate if passed."""
    module = db.query(Module).filter(Module.module_id == req.module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    attempt = TrainingAttempt(
        attempt_id=f"AT-{uuid.uuid4().hex[:8].upper()}",
        user_id=current_user.id,
        module_id=module.id,
        score=req.score,
        passed=req.passed,
        duration_seconds=req.duration_seconds,
        correct_answers=req.correct_answers,
        incorrect_answers=req.incorrect_answers,
        ar_score=req.ar_score,
        knowledge_score=req.knowledge_score,
        mistakes=req.mistakes,
        sync_status="SYNCED",
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    # Auto-issue certificate if passed
    if req.passed and req.score >= module.passing_score:
        try:
            issue_certificate(db, current_user.id, req.module_id, req.score)
        except Exception:
            pass  # Certificate generation failure shouldn't block attempt recording

    return attempt


@router.get("/users/{user_id}/progress", response_model=UserProgressResponse)
def get_user_progress(
    user_id: int,
    db: Session = Depends(get_db),
):
    """Get a worker's training progress."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    total_modules = db.query(Module).filter(Module.active == True, Module.coming_soon == False).count()

    # Modules where user has passed at least once
    from sqlalchemy import func, distinct
    completed_module_ids = (
        db.query(distinct(TrainingAttempt.module_id))
        .filter(TrainingAttempt.user_id == user_id, TrainingAttempt.passed == True)
        .all()
    )
    completed = len(completed_module_ids)

    # Latest attempt
    latest = (
        db.query(TrainingAttempt)
        .filter(TrainingAttempt.user_id == user_id)
        .order_by(TrainingAttempt.completed_at.desc())
        .first()
    )

    from app.models.certificate import Certificate
    cert_count = db.query(Certificate).filter(Certificate.user_id == user_id).count()

    # All attempts
    attempts = (
        db.query(TrainingAttempt)
        .filter(TrainingAttempt.user_id == user_id)
        .order_by(TrainingAttempt.completed_at.desc())
        .all()
    )

    return UserProgressResponse(
        user=UserResponse.model_validate(user),
        total_modules=total_modules,
        completed_modules=completed,
        progress_percentage=round((completed / total_modules * 100) if total_modules > 0 else 0, 1),
        latest_score=latest.score if latest else None,
        total_certificates=cert_count,
        attempts=[AttemptResponse.model_validate(a) for a in attempts],
    )
