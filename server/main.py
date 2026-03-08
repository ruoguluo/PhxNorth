from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import auth, profile, mentorship, admin

# Create all tables
Base.metadata.create_all(bind=engine)

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


@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "PhxNorth API is running"}
