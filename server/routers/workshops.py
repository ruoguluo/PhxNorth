from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models.user import User
from models.workshop import Workshop, WorkshopRegistration
from schemas.workshop import (
    WorkshopCreate,
    WorkshopUpdate,
    WorkshopResponse,
    WorkshopWithRegistrations,
    RegistrationResponse,
)
from utils.deps import get_current_user

router = APIRouter(prefix="/api/workshops", tags=["Workshops"])


def _workshop_to_response(workshop: Workshop, db: Session) -> dict:
    count = db.query(func.count(WorkshopRegistration.id)).filter(
        WorkshopRegistration.workshop_id == workshop.id,
        WorkshopRegistration.status == "registered",
    ).scalar()
    data = {c.name: getattr(workshop, c.name) for c in workshop.__table__.columns}
    data["registered_count"] = count or 0
    return data


@router.get("", response_model=list[WorkshopResponse])
def list_workshops(
    mine: Optional[bool] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Workshop)
    if mine or current_user.role == "mentor":
        query = query.filter(Workshop.mentor_id == current_user.id)
    elif current_user.role == "mentee":
        query = query.filter(Workshop.status == "published")
    if status_filter:
        query = query.filter(Workshop.status == status_filter)
    workshops = query.order_by(Workshop.created_at.desc()).all()
    return [_workshop_to_response(w, db) for w in workshops]


@router.post("", response_model=WorkshopResponse, status_code=201)
def create_workshop(
    data: WorkshopCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "mentor":
        raise HTTPException(status_code=403, detail="Only mentors can create workshops")
    workshop = Workshop(mentor_id=current_user.id, **data.model_dump())
    db.add(workshop)
    db.commit()
    db.refresh(workshop)
    return _workshop_to_response(workshop, db)


@router.get("/{workshop_id}")
def get_workshop(
    workshop_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    data = _workshop_to_response(workshop, db)
    resp = WorkshopWithRegistrations(**data)
    if current_user.id == workshop.mentor_id or current_user.role == "admin":
        regs = db.query(WorkshopRegistration).filter(
            WorkshopRegistration.workshop_id == workshop_id
        ).all()
        resp.registrations = [RegistrationResponse.model_validate(r) for r in regs]
    return resp


@router.put("/{workshop_id}", response_model=WorkshopResponse)
def update_workshop(
    workshop_id: int,
    data: WorkshopUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    if workshop.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your workshop")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(workshop, key, value)
    db.commit()
    db.refresh(workshop)
    return _workshop_to_response(workshop, db)


@router.delete("/{workshop_id}", status_code=204)
def delete_workshop(
    workshop_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    if workshop.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your workshop")
    if workshop.status != "draft":
        raise HTTPException(status_code=400, detail="Only draft workshops can be deleted")
    db.delete(workshop)
    db.commit()


@router.put("/{workshop_id}/publish", response_model=WorkshopResponse)
def publish_workshop(
    workshop_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    if workshop.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your workshop")
    if workshop.status != "draft":
        raise HTTPException(status_code=400, detail="Only draft workshops can be published")
    workshop.status = "published"
    db.commit()
    db.refresh(workshop)
    return _workshop_to_response(workshop, db)


@router.put("/{workshop_id}/complete", response_model=WorkshopResponse)
def complete_workshop(
    workshop_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    if workshop.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your workshop")
    if workshop.status not in ("published", "in_progress"):
        raise HTTPException(status_code=400, detail="Workshop cannot be completed in current status")
    workshop.status = "completed"
    db.commit()
    db.refresh(workshop)
    return _workshop_to_response(workshop, db)


@router.post("/{workshop_id}/register", response_model=RegistrationResponse, status_code=201)
def register_for_workshop(
    workshop_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "mentee":
        raise HTTPException(status_code=403, detail="Only mentees can register")
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    if workshop.status != "published":
        raise HTTPException(status_code=400, detail="Workshop is not open for registration")
    if workshop.max_participants:
        current_count = db.query(func.count(WorkshopRegistration.id)).filter(
            WorkshopRegistration.workshop_id == workshop_id,
            WorkshopRegistration.status == "registered",
        ).scalar()
        if current_count >= workshop.max_participants:
            raise HTTPException(status_code=400, detail="Workshop is full")
    existing = db.query(WorkshopRegistration).filter(
        WorkshopRegistration.workshop_id == workshop_id,
        WorkshopRegistration.mentee_id == current_user.id,
        WorkshopRegistration.status == "registered",
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already registered")
    reg = WorkshopRegistration(workshop_id=workshop_id, mentee_id=current_user.id)
    db.add(reg)
    db.commit()
    db.refresh(reg)
    return reg


@router.delete("/{workshop_id}/register", status_code=204)
def cancel_registration(
    workshop_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    reg = db.query(WorkshopRegistration).filter(
        WorkshopRegistration.workshop_id == workshop_id,
        WorkshopRegistration.mentee_id == current_user.id,
        WorkshopRegistration.status == "registered",
    ).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    reg.status = "cancelled"
    db.commit()
