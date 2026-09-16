"""
JH Safety AR — FastAPI Application
Main entry point for the backend server.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.config import APP_NAME, APP_VERSION, CORS_ORIGINS, CERTIFICATES_DIR
from app.database import init_db, SessionLocal
from app.routes import auth, modules, attempts, certificates, sync, admin
from app.routes import websocket_routes
from app.seed.seed_data import seed_database

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="AR-Based Industrial Safety Training & Certification Platform for Jharkhand",
)

# CORS — allow admin dashboard (port 3001/3000/5173) and mobile app
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for certificate PDFs
if os.path.exists(str(CERTIFICATES_DIR)):
    app.mount("/certificates", StaticFiles(directory=str(CERTIFICATES_DIR)), name="certificates")

# Register routes
app.include_router(auth.router)
app.include_router(modules.router)
app.include_router(attempts.router)
app.include_router(certificates.router)
app.include_router(sync.router)
app.include_router(admin.router)
app.include_router(websocket_routes.router)


@app.on_event("startup")
def startup():
    """Initialize database and seed demo data on first run."""
    init_db()
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()


@app.get("/")
def root():
    return {
        "name": APP_NAME,
        "version": APP_VERSION,
        "status": "running",
        "docs": "/docs",
        "endpoints": {
            "auth": "/api/auth",
            "modules": "/api/modules",
            "certificates": "/api/certificates",
            "sync": "/api/sync",
            "admin": "/api/admin",
        },
    }


from fastapi.responses import FileResponse
from pathlib import Path

@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/download/apk")
@app.get("/api/download/apk")
def download_apk():
    """Download the latest signed Android APK."""
    apk_path = Path(__file__).resolve().parent.parent.parent / "JH-Safety-AR.apk"
    if not apk_path.exists():
        apk_path = Path(__file__).resolve().parent.parent.parent / "JH-Safety-AR-Android" / "JH-Safety-AR.apk"
    return FileResponse(
        path=str(apk_path),
        filename="JH-Safety-AR.apk",
        media_type="application/vnd.android.package-archive"
    )
