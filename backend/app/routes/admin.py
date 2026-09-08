"""Admin dashboard routes — statistics, worker management, compliance monitoring."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct

from app.database import get_db
from app.models.user import User
from app.models.module import Module
from app.models.attempt import TrainingAttempt
from app.models.certificate import Certificate
from app.models.sync_log import SyncLog
from app.utils.security import require_admin

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    """
    Get admin dashboard statistics.
    Public for hackathon demo — in production, add require_admin dependency.
    """
    total_workers = db.query(User).count()

    # Workers who have at least one completed attempt
    trained_workers = db.query(distinct(TrainingAttempt.user_id)).count()

    total_certificates = db.query(Certificate).count()

    avg_score = db.query(func.avg(TrainingAttempt.score)).scalar()
    avg_score = round(avg_score, 1) if avg_score else 0

    total_attempts = db.query(TrainingAttempt).count()
    passed_attempts = db.query(TrainingAttempt).filter(TrainingAttempt.passed == True).count()
    pass_rate = round((passed_attempts / total_attempts * 100) if total_attempts > 0 else 0, 1)

    pending_workers = total_workers - trained_workers

    # Module-wise performance
    modules = db.query(Module).filter(Module.active == True, Module.coming_soon == False).all()
    module_stats = []
    for m in modules:
        m_attempts = db.query(TrainingAttempt).filter(TrainingAttempt.module_id == m.id).all()
        m_avg = round(sum(a.score for a in m_attempts) / len(m_attempts), 1) if m_attempts else 0
        m_passed = sum(1 for a in m_attempts if a.passed)
        module_stats.append({
            "module_id": m.module_id,
            "title": m.title,
            "icon": m.icon,
            "total_attempts": len(m_attempts),
            "avg_score": m_avg,
            "pass_rate": round((m_passed / len(m_attempts) * 100) if m_attempts else 0, 1),
        })

    # Sector distribution
    sector_stats = (
        db.query(User.sector, func.count(User.id))
        .group_by(User.sector)
        .all()
    )

    # Language distribution
    lang_stats = (
        db.query(User.language, func.count(User.id))
        .group_by(User.language)
        .all()
    )

    return {
        "total_workers": total_workers,
        "trained_workers": trained_workers,
        "total_certificates": total_certificates,
        "average_score": avg_score,
        "pass_rate": pass_rate,
        "pending_training": pending_workers,
        "total_attempts": total_attempts,
        "module_stats": module_stats,
        "sector_distribution": [{"sector": s, "count": c} for s, c in sector_stats],
        "language_distribution": [{"language": l, "count": c} for l, c in lang_stats],
    }


@router.get("/workers")
def get_workers(
    sector: str | None = Query(None),
    district: str | None = Query(None),
    db: Session = Depends(get_db),
):
    """Get worker list with filtering."""
    query = db.query(User)

    if sector:
        query = query.filter(User.sector == sector)
    if district:
        query = query.filter(User.district == district)

    workers = query.all()

    result = []
    for w in workers:
        attempts = db.query(TrainingAttempt).filter(TrainingAttempt.user_id == w.id).all()
        certs = db.query(Certificate).filter(Certificate.user_id == w.id).all()
        latest = max(attempts, key=lambda a: a.completed_at) if attempts else None

        completed_modules = len(set(
            a.module_id for a in attempts if a.passed
        ))

        result.append({
            "id": w.id,
            "name": w.name,
            "worker_id": w.worker_id,
            "sector": w.sector,
            "district": w.district,
            "language": w.language,
            "phone": w.phone,
            "modules_completed": completed_modules,
            "total_attempts": len(attempts),
            "latest_score": latest.score if latest else None,
            "certificates": len(certs),
            "status": "Trained" if completed_modules > 0 else "Pending",
            "created_at": w.created_at.isoformat() if w.created_at else None,
        })

    return result


@router.get("/attempts")
def get_all_attempts(
    module_id: str | None = Query(None),
    passed: bool | None = Query(None),
    db: Session = Depends(get_db),
):
    """Get all training attempts with optional filters."""
    query = db.query(TrainingAttempt)

    if module_id:
        module = db.query(Module).filter(Module.module_id == module_id).first()
        if module:
            query = query.filter(TrainingAttempt.module_id == module.id)

    if passed is not None:
        query = query.filter(TrainingAttempt.passed == passed)

    attempts = query.order_by(TrainingAttempt.completed_at.desc()).all()

    result = []
    for a in attempts:
        user = db.query(User).filter(User.id == a.user_id).first()
        module = db.query(Module).filter(Module.id == a.module_id).first()
        result.append({
            "id": a.id,
            "attempt_id": a.attempt_id,
            "worker_name": user.name if user else "Unknown",
            "worker_id": user.worker_id if user else "Unknown",
            "module": module.title if module else "Unknown",
            "score": a.score,
            "passed": a.passed,
            "duration_seconds": a.duration_seconds,
            "completed_at": a.completed_at.isoformat() if a.completed_at else None,
        })

    return result


@router.get("/certificates")
def get_all_certificates(
    status: str | None = Query(None),
    db: Session = Depends(get_db),
):
    """Get all issued certificates with optional status filter."""
    query = db.query(Certificate)

    if status:
        query = query.filter(Certificate.status == status)

    certs = query.order_by(Certificate.issue_date.desc()).all()

    result = []
    for c in certs:
        user = db.query(User).filter(User.id == c.user_id).first()
        module = db.query(Module).filter(Module.id == c.module_id).first()
        result.append({
            "id": c.id,
            "certificate_id": c.certificate_id,
            "worker_name": user.name if user else "Unknown",
            "worker_id": user.worker_id if user else "Unknown",
            "module": module.title if module else "Unknown",
            "score": c.score,
            "issue_date": c.issue_date.isoformat() if c.issue_date else None,
            "status": c.status.value if c.status else "UNKNOWN",
        })

    return result
