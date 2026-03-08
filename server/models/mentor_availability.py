from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from database import Base


class MentorAvailability(Base):
    __tablename__ = "mentor_availability"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    start_time = Column(String(5), nullable=False)  # "09:00"
    end_time = Column(String(5), nullable=False)  # "17:00"
    is_active = Column(Boolean, default=True)
