"""
Seed script to populate the database with mock data for development/demo.

Usage:
    cd server
    python seed.py
"""

from datetime import datetime, timedelta

from database import engine, Base, SessionLocal
from models.user import User
from models.mentor_availability import MentorAvailability
from models.mentorship_request import MentorshipRequest
from models.session import Session
from utils.security import hash_password


def seed():
    # Recreate all tables
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # ─── Users ───────────────────────────────────────────────────────

        admin = User(
            email="admin@phxnorth.com",
            username="admin",
            full_name="Platform Admin",
            hashed_password=hash_password("admin123"),
            role="admin",
            is_active=True,
            current_country="United States",
        )

        mentor1 = User(
            email="sarah.mentor@phxnorth.com",
            username="sarahkim",
            full_name="Sarah Kim",
            hashed_password=hash_password("mentor123"),
            role="mentor",
            is_active=True,
            is_online=True,
            status="professional",
            years_experience="10+ years",
            current_country="United States",
            industry="Technology",
            sector="Software",
            sub_sector="AI / Machine Learning",
            bio="VP of Product at a Fortune 500 tech company with 15+ years of experience in product strategy, AI/ML products, and team leadership.",
            hourly_rate=150.0,
            rating=4.9,
            total_sessions=87,
            monthly_income=3450.0,
            specializations=["Product Strategy", "AI/ML", "Leadership", "Career Transition"],
        )

        mentor2 = User(
            email="david.mentor@phxnorth.com",
            username="davidwong",
            full_name="David Wong",
            hashed_password=hash_password("mentor123"),
            role="mentor",
            is_active=True,
            is_online=False,
            status="professional",
            years_experience="10+ years",
            current_country="Singapore",
            industry="Finance",
            sector="Investment Banking",
            sub_sector="M&A Advisory",
            bio="Managing Director at a top investment bank. Expertise in cross-border M&A, capital markets, and fintech advisory.",
            hourly_rate=200.0,
            rating=4.8,
            total_sessions=62,
            monthly_income=5200.0,
            specializations=["M&A Advisory", "Capital Markets", "FinTech", "Career Development"],
        )

        mentor3 = User(
            email="elena.mentor@phxnorth.com",
            username="elenaross",
            full_name="Elena Ross",
            hashed_password=hash_password("mentor123"),
            role="mentor",
            is_active=True,
            is_online=True,
            status="professional",
            years_experience="5–10 years",
            current_country="United Kingdom",
            industry="Healthcare",
            sector="Healthcare IT",
            sub_sector="Telemedicine",
            bio="CTO of a health-tech startup. Passionate about digital health innovation, telemedicine architecture, and scaling engineering teams.",
            hourly_rate=120.0,
            rating=4.7,
            total_sessions=45,
            monthly_income=2100.0,
            specializations=["HealthTech", "Engineering Leadership", "Startups", "System Design"],
        )

        mentee1 = User(
            email="chen.mentee@phxnorth.com",
            username="sarahchen",
            full_name="Sarah Chen",
            hashed_password=hash_password("mentee123"),
            role="mentee",
            is_active=True,
            status="studying",
            degree_level="Master",
            field_of_study="Computer Science",
            current_country="United States",
            interested_countries=["United States", "Canada", "Singapore"],
            industry="Technology",
            sector="Software",
            sub_sector="SaaS",
            interested_industries=["Technology", "Finance"],
        )

        mentee2 = User(
            email="michael.mentee@phxnorth.com",
            username="michaelrodriguez",
            full_name="Michael Rodriguez",
            hashed_password=hash_password("mentee123"),
            role="mentee",
            is_active=True,
            status="professional",
            years_experience="3–5 years",
            current_country="United States",
            interested_countries=["United States", "United Kingdom"],
            industry="Technology",
            sector="Software",
            sub_sector="Enterprise Software",
            interested_industries=["Technology", "Professional Services"],
        )

        mentee3 = User(
            email="aisha.mentee@phxnorth.com",
            username="aishapattel",
            full_name="Aisha Pattel",
            hashed_password=hash_password("mentee123"),
            role="mentee",
            is_active=True,
            status="professional",
            years_experience="1–3 years",
            current_country="United Arab Emirates",
            interested_countries=["United Arab Emirates", "Singapore", "United Kingdom"],
            industry="Finance",
            sector="Private Equity",
            sub_sector="Growth Equity",
            interested_industries=["Finance", "Technology"],
        )

        mentee4 = User(
            email="james.mentee@phxnorth.com",
            username="jameslee",
            full_name="James Lee",
            hashed_password=hash_password("mentee123"),
            role="mentee",
            is_active=True,
            status="studying",
            degree_level="MBA",
            field_of_study="Business Administration",
            current_country="Canada",
            interested_countries=["Canada", "United States"],
            industry="Professional Services",
            sector="Consulting",
            sub_sector="Strategy",
        )

        mentee5 = User(
            email="maria.mentee@phxnorth.com",
            username="mariagomez",
            full_name="Maria Gomez",
            hashed_password=hash_password("mentee123"),
            role="mentee",
            is_active=True,
            status="professional",
            years_experience="5–10 years",
            current_country="Mexico",
            interested_countries=["Mexico", "United States", "Brazil"],
            industry="Healthcare",
            sector="Biotech",
            sub_sector="Genomics",
            interested_industries=["Healthcare", "Technology"],
        )

        db.add_all([admin, mentor1, mentor2, mentor3, mentee1, mentee2, mentee3, mentee4, mentee5])
        db.flush()

        # ─── Mentor Availability ─────────────────────────────────────────

        availability_data = [
            # Sarah Kim — Mon–Fri, 9:00–17:00
            *[MentorAvailability(mentor_id=mentor1.id, day_of_week=d, start_time="09:00", end_time="17:00") for d in range(5)],
            # David Wong — Mon, Wed, Fri, 10:00–18:00
            *[MentorAvailability(mentor_id=mentor2.id, day_of_week=d, start_time="10:00", end_time="18:00") for d in [0, 2, 4]],
            # Elena Ross — Tue, Thu, 08:00–16:00 + Sat 10:00–14:00
            *[MentorAvailability(mentor_id=mentor3.id, day_of_week=d, start_time="08:00", end_time="16:00") for d in [1, 3]],
            MentorAvailability(mentor_id=mentor3.id, day_of_week=5, start_time="10:00", end_time="14:00"),
        ]
        db.add_all(availability_data)

        # ─── Mentorship Requests ─────────────────────────────────────────

        now = datetime.utcnow()

        req1 = MentorshipRequest(
            mentee_id=mentee1.id, mentor_id=mentor1.id,
            type="instant", topic="Product Strategy & Roadmap Planning",
            message="I'd love to discuss how to approach building a product roadmap for an AI-powered SaaS platform.",
            status="pending", duration_minutes=30, price=85.0,
            created_at=now - timedelta(minutes=10),
        )

        req2 = MentorshipRequest(
            mentee_id=mentee2.id, mentor_id=mentor1.id,
            type="instant", topic="Career Transition to Tech Leadership",
            message="Looking for guidance on transitioning from IC to engineering manager role.",
            status="pending", duration_minutes=45, price=120.0,
            created_at=now - timedelta(minutes=5),
        )

        req3 = MentorshipRequest(
            mentee_id=mentee3.id, mentor_id=mentor2.id,
            type="scheduled", topic="Breaking into Private Equity",
            message="I want to understand the PE landscape in the Middle East and Southeast Asia.",
            status="accepted", duration_minutes=60,
            proposed_datetime=now + timedelta(days=2, hours=10),
            price=200.0,
            created_at=now - timedelta(days=1),
        )

        req4 = MentorshipRequest(
            mentee_id=mentee4.id, mentor_id=mentor1.id,
            type="scheduled", topic="Product Management Career Path",
            message="Exploring PM roles after MBA graduation.",
            status="accepted", duration_minutes=45,
            proposed_datetime=now + timedelta(days=3, hours=14),
            price=150.0,
            created_at=now - timedelta(days=2),
        )

        req5 = MentorshipRequest(
            mentee_id=mentee5.id, mentor_id=mentor3.id,
            type="scheduled", topic="HealthTech Product Development",
            message="Need guidance on regulatory aspects of health-tech products.",
            status="pending", duration_minutes=30,
            proposed_datetime=now + timedelta(days=5, hours=9),
            price=60.0,
            created_at=now - timedelta(hours=12),
        )

        db.add_all([req1, req2, req3, req4, req5])
        db.flush()

        # ─── Sessions ───────────────────────────────────────────────────

        sessions = [
            # Completed sessions
            Session(
                request_id=None, mentor_id=mentor1.id, mentee_id=mentee1.id,
                scheduled_at=now - timedelta(days=7, hours=2),
                duration_minutes=30, status="completed",
                topic="Introduction & Goal Setting",
                rating=5.0, feedback="Amazing mentor! Very insightful and actionable advice.",
                price=85.0,
            ),
            Session(
                request_id=None, mentor_id=mentor1.id, mentee_id=mentee2.id,
                scheduled_at=now - timedelta(days=5, hours=3),
                duration_minutes=45, status="completed",
                topic="Resume Review & Interview Prep",
                rating=4.8, feedback="Great session, helped me restructure my resume effectively.",
                price=120.0,
            ),
            Session(
                request_id=None, mentor_id=mentor2.id, mentee_id=mentee3.id,
                scheduled_at=now - timedelta(days=3, hours=1),
                duration_minutes=60, status="completed",
                topic="PE Market Overview - MENA Region",
                rating=5.0, feedback="David's industry knowledge is exceptional.",
                price=200.0,
            ),
            Session(
                request_id=None, mentor_id=mentor3.id, mentee_id=mentee5.id,
                scheduled_at=now - timedelta(days=2, hours=4),
                duration_minutes=30, status="completed",
                topic="HealthTech Regulatory Landscape",
                rating=4.5, feedback="Very helpful overview of FDA and CE marking processes.",
                price=60.0,
            ),
            # Upcoming sessions
            Session(
                request_id=req3.id, mentor_id=mentor2.id, mentee_id=mentee3.id,
                scheduled_at=now + timedelta(days=2, hours=10),
                duration_minutes=60, status="upcoming",
                topic="Breaking into Private Equity",
                price=200.0,
            ),
            Session(
                request_id=req4.id, mentor_id=mentor1.id, mentee_id=mentee4.id,
                scheduled_at=now + timedelta(days=3, hours=14),
                duration_minutes=45, status="upcoming",
                topic="Product Management Career Path",
                price=150.0,
            ),
            Session(
                request_id=None, mentor_id=mentor1.id, mentee_id=mentee1.id,
                scheduled_at=now + timedelta(days=4, hours=9),
                duration_minutes=30, status="upcoming",
                topic="Follow-up: Product Roadmap Review",
                price=85.0,
            ),
            Session(
                request_id=None, mentor_id=mentor3.id, mentee_id=mentee5.id,
                scheduled_at=now + timedelta(days=6, hours=11),
                duration_minutes=45, status="upcoming",
                topic="Telemedicine Architecture Deep Dive",
                price=90.0,
            ),
        ]
        db.add_all(sessions)

        db.commit()
        print("✅ Database seeded successfully!")
        print(f"   - 1 admin: admin@phxnorth.com / admin123")
        print(f"   - 3 mentors: *@phxnorth.com / mentor123")
        print(f"   - 5 mentees: *@phxnorth.com / mentee123")
        print(f"   - {len(availability_data)} availability slots")
        print(f"   - 5 mentorship requests")
        print(f"   - 8 sessions (4 completed, 4 upcoming)")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
