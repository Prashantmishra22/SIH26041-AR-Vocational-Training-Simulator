"""
WebSocket In-Memory Data Store — Prototype (No Database)

⚠️ WARNING: All data in this store is ephemeral. It lives only in RAM
and will be completely lost when the FastAPI server restarts.
This is intentional for the first prototype to prove the real-time pipeline.

Maintains:
- connected_workers: dict mapping worker_id → WebSocket
- connected_admins: list of admin WebSocket connections
- worker_status: dict mapping worker_id → status info
- activity_feed: deque of recent events (max 100)
- worker_progress: dict mapping worker_id → training progress
"""

import asyncio
import json
from collections import deque
from datetime import datetime, timezone
from typing import Any

from fastapi import WebSocket


class WorkerState:
    """Tracks the current state of a single worker."""
    __slots__ = (
        "worker_id", "status", "connected_at", "last_heartbeat",
        "current_module", "current_step", "total_steps", "last_event",
        "name", "sector", "district",
    )

    def __init__(self, worker_id: str):
        self.worker_id = worker_id
        self.status = "ONLINE"
        self.connected_at = datetime.now(timezone.utc).isoformat()
        self.last_heartbeat = datetime.now(timezone.utc).isoformat()
        self.current_module: str | None = None
        self.current_step: int | None = None
        self.total_steps: int | None = None
        self.last_event: str | None = None
        self.name: str | None = None
        self.sector: str | None = None
        self.district: str | None = None

    def to_dict(self) -> dict:
        return {
            "worker_id": self.worker_id,
            "status": self.status,
            "connected_at": self.connected_at,
            "last_heartbeat": self.last_heartbeat,
            "current_module": self.current_module,
            "current_step": self.current_step,
            "total_steps": self.total_steps,
            "last_event": self.last_event,
            "name": self.name,
            "sector": self.sector,
            "district": self.district,
        }


