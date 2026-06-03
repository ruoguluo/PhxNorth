"""Tests for workshop and registration models."""

from models.workshop import Workshop, WorkshopRegistration
from models.user import User
from utils.security import hash_password


def _make_mentor(db, email="wmentor@test.com"):
    user = User(email=email, username=email.split("@")[0], full_name="Mentor",
                hashed_password=hash_password("pass"), role="mentor")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def _make_mentee(db, email="wmentee@test.com"):
    user = User(email=email, username=email.split("@")[0], full_name="Mentee",
                hashed_password=hash_password("pass"), role="mentee")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def test_create_workshop(db):
    mentor = _make_mentor(db)
    ws = Workshop(
        mentor_id=mentor.id, title="Intro to ML",
        description="Learn ML basics", duration_minutes=90,
        max_participants=20, price=50.0, tags=["ML", "Python"],
    )
    db.add(ws)
    db.commit()
    db.refresh(ws)
    assert ws.id is not None
    assert ws.status == "draft"
    assert ws.mentor_id == mentor.id


def test_publish_workshop(db):
    mentor = _make_mentor(db)
    ws = Workshop(mentor_id=mentor.id, title="Test WS")
    db.add(ws)
    db.commit()
    ws.status = "published"
    db.commit()
    db.refresh(ws)
    assert ws.status == "published"


def test_register_for_workshop(db):
    mentor = _make_mentor(db)
    mentee = _make_mentee(db)
    ws = Workshop(mentor_id=mentor.id, title="WS", status="published", max_participants=10)
    db.add(ws)
    db.commit()

    reg = WorkshopRegistration(workshop_id=ws.id, mentee_id=mentee.id)
    db.add(reg)
    db.commit()
    db.refresh(reg)
    assert reg.status == "registered"


def test_cancel_registration(db):
    mentor = _make_mentor(db)
    mentee = _make_mentee(db)
    ws = Workshop(mentor_id=mentor.id, title="WS", status="published")
    db.add(ws)
    db.commit()

    reg = WorkshopRegistration(workshop_id=ws.id, mentee_id=mentee.id)
    db.add(reg)
    db.commit()

    reg.status = "cancelled"
    db.commit()
    db.refresh(reg)
    assert reg.status == "cancelled"


def test_capacity_check(db):
    mentor = _make_mentor(db)
    ws = Workshop(mentor_id=mentor.id, title="Small WS", status="published", max_participants=2)
    db.add(ws)
    db.commit()

    m1 = _make_mentee(db, "m1@test.com")
    m2 = _make_mentee(db, "m2@test.com")
    db.add(WorkshopRegistration(workshop_id=ws.id, mentee_id=m1.id))
    db.add(WorkshopRegistration(workshop_id=ws.id, mentee_id=m2.id))
    db.commit()

    count = db.query(WorkshopRegistration).filter(
        WorkshopRegistration.workshop_id == ws.id,
        WorkshopRegistration.status == "registered",
    ).count()
    assert count == 2
    assert count >= ws.max_participants
