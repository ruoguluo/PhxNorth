from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Float, Text, DateTime, JSON, ForeignKey
)
from database import Base


class Workshop(Base):
    __tablename__ = "workshops"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    scheduled_at = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    max_participants = Column(Integer, nullable=True)
    price = Column(Float, nullable=True)
    status = Column(String(20), nullable=False, default="draft")
    tags = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class WorkshopRegistration(Base):
    __tablename__ = "workshop_registrations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    workshop_id = Column(Integer, ForeignKey("workshops.id"), nullable=False, index=True)
    mentee_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    status = Column(String(20), nullable=False, default="registered")
    created_at = Column(DateTime, default=datetime.utcnow)
