"""Training attempt model — records each assessment completion."""

from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.database import Base


class TrainingAttempt(Base):
    __tablename__ = "training_attempts"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(String(50), unique=True, nullable=False, index=True)  # e.g. AT-001
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    module_id = Column(Integer, ForeignKey("modules.id"), nullable=False)
    score = Column(Integer, nullable=False)  # 0-100
    passed = Column(Boolean, nullable=False)
    duration_seconds = Column(Integer, nullable=True)
    correct_answers = Column(Integer, default=0)
    incorrect_answers = Column(Integer, default=0)
    ar_score = Column(Integer, nullable=True)  # practical AR score
    knowledge_score = Column(Integer, nullable=True)  # assessment score
    mistakes = Column(JSON, nullable=True)  # List of mistake descriptions
    sync_status = Column(String(20), default="SYNCED")  # SYNCED, PENDING_SYNC
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="attempts")
    module = relationship("Module", back_populates="attempts")
