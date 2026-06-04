from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Boolean, Float, Text, DateTime, JSON
)
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="mentee")  # mentee, mentor, admin
    is_active = Column(Boolean, default=True)
    is_online = Column(Boolean, default=False)

    # Registration details
    status = Column(String(20), nullable=True)  # studying, professional
    degree_level = Column(String(50), nullable=True)
    field_of_study = Column(String(100), nullable=True)
    years_experience = Column(String(20), nullable=True)
    current_country = Column(String(100), nullable=True)
    interested_countries = Column(JSON, nullable=True)
    industry = Column(String(100), nullable=True)
    sector = Column(String(100), nullable=True)
    sub_sector = Column(String(100), nullable=True)
    interested_industries = Column(JSON, nullable=True)
    keep_name_private = Column(Boolean, default=False)

    # Profile
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    hourly_rate = Column(Float, nullable=True)
    rating = Column(Float, default=0.0)
    total_sessions = Column(Integer, default=0)
    monthly_income = Column(Float, default=0.0)
    specializations = Column(JSON, nullable=True)

    # Profile summary
    summary = Column(Text, nullable=True)
    functional_expertise = Column(JSON, nullable=True)
    markets_of_interest = Column(JSON, nullable=True)
    career_direction = Column(Text, nullable=True)
    preferred_mentor_geography = Column(String(100), nullable=True)

    # Privacy / visibility
    global_visibility = Column(String(20), default="public")
    show_current_company = Column(Boolean, default=True)
    show_full_timeline = Column(Boolean, default=True)
    allow_enterprise_view = Column(Boolean, default=False)
    allow_mentor_discovery = Column(Boolean, default=True)

    # Cached DISC scores from behavioral backend {D, I, S, C} (0-100 each)
    disc_scores_json = Column(JSON, nullable=True)

    # Stripe fields
    stripe_customer_id = Column(String(100), nullable=True)
    stripe_payment_method_id = Column(String(100), nullable=True)
    stripe_account_id = Column(String(100), nullable=True)
    stripe_account_status = Column(String(20), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
