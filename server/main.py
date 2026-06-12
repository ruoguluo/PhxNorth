from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base, SessionLocal
from routers import auth, profile, mentorship, admin, messages, billing, conversations, timeline, credentials, consulting, workshops, video, stripe_billing
# Import models so their tables are registered on Base before create_all.
import models.billing  # noqa: F401
import models.conversation  # noqa: F401
import models.timeline_entry  # noqa: F401
import models.credential  # noqa: F401
import models.consulting_project  # noqa: F401
import models.workshop  # noqa: F401
import models.wallet  # noqa: F401

# Create all tables
Base.metadata.create_all(bind=engine)

# FR-05: migrate legacy message rows and backfill conversation threads.
try:
    from services.conversation_store import migrate_and_backfill

    _bf_db = SessionLocal()
    try:
        _n = migrate_and_backfill(_bf_db)
        if _n:
            print(f"[startup] backfilled {_n} message(s) into conversations")
    finally:
        _bf_db.close()
except Exception as _e:  # never block startup on backfill
    print(f"[startup] conversation backfill skipped: {_e}")

app = FastAPI(
    title="PhxNorth API",
    description="AI-Native Human Capital Infrastructure Platform API",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(mentorship.router)
app.include_router(admin.router)
app.include_router(messages.router)
app.include_router(conversations.router)
app.include_router(billing.router)
app.include_router(timeline.router)
app.include_router(credentials.router)
app.include_router(consulting.router)
app.include_router(workshops.router)
app.include_router(video.router)
app.include_router(stripe_billing.router)


@app.on_event("startup")
def _start_payout_scheduler() -> None:
    """Start the daily mentor payout job (FR-07)."""
    from services.payments.scheduler import start_scheduler

    if start_scheduler():
        print("[startup] payout scheduler started")


@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "PhxNorth API is running"}
