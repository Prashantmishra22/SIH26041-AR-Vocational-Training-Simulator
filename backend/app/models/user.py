"""User model for workers and admins."""

from sqlalchemy import Column, Integer, String, DateTime, Enum as SAEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum

from app.database import Base


class UserRole(str, enum.Enum):
    WORKER = "worker"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    worker_id = Column(String(50), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=True)
    password_hash = Column(String(255), nullable=False)
    sector = Column(String(50), nullable=False)  # Mining, Steel, Mica
    organization = Column(String(255), nullable=True)
    district = Column(String(100), nullable=False)
    language = Column(String(10), default="en")  # en, hi, sat
    role = Column(SAEnum(UserRole), default=UserRole.WORKER)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    attempts = relationship("TrainingAttempt", back_populates="user")
    certificates = relationship("Certificate", back_populates="user")
