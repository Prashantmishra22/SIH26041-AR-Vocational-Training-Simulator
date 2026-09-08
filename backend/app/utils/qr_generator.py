"""QR code generation utility for certificates."""

import qrcode
import io
import base64
from app.config import CERTIFICATE_BASE_URL


def generate_qr_code(certificate_id: str) -> str:
    """
    Generate a QR code containing the verification URL.
    Returns base64-encoded PNG image string.
    
    The QR encodes only the verification URL — no sensitive worker data.
    """
    verification_url = f"{CERTIFICATE_BASE_URL}/api/certificates/verify/{certificate_id}"

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4,
    )
    qr.add_data(verification_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)

    return base64.b64encode(buffer.read()).decode("utf-8")


def get_verification_url(certificate_id: str) -> str:
    """Get the public verification URL for a certificate."""
    return f"{CERTIFICATE_BASE_URL}/api/certificates/verify/{certificate_id}"
