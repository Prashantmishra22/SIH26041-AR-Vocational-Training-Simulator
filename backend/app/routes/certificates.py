"""Certificate routes — listing, retrieval, verification, PDF download."""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os

from app.database import get_db
from app.models.certificate import Certificate
from app.models.user import User
from app.schemas.certificate import CertificateResponse, CertificateVerifyResponse
from app.services.certificate_service import verify_certificate
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/certificates", tags=["Certificates"])


@router.get("/", response_model=list[CertificateResponse])
def get_certificates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all certificates for the current user."""
    certs = db.query(Certificate).filter(Certificate.user_id == current_user.id).all()
    return certs


@router.get("/verify/{certificate_id}", response_model=CertificateVerifyResponse)
def verify(certificate_id: str, db: Session = Depends(get_db)):
    """
    Public verification endpoint — no authentication required.
    Called when a QR code is scanned.
    """
    result = verify_certificate(db, certificate_id)
    return result


@router.get("/{certificate_id}", response_model=CertificateResponse)
def get_certificate(
    certificate_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific certificate by ID."""
    cert = db.query(Certificate).filter(Certificate.certificate_id == certificate_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return cert


@router.get("/{certificate_id}/pdf")
def download_certificate_pdf(certificate_id: str, db: Session = Depends(get_db)):
    """Download the certificate PDF. Public endpoint for sharing."""
    cert = db.query(Certificate).filter(Certificate.certificate_id == certificate_id).first()
    if not cert or not cert.pdf_path:
        raise HTTPException(status_code=404, detail="Certificate PDF not found")

    if not os.path.exists(cert.pdf_path):
        raise HTTPException(status_code=404, detail="Certificate PDF file missing")

    return FileResponse(
        cert.pdf_path,
        media_type="application/pdf",
        filename=f"{certificate_id}.pdf",
    )
