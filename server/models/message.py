from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from database import Base


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sender_role = Column(String(20), nullable=False)  # 'mentor' or 'mentee'
    content = Column(Text, nullable=False)
    file_url = Column(String(500), nullable=True)
    file_name = Column(String(255), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
