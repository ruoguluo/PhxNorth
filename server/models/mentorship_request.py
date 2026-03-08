from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Text, Float, DateTime, ForeignKey
)
from database import Base


class MentorshipRequest(Base):
    __tablename__ = "mentorship_requests"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    mentee_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    type = Column(String(20), nullable=False)  # instant, scheduled
    topic = Column(String(255), nullable=False)
    message = Column(Text, nullable=True)
    status = Column(String(20), nullable=False, default="pending")
    # pending, accepted, declined, completed, expired
    duration_minutes = Column(Integer, nullable=False, default=30)
    proposed_datetime = Column(DateTime, nullable=True)  # for scheduled
    price = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
