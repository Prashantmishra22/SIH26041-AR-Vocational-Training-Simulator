# JH-Safety AR — REST API Documentation

**Base URL:** `http://localhost:8000/api/v1` (or production endpoint)  
**Swagger UI:** `http://localhost:8000/docs`  
**Authentication:** HTTP Bearer JWT Token (`Authorization: Bearer <token>`)

---

## 1. Authentication Endpoints

### `POST /api/v1/auth/register`
Registers a new worker in the state safety database.

**Request Body:**
```json
{
  "worker_code": "JH-MIN-10492",
  "full_name": "Birsa Munda Soren",
  "phone": "+919431128941",
  "password": "password123",
  "sector": "MINING",
  "company": "Bharat Coking Coal Ltd (BCCL)",
  "mine_or_plant": "Moonidih Colliery",
  "district": "Dhanbad",
  "preferred_language": "sat",
  "experience_years": 8
}
```

### `POST /api/v1/auth/login`
Authenticates a worker or admin user and returns a JWT access token.

---

## 2. Modules & Curricula Endpoints

### `GET /api/v1/modules`
Returns all active safety training modules.

### `GET /api/v1/modules/{module_id}`
Returns granular module steps, hazards, gestures, and compliance standard info.

### `GET /api/v1/modules/{module_id}/questions`
Returns 10 trilingual assessment questions for the module.

---

## 3. Assessment & Progress Endpoints

### `POST /api/v1/attempts`
Submits a completed practical AR + theoretical assessment attempt.

**Request Body:**
```json
{
  "module_id": "fire_safety_01",
  "practical_score": 96.0,
  "theory_score": 92.0,
  "time_spent_seconds": 940,
  "language_used": "sat",
  "is_offline_sync": false
}
```

**Response (Passing Score >= 70%):**
```json
{
  "attempt_id": "att-492",
  "score": 94.4,
  "passed": true,
  "certificate_issued": true,
  "certificate_number": "JH-SAFE-2026-BCCL-08492",
  "message": "Assessment passed! DGMS Certificate generated."
}
```

---

## 4. Certificate & Verification Endpoints

### `GET /api/v1/certificates/verify/{certificate_number}`
Publicly verifiable endpoint for validating certificate authenticity by ID or QR scan.

**Response:**
```json
{
  "valid": true,
  "certificate_number": "JH-SAFE-2026-BCCL-08492",
  "worker_name": "Birsa Munda Soren",
  "company": "Bharat Coking Coal Ltd (BCCL)",
  "module_title": "Underground Mine Fire & Explosion Protocol",
  "score": 94.4,
  "status": "VALID",
  "issued_at": "2026-08-14T11:42:00Z",
  "expires_at": "2028-08-14T11:42:00Z",
  "verification_hash": "8f9a2b7c4d1e60f38b291a0c4f8d93e1b7a6c5d2e0f4"
}
```

---

## 5. Offline Batch Sync Endpoint

### `POST /api/v1/sync`
Accepts a batch of offline underground training records collected during network disconnection.

---

## 6. Admin Compliance Endpoints

- `GET /api/v1/admin/dashboard-stats` — Returns aggregate state KPIs.
- `GET /api/v1/admin/workers` — Returns paginated worker list with filter support.
- `GET /api/v1/admin/certificates` — Returns all issued state credentials.
