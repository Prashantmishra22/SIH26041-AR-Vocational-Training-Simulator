"""Certificate schemas."""

from pydantic import BaseModel
from datetime import datetime


class CertificateResponse(BaseModel):
    id: int
    certificate_id: str
    user_id: int
    module_id: int
    score: int
    issue_date: datetime
    status: str
    pdf_path: str | None = None

    class Config:
        from_attributes = True


class CertificateVerifyResponse(BaseModel):
    """Public verification response — shown when QR is scanned."""
    verified: bool
    certificate_id: str
    worker_name: str | None = None
    training_module: str | None = None
    score: int | None = None
    issue_date: datetime | None = None
    status: str
    message: str
