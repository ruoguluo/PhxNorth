from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.credential import Credential
from schemas.credential import (
    CredentialCreate,
    CredentialUpdate,
    CredentialResponse,
)
from utils.deps import get_current_user

router = APIRouter(prefix="/api/profile/credentials", tags=["Credentials"])


@router.get("", response_model=list[CredentialResponse])
def list_credentials(
    type: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Credential).filter(Credential.user_id == current_user.id)
    if type:
        query = query.filter(Credential.type == type)
    return query.order_by(Credential.id).all()


@router.post("", response_model=CredentialResponse, status_code=201)
def create_credential(
    data: CredentialCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cred = Credential(user_id=current_user.id, **data.model_dump())
    db.add(cred)
    db.commit()
    db.refresh(cred)
    return cred


@router.put("/{cred_id}", response_model=CredentialResponse)
def update_credential(
    cred_id: int,
    data: CredentialUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cred = db.query(Credential).filter(
        Credential.id == cred_id,
        Credential.user_id == current_user.id,
    ).first()
    if not cred:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Credential not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(cred, key, value)
    db.commit()
    db.refresh(cred)
    return cred


@router.delete("/{cred_id}", status_code=204)
def delete_credential(
    cred_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cred = db.query(Credential).filter(
        Credential.id == cred_id,
        Credential.user_id == current_user.id,
    ).first()
    if not cred:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Credential not found")
    db.delete(cred)
    db.commit()
