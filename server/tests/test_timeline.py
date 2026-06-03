"""Tests for timeline_entries CRUD via the TimelineEntry model."""

from models.timeline_entry import TimelineEntry
from models.user import User
from utils.security import hash_password


def _make_user(db, email="test@example.com"):
    user = User(
        email=email,
        username=email.split("@")[0],
        full_name="Test User",
        hashed_password=hash_password("pass"),
        role="mentee",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def test_create_timeline_entry(db):
    user = _make_user(db)
    entry = TimelineEntry(
        user_id=user.id,
        type="career",
        title="Software Engineer",
        organization="Acme Corp",
        start_date="2020-01",
        is_current=True,
        visibility="public",
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    assert entry.id is not None
    assert entry.type == "career"
    assert entry.title == "Software Engineer"
    assert entry.user_id == user.id


def test_list_timeline_entries_by_type(db):
    user = _make_user(db)
    db.add(TimelineEntry(user_id=user.id, type="education", title="BSc CS"))
    db.add(TimelineEntry(user_id=user.id, type="career", title="Dev"))
    db.add(TimelineEntry(user_id=user.id, type="career", title="Senior Dev"))
    db.commit()

    careers = db.query(TimelineEntry).filter(
        TimelineEntry.user_id == user.id,
        TimelineEntry.type == "career",
    ).all()
    assert len(careers) == 2

    all_entries = db.query(TimelineEntry).filter(
        TimelineEntry.user_id == user.id,
    ).all()
    assert len(all_entries) == 3


def test_update_timeline_entry(db):
    user = _make_user(db)
    entry = TimelineEntry(user_id=user.id, type="career", title="Dev")
    db.add(entry)
    db.commit()

    entry.title = "Senior Dev"
    entry.organization = "BigCo"
    db.commit()
    db.refresh(entry)

    assert entry.title == "Senior Dev"
    assert entry.organization == "BigCo"


def test_delete_timeline_entry(db):
    user = _make_user(db)
    entry = TimelineEntry(user_id=user.id, type="education", title="MBA")
    db.add(entry)
    db.commit()
    entry_id = entry.id

    db.delete(entry)
    db.commit()

    assert db.query(TimelineEntry).filter(TimelineEntry.id == entry_id).first() is None


def test_sort_order(db):
    user = _make_user(db)
    db.add(TimelineEntry(user_id=user.id, type="career", title="First", sort_order=2))
    db.add(TimelineEntry(user_id=user.id, type="career", title="Second", sort_order=1))
    db.commit()

    entries = (
        db.query(TimelineEntry)
        .filter(TimelineEntry.user_id == user.id)
        .order_by(TimelineEntry.sort_order)
        .all()
    )
    assert entries[0].title == "Second"
    assert entries[1].title == "First"
