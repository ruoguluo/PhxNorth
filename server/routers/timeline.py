from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.timeline_entry import TimelineEntry
from schemas.timeline import (
    TimelineEntryCreate,
    TimelineEntryUpdate,
    TimelineEntryResponse,
    ReorderItem,
)
from utils.deps import get_current_user

router = APIRouter(prefix="/api/profile/timeline", tags=["Timeline"])


@router.get("", response_model=list[TimelineEntryResponse])
def list_timeline(
    type: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(TimelineEntry).filter(TimelineEntry.user_id == current_user.id)
    if type:
        query = query.filter(TimelineEntry.type == type)
    return query.order_by(TimelineEntry.sort_order, TimelineEntry.id).all()


@router.post("", response_model=TimelineEntryResponse, status_code=201)
def create_timeline_entry(
    data: TimelineEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry = TimelineEntry(user_id=current_user.id, **data.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.put("/reorder", response_model=list[TimelineEntryResponse])
def reorder_timeline(
    items: list[ReorderItem],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    for item in items:
        entry = db.query(TimelineEntry).filter(
            TimelineEntry.id == item.id,
            TimelineEntry.user_id == current_user.id,
        ).first()
        if entry:
            entry.sort_order = item.sort_order
    db.commit()
    return (
        db.query(TimelineEntry)
        .filter(TimelineEntry.user_id == current_user.id)
        .order_by(TimelineEntry.sort_order, TimelineEntry.id)
        .all()
    )


@router.put("/{entry_id}", response_model=TimelineEntryResponse)
def update_timeline_entry(
    entry_id: int,
    data: TimelineEntryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry = db.query(TimelineEntry).filter(
        TimelineEntry.id == entry_id,
        TimelineEntry.user_id == current_user.id,
    ).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(entry, key, value)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=204)
def delete_timeline_entry(
    entry_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry = db.query(TimelineEntry).filter(
        TimelineEntry.id == entry_id,
        TimelineEntry.user_id == current_user.id,
    ).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    db.delete(entry)
    db.commit()
