"""Test configuration for the demo server.

Adds the server package root to sys.path so the flat imports used by the app
(``from database import ...``) resolve, and provides an isolated in-memory
SQLite session bound to the shared declarative Base.
"""

import os
import sys
from pathlib import Path

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Ensure the server root (parent of this tests/ dir) is importable.
SERVER_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SERVER_ROOT))

# Use an in-memory DB for any module that reads DATABASE_URL at import.
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")

# Import models so all tables register on Base before create_all.
from database import Base  # noqa: E402
import models.user  # noqa: E402,F401
import models.session  # noqa: E402,F401
import models.mentorship_request  # noqa: E402,F401
import models.billing  # noqa: E402,F401
import models.timeline_entry  # noqa: E402,F401
import models.credential  # noqa: E402,F401
import models.consulting_project  # noqa: E402,F401
import models.workshop  # noqa: E402,F401


@pytest.fixture
def db():
    """A fresh in-memory SQLite session with all tables created."""
    engine = create_engine(
        "sqlite:///:memory:", connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        yield session
    finally:
        session.close()
        engine.dispose()
