"""Authentication schemas."""

from pydantic import BaseModel


class LoginRequest(BaseModel):
    worker_id: str
    password: str


class RegisterRequest(BaseModel):
    name: str
    worker_id: str
    phone: str | None = None
    password: str
    sector: str
    organization: str | None = None
    district: str
    language: str = "en"


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    name: str
    role: str


class DemoLoginRequest(BaseModel):
    """For demo mode — no password needed."""
    name: str = "Rahul Kumar"
    worker_id: str = "DEMO-001"
    sector: str = "Mining"
    district: str = "Dhanbad"
