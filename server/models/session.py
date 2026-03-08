from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Text, Float, DateTime, ForeignKey
)
from database import Base


class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    request_id = Column(Integer, ForeignKey("mentorship_requests.id"), nullable=True)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    mentee_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    scheduled_at = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, nullable=False, default=30)
    status = Column(String(20), nullable=False, default="upcoming")
    # upcoming, in_progress, completed, cancelled
    topic = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    rating = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    price = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
