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

from datetime import datetime, timezone

router = APIRouter(prefix="/api", tags=["Attempts"])


def _find_module(db: Session, module_id_str: str) -> Module | None:
    """Find module by exact module_id, numeric ID, or title/keyword match."""
    # Exact module_id match
    module = db.query(Module).filter(Module.module_id == module_id_str).first()
    if module:
        return module
    
    # Check if numeric
    try:
        m_id = int(module_id_str)
        module = db.query(Module).filter(Module.id == m_id).first()
        if module:
            return module
    except ValueError:
        pass
    
    # Substring / keyword match (e.g. "fire", "gas")
    m_lower = module_id_str.lower()
    if "fire" in m_lower:
        return db.query(Module).filter(Module.module_id.ilike("%FIRE%")).first()
    elif "gas" in m_lower:
        return db.query(Module).filter(Module.module_id.ilike("%GAS%")).first()
    
    # Fallback to first available module
    return db.query(Module).first()


@router.post("/attempts", response_model=AttemptResponse)
def create_attempt(
    req: AttemptCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Submit a completed training attempt. Auto-issues certificate if passed."""
    # Deduplication check if attempt_id is provided
    if req.attempt_id:
        existing = db.query(TrainingAttempt).filter(TrainingAttempt.attempt_id == req.attempt_id).first()
        if existing:
            current_user.last_active = datetime.now(timezone.utc)
            db.commit()
            return existing

    module = _find_module(db, req.module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    attempt_id = req.attempt_id if req.attempt_id else f"AT-{uuid.uuid4().hex[:8].upper()}"

    attempt = TrainingAttempt(
        attempt_id=attempt_id,
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
        completed_at=datetime.now(timezone.utc),
    )
    db.add(attempt)
    current_user.last_active = datetime.now(timezone.utc)
    db.commit()
    db.refresh(attempt)

    # Auto-issue certificate if passed
    issued_cert = None
    if req.passed and req.score >= module.passing_score:
        try:
            issued_cert = issue_certificate(db, current_user.id, module.module_id, req.score)
        except Exception:
            pass  # Certificate generation failure shouldn't block attempt recording

    # Real-time WebSocket event broadcast to all connected Admin dashboards
    try:
        from app.websocket_store import store
        import asyncio
        worker_name = current_user.name or f"Worker {current_user.worker_id}"
        mod_title = module.title if module else "Safety Training"
        status_str = "PASS" if req.passed else "FAIL"

        attempt_event = {
            "type": "WORKER_EVENT",
            "worker_id": current_user.worker_id,
            "event_type": "SCORE_GENERATED",
            "module": module.module_id if module else req.module_id,
            "description": f"Worker {worker_name} completed {mod_title} — Score: {req.score}% ({status_str})",
            "score": req.score,
            "status": status_str,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "worker_status": (store.worker_status.get(current_user.worker_id).to_dict() 
                              if current_user.worker_id in store.worker_status else None),
        }
        store.activity_feed.append(attempt_event)
        asyncio.create_task(store.broadcast_to_admins(attempt_event))

        if issued_cert:
            cert_event = {
                "type": "WORKER_EVENT",
                "worker_id": current_user.worker_id,
                "event_type": "CERTIFICATE_GENERATED",
                "module": module.module_id if module else req.module_id,
                "description": f"DGMS Certificate {issued_cert.certificate_id} issued to {worker_name}",
                "score": req.score,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": {
                    "certificate_id": issued_cert.certificate_id,
                    "worker_name": worker_name,
                    "score": req.score,
                },
                "worker_status": (store.worker_status.get(current_user.worker_id).to_dict() 
                                  if current_user.worker_id in store.worker_status else None),
            }
            store.activity_feed.append(cert_event)
            asyncio.create_task(store.broadcast_to_admins(cert_event))
    except Exception:
        pass

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
