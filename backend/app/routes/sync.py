"""Offline sync routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User
from app.utils.security import get_current_user
from app.services.sync_service import process_sync

router = APIRouter(prefix="/api/sync", tags=["Sync"])


class SyncRequest(BaseModel):
    device_id: str
    records: list[dict]


@router.post("/")
def sync_offline_data(
    req: SyncRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Sync offline training records from the Android app.
    Called when the device regains internet connectivity.
    """
    result = process_sync(db, req.device_id, current_user.id, req.records)
    return result
