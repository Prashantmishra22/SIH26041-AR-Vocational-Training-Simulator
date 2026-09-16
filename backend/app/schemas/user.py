"""User schemas."""

from pydantic import BaseModel
from datetime import datetime


class UserBase(BaseModel):
    name: str
    worker_id: str
    sector: str
    district: str
    language: str = "en"


class UserResponse(UserBase):
    id: int
    phone: str | None = None
    organization: str | None = None
    role: str
    created_at: datetime
    last_active: datetime | None = None

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    organization: str | None = None
    sector: str | None = None
    district: str | None = None
    language: str | None = None


class UserProgressResponse(BaseModel):
    user: UserResponse
    total_modules: int
    completed_modules: int
    progress_percentage: float
    latest_score: int | None
    total_certificates: int
    attempts: list = []
