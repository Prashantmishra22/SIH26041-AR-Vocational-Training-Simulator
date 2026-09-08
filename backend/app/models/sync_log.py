"""Sync log model — tracks offline data synchronization events."""

from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone

from app.database import Base


class SyncLog(Base):
    __tablename__ = "sync_logs"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String(100), nullable=False)
    user_id = Column(Integer, nullable=True)
    records_synced = Column(Integer, default=0)
    sync_type = Column(String(50), default="full")  # full, attempts, certificates
    status = Column(String(20), default="SUCCESS")  # SUCCESS, PARTIAL, FAILED
    synced_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
