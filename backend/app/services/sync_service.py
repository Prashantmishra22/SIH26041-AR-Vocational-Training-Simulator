"""Offline sync service — processes batched records from the mobile app."""

from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.models.sync_log import SyncLog
from app.models.attempt import TrainingAttempt
import uuid


def process_sync(db: Session, device_id: str, user_id: int, records: list[dict]) -> dict:
    """
    Process offline records synced from the Android app.
    
    Each record is a training attempt that was completed offline.
    """
    synced_count = 0
    errors = []

    for record in records:
        try:
            # Check for duplicate attempt_id
            existing = db.query(TrainingAttempt).filter(
                TrainingAttempt.attempt_id == record.get("attempt_id")
            ).first()

            if existing:
                # Already synced — skip
                continue

            attempt = TrainingAttempt(
                attempt_id=record.get("attempt_id", f"AT-SYNC-{uuid.uuid4().hex[:8]}"),
                user_id=user_id,
                module_id=record.get("module_id"),
                score=record.get("score", 0),
                passed=record.get("passed", False),
                duration_seconds=record.get("duration_seconds"),
                correct_answers=record.get("correct_answers", 0),
                incorrect_answers=record.get("incorrect_answers", 0),
                ar_score=record.get("ar_score"),
                knowledge_score=record.get("knowledge_score"),
                mistakes=record.get("mistakes"),
                sync_status="SYNCED",
                completed_at=datetime.fromisoformat(record["completed_at"]) if record.get("completed_at") else datetime.now(timezone.utc),
            )
            db.add(attempt)
            synced_count += 1
        except Exception as e:
            errors.append({"record": record.get("attempt_id", "unknown"), "error": str(e)})

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
