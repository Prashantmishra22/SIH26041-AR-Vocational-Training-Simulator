from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.models.sync_log import SyncLog
from app.models.attempt import TrainingAttempt
from app.models.module import Module
from app.models.user import User
from app.services.certificate_service import issue_certificate
import uuid


def _resolve_module(db: Session, module_ref: any) -> Module | None:
    """Resolve module by ID integer, module_id string, or keyword."""
    if not module_ref:
        return db.query(Module).first()
    
    if isinstance(module_ref, int):
        m = db.query(Module).filter(Module.id == module_ref).first()
        if m:
            return m

    m_str = str(module_ref)
    m = db.query(Module).filter(Module.module_id == m_str).first()
    if m:
        return m
    
    try:
        m_id = int(m_str)
        m = db.query(Module).filter(Module.id == m_id).first()
        if m:
            return m
    except ValueError:
        pass

    m_lower = m_str.lower()
    if "fire" in m_lower:
        return db.query(Module).filter(Module.module_id.ilike("%FIRE%")).first()
    elif "gas" in m_lower:
        return db.query(Module).filter(Module.module_id.ilike("%GAS%")).first()
    
    return db.query(Module).first()


def process_sync(db: Session, device_id: str, user_id: int, records: list[dict]) -> dict:
    """
    Process offline records synced from the Android app.
    
    Each record is a training attempt completed offline.
    """
    synced_count = 0
    errors = []
    user = db.query(User).filter(User.id == user_id).first()

    for record in records:
        try:
            attempt_id = record.get("attempt_id") or record.get("id") or f"AT-SYNC-{uuid.uuid4().hex[:8].upper()}"

            # Check for duplicate attempt_id
            existing = db.query(TrainingAttempt).filter(
                TrainingAttempt.attempt_id == attempt_id
            ).first()

            if existing:
                # Already synced — skip duplicate
                continue

            module = _resolve_module(db, record.get("module_id"))
            if not module:
                errors.append({"record": attempt_id, "error": "Module not found"})
                continue

            score = int(record.get("score", 0))
            passed = bool(record.get("passed", score >= 70))
            comp_time_raw = record.get("completed_at") or record.get("timestamp")
            
            if comp_time_raw:
                try:
                    comp_time = datetime.fromisoformat(comp_time_raw.replace("Z", "+00:00"))
                except Exception:
                    comp_time = datetime.now(timezone.utc)
            else:
                comp_time = datetime.now(timezone.utc)

            attempt = TrainingAttempt(
                attempt_id=attempt_id,
                user_id=user_id,
                module_id=module.id,
                score=score,
                passed=passed,
                duration_seconds=record.get("duration_seconds", 300),
                correct_answers=record.get("correct_answers", score // 10),
                incorrect_answers=record.get("incorrect_answers", 10 - (score // 10)),
                ar_score=record.get("ar_score", score),
                knowledge_score=record.get("knowledge_score", score),
                mistakes=record.get("mistakes"),
                sync_status="SYNCED",
                completed_at=comp_time,
            )
            db.add(attempt)
            db.flush()

            # Auto-issue certificate if passed
            if passed and score >= module.passing_score:
                try:
                    issue_certificate(db, user_id, module.module_id, score)
                except Exception:
                    pass

            synced_count += 1
        except Exception as e:
            errors.append({"record": str(record.get("attempt_id", "unknown")), "error": str(e)})

    if user:
        user.last_active = datetime.now(timezone.utc)

    # Log the sync event
    sync_log = SyncLog(
        device_id=device_id,
        user_id=user_id,
        records_synced=synced_count,
        sync_type="attempts",
        status="SUCCESS" if not errors else "PARTIAL",
    )
    db.add(sync_log)
    db.commit()

    return {
        "status": "SUCCESS" if not errors else "PARTIAL",
        "records_synced": synced_count,
        "errors": errors,
        "sync_timestamp": datetime.now(timezone.utc).isoformat(),
    }
