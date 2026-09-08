"""Tests for authentication, assessment, certificates, and API endpoints."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.services.assessment_service import calculate_score, calculate_combined_score

# ──────────────────────────────────────────────
# Test Database Setup
# ──────────────────────────────────────────────
TEST_DATABASE_URL = "sqlite:///./test_jh_safety.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestSession()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    """Create tables before each test, drop after."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


# ──────────────────────────────────────────────
# Assessment Scoring Tests
# ──────────────────────────────────────────────
class TestAssessmentScoring:
    """Verify the 70% pass threshold boundary."""

    def test_perfect_score(self):
        result = calculate_score(10, 10)
        assert result["score"] == 100
        assert result["percentage"] == 100
        assert result["passed"] is True

    def test_exact_pass_boundary(self):
        """70% should pass."""
        result = calculate_score(7, 10)
        assert result["percentage"] == 70
        assert result["passed"] is True

    def test_just_below_pass(self):
        """69% should fail — critical boundary test."""
        # 6.9 correct out of 10 isn't possible with integer answers,
        # but 6/10 = 60% fails
        result = calculate_score(6, 10)
        assert result["percentage"] == 60
        assert result["passed"] is False

    def test_zero_score(self):
        result = calculate_score(0, 10)
        assert result["score"] == 0
        assert result["passed"] is False

    def test_combined_score(self):
        """AR 40% + Knowledge 60% weighting."""
        result = calculate_combined_score(80, 90)
        # 80*0.4 + 90*0.6 = 32 + 54 = 86
        assert result["combined_score"] == 86
        assert result["passed"] is True

    def test_combined_score_fail(self):
        result = calculate_combined_score(50, 50)
        # 50*0.4 + 50*0.6 = 20 + 30 = 50
        assert result["combined_score"] == 50
        assert result["passed"] is False


# ──────────────────────────────────────────────
# API Tests
# ──────────────────────────────────────────────
class TestAPI:

    def test_root(self):
        response = client.get("/")
        assert response.status_code == 200
        assert "name" in response.json()

    def test_health(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

    def test_demo_login(self):
        response = client.post("/api/auth/demo", json={
            "name": "Test Worker",
            "worker_id": "TEST-001",
            "sector": "Mining",
            "district": "Dhanbad",
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["name"] == "Test Worker"

    def test_register_and_login(self):
        # Register
        response = client.post("/api/auth/register", json={
            "name": "New Worker",
            "worker_id": "NEW-001",
            "password": "password123",
            "sector": "Steel",
            "district": "Bokaro",
        })
        assert response.status_code == 200

        # Login
        response = client.post("/api/auth/login", json={
            "worker_id": "NEW-001",
            "password": "password123",
        })
        assert response.status_code == 200
        assert "access_token" in response.json()

    def test_invalid_login(self):
        response = client.post("/api/auth/login", json={
            "worker_id": "NONEXISTENT",
            "password": "wrong",
        })
        assert response.status_code == 401

    def test_get_modules(self):
        """Modules should be available (seeded on startup)."""
        response = client.get("/api/modules/")
        assert response.status_code == 200

    def test_certificate_verify_invalid(self):
        """Verifying a non-existent certificate should return INVALID."""
        response = client.get("/api/certificates/verify/FAKE-ID-000")
        assert response.status_code == 200
        data = response.json()
        assert data["verified"] is False
        assert data["status"] == "INVALID"

    def test_admin_dashboard(self):
        response = client.get("/api/admin/dashboard")
        assert response.status_code == 200
        data = response.json()
        assert "total_workers" in data
        assert "pass_rate" in data
