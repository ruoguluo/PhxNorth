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
from models.timeline_entry import TimelineEntry
from models.credential import Credential
from models.consulting_project import ConsultingProject, ProjectApplication
from models.workshop import Workshop, WorkshopRegistration
from models.wallet import Wallet
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
            per_minute_rate=0.10,
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
            per_minute_rate=0.10,
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
            per_minute_rate=0.10,
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

        # ─── Wallets (for mentees) ───────────────────────────────────────
        mentee_users = db.query(User).filter(User.role == "mentee").all()
        wallets = []
        for mu in mentee_users:
            wallets.append(Wallet(user_id=mu.id, balance=10.0))  # $10 starting credit
        db.add_all(wallets)
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

        # ─── Sample Profile Data (Sarah Chen) ───────────────────────────

        mentee1.summary = "Computer Science graduate student passionate about AI/ML and SaaS product development. Seeking mentorship in product strategy and career transition to tech leadership."
        mentee1.functional_expertise = ["Software Development", "Machine Learning", "Product Strategy"]
        mentee1.markets_of_interest = ["United States", "Canada", "Singapore"]
        mentee1.career_direction = "Transition into product management at a top tech company"

        timeline_data = [
            TimelineEntry(
                user_id=mentee1.id, type="education", title="Master of Computer Science",
                organization="Stanford University", start_date="2024-09", is_current=True,
                location="Stanford, CA", degree_level="Master", field_of_study="Computer Science",
                visibility="public", sort_order=0,
            ),
            TimelineEntry(
                user_id=mentee1.id, type="education", title="Bachelor of Engineering",
                organization="Tsinghua University", start_date="2020-09", end_date="2024-06",
                location="Beijing, China", degree_level="Bachelor", field_of_study="Software Engineering",
                visibility="public", sort_order=1,
            ),
            TimelineEntry(
                user_id=mentee1.id, type="career", title="Software Engineering Intern",
                organization="Google", start_date="2023-06", end_date="2023-09",
                location="Mountain View, CA", industry_l1="Technology", industry_l2="Software",
                visibility="public", sort_order=0,
            ),
            TimelineEntry(
                user_id=mentee1.id, type="business", title="AI Study Assistant",
                organization="Personal Project", start_date="2024-01", is_current=True,
                description="Building an AI-powered study assistant using RAG and LLMs",
                industry_l1="Technology", visibility="public", sort_order=0,
            ),
        ]
        db.add_all(timeline_data)

        cred_data = [
            Credential(
                user_id=mentee1.id, type="certification", name="AWS Cloud Practitioner",
                issuer="Amazon Web Services", date_obtained="2023-12", visibility="public",
            ),
            Credential(
                user_id=mentee1.id, type="training", name="Machine Learning Specialization",
                issuer="Coursera / Stanford", training_type="Online Course",
                date_obtained="2023-08", duration="3 months", visibility="public",
            ),
        ]
        db.add_all(cred_data)

        # ─── Consulting Projects ─────────────────────────────────────────

        cp1 = ConsultingProject(
            title="AI-Driven Customer Segmentation Strategy",
            description="Help our retail client implement ML-based customer segmentation to improve targeting and retention.",
            client_name="RetailCo International",
            budget_min=8000, budget_max=15000, duration_weeks=6,
            required_skills=["Machine Learning", "Customer Analytics", "Strategy"],
            industry="Consumer & Retail", status="open", created_by=admin.id,
        )
        cp2 = ConsultingProject(
            title="FinTech Regulatory Compliance Audit",
            description="Assess regulatory readiness for a Series B fintech startup expanding into Southeast Asia.",
            client_name="PayFlow Asia",
            budget_min=12000, budget_max=20000, duration_weeks=8,
            required_skills=["FinTech", "Regulatory", "Compliance", "APAC"],
            industry="Financial Services", status="open", created_by=admin.id,
        )
        cp3 = ConsultingProject(
            title="Digital Health Platform Architecture Review",
            description="Independent architecture review of a telemedicine platform before Series A fundraise.",
            client_name="MediConnect",
            budget_min=5000, budget_max=10000, duration_weeks=3,
            required_skills=["HealthTech", "System Design", "Cloud Architecture"],
            industry="Healthcare & Life Sciences", status="open", created_by=admin.id,
        )
        cp4 = ConsultingProject(
            title="Enterprise Data Governance Framework",
            description="Design a data governance framework for a Fortune 500 manufacturing company.",
            client_name="GlobalMfg Corp",
            budget_min=20000, budget_max=35000, duration_weeks=12,
            required_skills=["Data Governance", "Enterprise Architecture", "Manufacturing"],
            industry="Industrial & Manufacturing", status="in_progress",
            assigned_mentor_id=mentor1.id, created_by=admin.id,
        )
        db.add_all([cp1, cp2, cp3, cp4])
        db.flush()

        app1 = ProjectApplication(
            project_id=cp4.id, mentor_id=mentor1.id,
            proposal="I have 15+ years of experience in enterprise data systems.",
            proposed_rate=250.0, status="approved",
        )
        app2 = ProjectApplication(
            project_id=cp4.id, mentor_id=mentor2.id,
            proposal="Extensive background in manufacturing IT governance.",
            proposed_rate=200.0, status="rejected",
        )
        app3 = ProjectApplication(
            project_id=cp1.id, mentor_id=mentor1.id,
            proposal="ML is my core expertise, happy to lead this.",
            proposed_rate=180.0, status="pending",
        )
        db.add_all([app1, app2, app3])

        # ─── Workshops ──────────────────────────────────────────────────

        ws1 = Workshop(
            mentor_id=mentor1.id,
            title="Scaling E-commerce with Microservices",
            description="Hands-on workshop on decomposing monoliths into microservices for high-traffic e-commerce platforms.",
            scheduled_at=now + timedelta(days=7, hours=14),
            duration_minutes=120, max_participants=25, price=75.0,
            status="published", tags=["Microservices", "E-commerce", "Architecture"],
        )
        ws2 = Workshop(
            mentor_id=mentor1.id,
            title="AI Product Management Fundamentals",
            description="Learn how to manage AI/ML product development from ideation to production.",
            scheduled_at=now + timedelta(days=14, hours=10),
            duration_minutes=90, max_participants=30, price=50.0,
            status="draft", tags=["AI", "Product Management", "ML"],
        )
        ws3 = Workshop(
            mentor_id=mentor3.id,
            title="HIPAA Compliance for Startups",
            description="Everything you need to know about HIPAA compliance when building health-tech products.",
            scheduled_at=now + timedelta(days=10, hours=16),
            duration_minutes=60, max_participants=20, price=40.0,
            status="published", tags=["HIPAA", "HealthTech", "Compliance"],
        )
        db.add_all([ws1, ws2, ws3])
        db.flush()

        db.add_all([
            WorkshopRegistration(workshop_id=ws1.id, mentee_id=mentee1.id),
            WorkshopRegistration(workshop_id=ws1.id, mentee_id=mentee2.id),
            WorkshopRegistration(workshop_id=ws3.id, mentee_id=mentee3.id),
        ])

        db.commit()
        print("✅ Database seeded successfully!")
        print(f"   - 1 admin: admin@phxnorth.com / admin123")
        print(f"   - 3 mentors: *@phxnorth.com / mentor123")
        print(f"   - 5 mentees: *@phxnorth.com / mentee123")
        print(f"   - {len(wallets)} mentee wallets (each with $10.00 starting balance)")
        print(f"   - {len(availability_data)} availability slots")
        print(f"   - 5 mentorship requests")
        print(f"   - 8 sessions (4 completed, 4 upcoming)")
        print(f"   - {len(timeline_data)} timeline entries (Sarah Chen)")
        print(f"   - {len(cred_data)} credentials (Sarah Chen)")
        print(f"   - 4 consulting projects, 3 applications")
        print(f"   - 3 workshops, 3 registrations")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
