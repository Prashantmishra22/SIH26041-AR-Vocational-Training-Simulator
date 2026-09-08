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

    class Config:
        from_attributes = True


class UserProgressResponse(BaseModel):
    user: UserResponse
    total_modules: int
    completed_modules: int
    progress_percentage: float
    latest_score: int | None
    total_certificates: int
    attempts: list = []
