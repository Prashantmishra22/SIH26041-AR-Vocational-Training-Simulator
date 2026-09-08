# JH-Safety AR — Offline-First Architecture

## 1. Problem Context
Underground deep mines (such as BCCL Moonidih at 500m depth) and remote mica mining adits in Koderma/Giridih have zero cellular connectivity and no underground Wi-Fi. A training application that depends on continuous cloud internet will fail completely in realistic field conditions.

---

## 2. Offline-First Design Principles

1. **Local-First Asset Storage:**
   - 100% of 3D models, textures, animations, voice files, module JSON configs, and question banks are pre-bundled inside `Assets/Resources/` in the APK binary.
   - Zero runtime network download is required to launch or complete any safety module.

2. **Local SQLite Persistence:**
   - Worker profiles, past certificates, and session attempts are stored locally in an embedded database.
   - Immediate feedback and certificate generation operate offline with zero network latency.

3. **Queue-Based Batch Synchronization:**
   - Every completed underground attempt creates a pending record in `SyncQueue`.
   - The queue persists across app restarts.
   - When the worker returns to surface facilities (mine administration building or lamp room with Wi-Fi/LTE), the app detects connectivity and batch-uploads records via `POST /api/v1/sync`.

4. **Conflict Resolution & Idempotency:**
   - Each attempt is assigned a client-side UUID.
   - The backend checks for existing UUIDs to prevent duplicate record insertion during network retries.