class WebSocketStore:
    """
    Singleton in-memory store for all real-time WebSocket state.
    Thread-safe through asyncio (single event loop).
    """

    def __init__(self):
        # Active WebSocket connections
        self.connected_workers: dict[str, WebSocket] = {}
        self.connected_admins: list[WebSocket] = []

        # Worker state tracking
        self.worker_status: dict[str, WorkerState] = {}

        # Recent activity feed (last 100 events)
        self.activity_feed: deque[dict] = deque(maxlen=100)

    # ── Worker Connection Management ──────────────────────────────

    async def add_worker(self, worker_id: str, ws: WebSocket):
        """Register a worker WebSocket connection and broadcast ONLINE status."""
        self.connected_workers[worker_id] = ws

        # Create or update worker state
        state = self.worker_status.get(worker_id, WorkerState(worker_id))
        state.status = "ONLINE"
        state.connected_at = datetime.now(timezone.utc).isoformat()
        state.last_heartbeat = datetime.now(timezone.utc).isoformat()
        state.last_event = "WORKER_LOGIN"

        # Lookup worker in DB to enrich name, sector, and district
        try:
            from app.database import SessionLocal
            from app.models.user import User
            db = SessionLocal()
            try:
                user = db.query(User).filter(User.worker_id == worker_id).first()
                if user:
                    state.name = user.name
                    state.sector = user.sector
                    state.district = user.district
            finally:
                db.close()
        except Exception:
            pass

        self.worker_status[worker_id] = state

        worker_label = f"{state.name} ({worker_id})" if state.name else f"Worker {worker_id}"
        district_label = f" from {state.district}" if state.district else ""

        # Log the connection event
        event = {
            "type": "WORKER_STATUS",
            "worker_id": worker_id,
            "event_type": "WORKER_LOGIN",
            "status": "ONLINE",
            "description": f"Worker {worker_label} connected{district_label}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "worker_status": state.to_dict(),
        }
        self.activity_feed.append(event)
        await self.broadcast_to_admins(event)

    async def remove_worker(self, worker_id: str):
        """Remove a worker connection and broadcast OFFLINE status."""
        self.connected_workers.pop(worker_id, None)

        state = self.worker_status.get(worker_id)
        if state:
            state.status = "OFFLINE"
            state.last_event = "WORKER_LOGOUT"
            state.current_module = None
            state.current_step = None
            state.total_steps = None

        worker_label = f"{state.name} ({worker_id})" if (state and state.name) else f"Worker {worker_id}"

        event = {
            "type": "WORKER_STATUS",
            "worker_id": worker_id,
            "event_type": "WORKER_LOGOUT",
            "status": "OFFLINE",
            "description": f"Worker {worker_label} disconnected",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "worker_status": state.to_dict() if state else {"worker_id": worker_id, "status": "OFFLINE"},
        }
        self.activity_feed.append(event)
        await self.broadcast_to_admins(event)

    # ── Admin Connection Management ───────────────────────────────

    async def add_admin(self, ws: WebSocket):
        """Register an admin WebSocket and send current state snapshot."""
        self.connected_admins.append(ws)
        # Send full state snapshot to the newly connected admin
        snapshot = self.get_state_snapshot()
        try:
            await ws.send_json(snapshot)
        except Exception:
            pass

    def remove_admin(self, ws: WebSocket):
        """Remove an admin WebSocket connection."""
        try:
            self.connected_admins.remove(ws)
        except ValueError:
            pass

    # ── Event Processing ──────────────────────────────────────────

    async def process_worker_event(self, worker_id: str, event_data: dict):
        """
        Process an incoming worker event:
        1. Update worker state
        2. Add to activity feed
        3. Broadcast to all connected admins
        """
        now = datetime.now(timezone.utc).isoformat()
        event_type = event_data.get("event_type", "UNKNOWN")

        # Update worker state based on event type
        state = self.worker_status.get(worker_id)
        if not state:
            state = WorkerState(worker_id)
            self.worker_status[worker_id] = state

        state.last_heartbeat = now
        state.last_event = event_type

        # Extract optional worker info
        if event_data.get("name"):
            state.name = event_data["name"]
        if event_data.get("sector"):
            state.sector = event_data["sector"]
        if event_data.get("district"):
            state.district = event_data["district"]

        # Update module/progress tracking based on event type
        if event_type == "MODULE_STARTED":
            state.current_module = event_data.get("module")
            state.current_step = event_data.get("step", 0)
            state.total_steps = event_data.get("total_steps")

        elif event_type == "MODULE_STEP_COMPLETED":
            state.current_step = event_data.get("step")
            state.total_steps = event_data.get("total_steps")

        elif event_type == "MODULE_COMPLETED":
            state.current_step = state.total_steps  # completed all

        elif event_type == "ASSESSMENT_STARTED":
            state.current_module = event_data.get("module")

        elif event_type in ("ASSESSMENT_COMPLETED", "SCORE_GENERATED"):
            pass  # module stays set for context

        elif event_type == "CERTIFICATE_GENERATED":
            state.current_module = None
            state.current_step = None
            state.total_steps = None

        elif event_type == "SAFETY_REPORT_SUBMITTED":
            pass  # maintain existing module context while noting the safety incident

        elif event_type == "MESSAGE_SENT":
            pass  # note message activity

        elif event_type == "WORKER_LOGOUT":
            state.status = "OFFLINE"
            state.current_module = None
            state.current_step = None
            state.total_steps = None

        # Build the broadcast event
        broadcast_event = {
            "type": "WORKER_EVENT",
            "worker_id": worker_id,
            "event_type": event_type,
            "module": event_data.get("module"),
            "description": event_data.get("description", f"{event_type} by {worker_id}"),
            "step": event_data.get("step"),
            "total_steps": event_data.get("total_steps"),
            "score": event_data.get("score"),
            "data": event_data.get("data", {}),
            "timestamp": now,
            "worker_status": state.to_dict(),
        }

        self.activity_feed.append(broadcast_event)
        await self.broadcast_to_admins(broadcast_event)

    # ── Broadcasting ──────────────────────────────────────────────

    async def broadcast_to_admins(self, event: dict):
        """Send an event JSON to every connected admin WebSocket."""
        if not self.connected_admins:
            return

        dead_admins = []
        for admin_ws in self.connected_admins:
            try:
                await admin_ws.send_json(event)
            except Exception:
                dead_admins.append(admin_ws)

        # Clean up disconnected admins
        for dead in dead_admins:
            try:
                self.connected_admins.remove(dead)
            except ValueError:
                pass

    # ── State Snapshot ────────────────────────────────────────────

    def get_state_snapshot(self) -> dict:
        """
        Returns the full current state — sent to newly connected admins
        so they immediately see all online workers and recent events.
        """
        return {
            "type": "STATE_SNAPSHOT",
            "connected_workers_count": len(self.connected_workers),
            "connected_admins_count": len(self.connected_admins),
            "worker_statuses": {
                wid: ws.to_dict()
                for wid, ws in self.worker_status.items()
            },
            "activity_feed": list(self.activity_feed),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }


# ── Global singleton instance ─────────────────────────────────────
store = WebSocketStore()
