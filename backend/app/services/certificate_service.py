"""Certificate service — generation, verification, revocation."""

import random
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.certificate import Certificate, CertificateStatus
from app.models.user import User
from app.models.module import Module
from app.config import CERTIFICATE_PREFIX
from app.utils.pdf_generator import generate_certificate_pdf
from app.utils.qr_generator import get_verification_url


def generate_certificate_id() -> str:
    """Generate a unique certificate ID in format JH-SAFE-YYYY-XXXXXX."""
    year = datetime.now().year
    seq = random.randint(100000, 999999)
    return f"{CERTIFICATE_PREFIX}-{year}-{seq:06d}"


def issue_certificate(db: Session, user_id: int, module_id_str: str, score: int) -> Certificate:
    """
    Issue a new certificate for a passed assessment.
    Generates PDF and QR code.
    """
    # Get module by module_id string
    module = db.query(Module).filter(Module.module_id == module_id_str).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if score < module.passing_score:
        raise HTTPException(status_code=400, detail="Score below passing threshold. Cannot issue certificate.")

    # Generate unique certificate ID
    cert_id = generate_certificate_id()
    while db.query(Certificate).filter(Certificate.certificate_id == cert_id).first():
        cert_id = generate_certificate_id()

    issue_date = datetime.now(timezone.utc)

    # Generate PDF
    pdf_path = generate_certificate_pdf(
        certificate_id=cert_id,
        worker_name=user.name,
        worker_id=user.worker_id,
        sector=user.sector,
        module_title=module.title,
        score=score,
        issue_date=issue_date,
    )

    # Create certificate record
    cert = Certificate(
        certificate_id=cert_id,
        user_id=user.id,
        module_id=module.id,
        score=score,
        issue_date=issue_date,
        status=CertificateStatus.VALID,
        pdf_path=pdf_path,
        qr_data=get_verification_url(cert_id),
    )
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert


def verify_certificate(db: Session, certificate_id: str) -> dict:
    """
    Verify a certificate by its ID.
    Returns public verification info (shown when QR is scanned).
    """
    cert = db.query(Certificate).filter(Certificate.certificate_id == certificate_id).first()

    if not cert:
        return {
            "verified": False,
            "certificate_id": certificate_id,
            "status": "INVALID",
            "message": "Certificate not found. This certificate ID does not exist in our records.",
        }

    user = db.query(User).filter(User.id == cert.user_id).first()
    module = db.query(Module).filter(Module.id == cert.module_id).first()

    return {
        "verified": cert.status == CertificateStatus.VALID,
        "certificate_id": cert.certificate_id,
        "worker_name": user.name if user else "Unknown",
        "training_module": module.title if module else "Unknown",
        "score": cert.score,
        "issue_date": cert.issue_date,
        "status": cert.status.value,
        "message": "Certificate is valid and verified." if cert.status == CertificateStatus.VALID
                   else f"Certificate status: {cert.status.value}",
    }


def revoke_certificate(db: Session, certificate_id: str) -> Certificate:
    """Revoke a certificate (admin action)."""
    cert = db.query(Certificate).filter(Certificate.certificate_id == certificate_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")

    cert.status = CertificateStatus.REVOKED
    db.commit()
    db.refresh(cert)
    return cert
