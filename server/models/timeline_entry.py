from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Boolean, Text, DateTime, ForeignKey
)
from database import Base


class TimelineEntry(Base):
    __tablename__ = "timeline_entries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    type = Column(String(20), nullable=False)  # education / career / business
    title = Column(String(255), nullable=False)
    organization = Column(String(255), nullable=True)
    hide_organization = Column(Boolean, default=False)
    start_date = Column(String(20), nullable=True)
    end_date = Column(String(20), nullable=True)
    is_current = Column(Boolean, default=False)
    location = Column(String(255), nullable=True)
    industry_l1 = Column(String(100), nullable=True)
    industry_l2 = Column(String(100), nullable=True)
    industry_l3 = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    degree_level = Column(String(50), nullable=True)
    field_of_study = Column(String(100), nullable=True)
    visibility = Column(String(20), default="public")
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
