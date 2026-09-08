"""Module and question schemas."""

from pydantic import BaseModel
from typing import Any


class ModuleResponse(BaseModel):
    id: int
    module_id: str
    title: str
    title_hi: str | None = None
    title_sat: str | None = None
    description: str | None = None
    description_hi: str | None = None
    description_sat: str | None = None
    icon: str
    version: str
    active: bool
    coming_soon: bool
    passing_score: int
    duration_minutes: int

    class Config:
        from_attributes = True


class QuestionResponse(BaseModel):
    id: int
    question_type: str
    question: str
    question_hi: str | None = None
    question_sat: str | None = None
    options: list[Any]
    options_hi: list[Any] | None = None
    options_sat: list[Any] | None = None
    correct_answer: str
    explanation: str | None = None
    explanation_hi: str | None = None
    points: int

    class Config:
        from_attributes = True
