"""Training module model."""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.database import Base


class Module(Base):
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(String(50), unique=True, nullable=False, index=True)  # e.g. FIRE-001
    title = Column(String(255), nullable=False)
    title_hi = Column(String(255), nullable=True)
    title_sat = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    description_hi = Column(Text, nullable=True)
    description_sat = Column(Text, nullable=True)
    icon = Column(String(10), default="🔥")
    version = Column(String(20), default="1.0")
    active = Column(Boolean, default=True)
    coming_soon = Column(Boolean, default=False)
    passing_score = Column(Integer, default=70)
    duration_minutes = Column(Integer, default=15)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    questions = relationship("Question", back_populates="module")
    attempts = relationship("TrainingAttempt", back_populates="module")
    certificates = relationship("Certificate", back_populates="module")
