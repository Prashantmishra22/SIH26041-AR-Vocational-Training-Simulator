"""
WebSocket Routes — Real-Time Worker ↔ Admin Communication

Endpoints:
  WS /ws/worker/{worker_id}  — Workers connect here to send events
  WS /ws/admin               — Admins connect here to receive broadcasts

No authentication required for this prototype.
Heartbeat: Server pings every 30s; expects pong within 10s.
"""

import asyncio
import json
import logging
from datetime import datetime, timezone

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websocket_store import store

logger = logging.getLogger("jh-safety-ws")
router = APIRouter(tags=["WebSocket"])

HEARTBEAT_INTERVAL = 30  # seconds
HEARTBEAT_TIMEOUT = 10   # seconds


# ── Worker WebSocket Endpoint ─────────────────────────────────────

@router.websocket("/ws/worker/{worker_id}")
async def worker_websocket(websocket: WebSocket, worker_id: str):
    """
    Worker WebSocket connection.

    Workers send JSON events like:
    {
        "event_type": "MODULE_STARTED",
        "module": "fire_safety",
        "description": "Worker started Fire Safety Module",
        "step": 1,
        "total_steps": 6,
        "score": null
    }
    """
    await websocket.accept()
    logger.info(f"[WS] Worker '{worker_id}' connected")

    # Register worker in the store and broadcast ONLINE to admins
    await store.add_worker(worker_id, websocket)

    # Send welcome acknowledgment to the worker
    await websocket.send_json({
        "type": "CONNECTED",
        "worker_id": worker_id,
        "message": f"Connected to JH-Safety AR server as worker {worker_id}",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })

    # Start heartbeat task
    heartbeat_task = asyncio.create_task(_worker_heartbeat(websocket, worker_id))

    try:
        while True:
            # Wait for incoming messages from the worker
            raw = await websocket.receive_text()

            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                await websocket.send_json({
                    "type": "ERROR",
                    "message": "Invalid JSON format",
                })
                continue

            # Handle pong responses (heartbeat)
            if data.get("type") == "pong":
                state = store.worker_status.get(worker_id)
                if state:
                    state.last_heartbeat = datetime.now(timezone.utc).isoformat()
                continue

            # Validate event_type is present
            event_type = data.get("event_type")
            if not event_type:
                await websocket.send_json({
                    "type": "ERROR",
                    "message": "Missing 'event_type' field",
                })
                continue

            # Process the worker event (store + broadcast to admins)
            await store.process_worker_event(worker_id, data)

            # Acknowledge receipt to the worker
            await websocket.send_json({
                "type": "ACK",
                "event_type": event_type,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })

    except WebSocketDisconnect:
        logger.info(f"[WS] Worker '{worker_id}' disconnected")
    except Exception as e:
        logger.error(f"[WS] Worker '{worker_id}' error: {e}")
    finally:
        heartbeat_task.cancel()
        await store.remove_worker(worker_id)


async def _worker_heartbeat(websocket: WebSocket, worker_id: str):
    """Periodically send ping to keep the connection alive."""
    try:
        while True:
            await asyncio.sleep(HEARTBEAT_INTERVAL)
            try:
                await websocket.send_json({"type": "ping"})
            except Exception:
                break
    except asyncio.CancelledError:
        pass


# ── Admin WebSocket Endpoint ──────────────────────────────────────

@router.websocket("/ws/admin")
async def admin_websocket(websocket: WebSocket):
    """
    Admin WebSocket connection.

    On connect: receives a STATE_SNAPSHOT with all current worker statuses
    and the recent activity feed.

    Then receives real-time events as workers perform actions.
    """
    await websocket.accept()
    logger.info("[WS] Admin dashboard connected")

    # Register admin and send current state snapshot
    await store.add_admin(websocket)

    # Start heartbeat task
    heartbeat_task = asyncio.create_task(_admin_heartbeat(websocket))

    try:
        while True:
            # Listen for admin messages (pong, queries, etc.)
            raw = await websocket.receive_text()

            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                continue

            # Handle pong
            if data.get("type") == "pong":
                continue

            # Handle state refresh request
            if data.get("type") == "GET_STATE":
                snapshot = store.get_state_snapshot()
                await websocket.send_json(snapshot)

    except WebSocketDisconnect:
        logger.info("[WS] Admin dashboard disconnected")
    except Exception as e:
        logger.error(f"[WS] Admin error: {e}")
    finally:
        heartbeat_task.cancel()
        store.remove_admin(websocket)


async def _admin_heartbeat(websocket: WebSocket):
    """Periodically send ping to keep the admin connection alive."""
    try:
        while True:
            await asyncio.sleep(HEARTBEAT_INTERVAL)
            try:
                await websocket.send_json({"type": "ping"})
            except Exception:
                break
    except asyncio.CancelledError:
        pass


# ── REST endpoint for debugging ───────────────────────────────────

@router.get("/api/ws/status")
def websocket_status():
    """
    Debug endpoint to check current WebSocket state.
    Returns count of connected workers/admins and recent events.
    """
    return {
        "connected_workers": list(store.connected_workers.keys()),
        "connected_workers_count": len(store.connected_workers),
        "connected_admins_count": len(store.connected_admins),
        "worker_statuses": {
            wid: ws.to_dict()
            for wid, ws in store.worker_status.items()
        },
        "recent_events_count": len(store.activity_feed),
        "last_5_events": list(store.activity_feed)[-5:],
    }
