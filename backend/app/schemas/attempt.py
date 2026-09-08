"""Training attempt schemas."""

from pydantic import BaseModel
from datetime import datetime
from typing import Any


class AttemptCreate(BaseModel):
    module_id: str  # Module's module_id field (e.g. FIRE-001)
    score: int
    passed: bool
    duration_seconds: int | None = None
    correct_answers: int = 0
    incorrect_answers: int = 0
    ar_score: int | None = None
    knowledge_score: int | None = None
    mistakes: list[str] | None = None


class AttemptResponse(BaseModel):
    id: int
    attempt_id: str
    user_id: int
    module_id: int
    score: int
    passed: bool
    duration_seconds: int | None
    correct_answers: int
    incorrect_answers: int
    ar_score: int | None
    knowledge_score: int | None
    mistakes: list[Any] | None
    sync_status: str
    completed_at: datetime

    class Config:
        from_attributes = True
