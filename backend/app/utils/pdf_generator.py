"""PDF certificate generation utility."""

from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.units import inch, cm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os
import io
import base64
from datetime import datetime

from app.config import CERTIFICATES_DIR
from app.utils.qr_generator import generate_qr_code


def generate_certificate_pdf(
    certificate_id: str,
    worker_name: str,
    worker_id: str,
    sector: str,
    module_title: str,
    score: int,
    issue_date: datetime
) -> str:
    """
    Generate a professional PDF certificate.
    Returns the file path to the saved PDF.
    """
    filename = f"{certificate_id}.pdf"
    filepath = os.path.join(str(CERTIFICATES_DIR), filename)

    width, height = landscape(A4)
    c = canvas.Canvas(filepath, pagesize=landscape(A4))

    # --- Border ---
    border_color = HexColor("#1a365d")
    c.setStrokeColor(border_color)
    c.setLineWidth(3)
    c.rect(30, 30, width - 60, height - 60)
    c.setLineWidth(1)
    c.rect(40, 40, width - 80, height - 80)

    # --- Header ---
    c.setFillColor(HexColor("#1a365d"))
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(width / 2, height - 80, "Government of Jharkhand")

    c.setFont("Helvetica", 11)
    c.drawCentredString(width / 2, height - 100, "Department of Labour, Employment, Training & Skill Development")

    # --- Title ---
    c.setFillColor(HexColor("#c53030"))
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width / 2, height - 145, "Industrial Safety Training Certificate")

    # --- Decorative line ---
    c.setStrokeColor(HexColor("#c53030"))
    c.setLineWidth(2)
    c.line(width / 2 - 200, height - 155, width / 2 + 200, height - 155)

    # --- Body text ---
    c.setFillColor(HexColor("#2d3748"))
    c.setFont("Helvetica", 12)
    c.drawCentredString(width / 2, height - 190, "This is to certify that")

    # Worker name
    c.setFillColor(HexColor("#1a365d"))
    c.setFont("Helvetica-Bold", 22)
    c.drawCentredString(width / 2, height - 220, worker_name)

    # Worker ID
    c.setFillColor(HexColor("#4a5568"))
    c.setFont("Helvetica", 11)
    c.drawCentredString(width / 2, height - 242, f"Worker ID: {worker_id}  |  Sector: {sector}")

    # Completion text
    c.setFillColor(HexColor("#2d3748"))
    c.setFont("Helvetica", 12)
    c.drawCentredString(width / 2, height - 272, "has successfully completed the")

    # Module title
    c.setFillColor(HexColor("#c53030"))
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width / 2, height - 298, module_title)

    # Score
    c.setFillColor(HexColor("#2d3748"))
    c.setFont("Helvetica", 12)
    c.drawCentredString(width / 2, height - 325, f"with a score of {score}%")

    # --- QR Code ---
    qr_b64 = generate_qr_code(certificate_id)
    qr_data = base64.b64decode(qr_b64)
    qr_buffer = io.BytesIO(qr_data)

    from reportlab.lib.utils import ImageReader
    qr_image = ImageReader(qr_buffer)
    qr_size = 80
    c.drawImage(qr_image, width - 160, 55, width=qr_size, height=qr_size)

    c.setFillColor(HexColor("#4a5568"))
    c.setFont("Helvetica", 7)
    c.drawCentredString(width - 120, 48, "Scan to verify")

    # --- Footer details ---
    c.setFillColor(HexColor("#4a5568"))
    c.setFont("Helvetica", 10)

    left_x = 80
    c.drawString(left_x, 110, f"Certificate ID: {certificate_id}")
    c.drawString(left_x, 93, f"Issue Date: {issue_date.strftime('%d %B %Y')}")
    c.drawString(left_x, 76, f"Status: VALID")

    # --- Signature lines ---
    sig_y = 85
    c.setStrokeColor(HexColor("#a0aec0"))
    c.setLineWidth(0.5)

    # Left signature
    c.line(width / 2 - 50, sig_y, width / 2 + 100, sig_y)
    c.setFont("Helvetica", 9)
    c.drawCentredString(width / 2 + 25, sig_y - 12, "Authorized Signatory")

    c.save()
    return filepath
