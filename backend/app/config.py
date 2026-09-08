"""
Application configuration.
Loads settings from environment variables with sensible defaults for local development.
"""

import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Database - SQLite for dev, PostgreSQL for production
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{BASE_DIR / 'jh_safety.db'}"
)

# JWT Settings
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jh-safety-ar-dev-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24 hours

# Application
APP_NAME = "JH Safety AR - Industrial Safety Training Platform"
APP_VERSION = "1.0.0"
DEBUG = os.getenv("DEBUG", "true").lower() == "true"

# CORS
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

# Certificate
CERTIFICATE_BASE_URL = os.getenv("CERTIFICATE_BASE_URL", "http://localhost:8000")
CERTIFICATE_PREFIX = "JH-SAFE"

# File storage
CERTIFICATES_DIR = BASE_DIR / "generated_certificates"
CERTIFICATES_DIR.mkdir(exist_ok=True)
