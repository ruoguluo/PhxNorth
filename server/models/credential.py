from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Text, DateTime, ForeignKey
)
from database import Base


class Credential(Base):
    __tablename__ = "credentials"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    type = Column(String(20), nullable=False)  # certification / training / psychometric
    name = Column(String(255), nullable=False)
    issuer = Column(String(255), nullable=True)
    date_obtained = Column(String(20), nullable=True)
    expiry_date = Column(String(20), nullable=True)
    credential_id = Column(String(100), nullable=True)
    training_type = Column(String(50), nullable=True)
    duration = Column(String(50), nullable=True)
    test_type = Column(String(50), nullable=True)
    result_summary = Column(Text, nullable=True)
    visibility = Column(String(20), default="public")
    created_at = Column(DateTime, default=datetime.utcnow)
