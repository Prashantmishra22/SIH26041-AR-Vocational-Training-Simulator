"""Certificate model with QR verification support."""

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum as SAEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum

from app.database import Base


class CertificateStatus(str, enum.Enum):
    VALID = "VALID"
    INVALID = "INVALID"
    REVOKED = "REVOKED"


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    certificate_id = Column(String(50), unique=True, nullable=False, index=True)  # JH-SAFE-YYYY-XXXXXX
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    module_id = Column(Integer, ForeignKey("modules.id"), nullable=False)
    score = Column(Integer, nullable=False)
    issue_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(SAEnum(CertificateStatus), default=CertificateStatus.VALID)
    pdf_path = Column(String(500), nullable=True)
    qr_data = Column(String(500), nullable=True)

    # Relationships
    user = relationship("User", back_populates="certificates")
    module = relationship("Module", back_populates="certificates")
