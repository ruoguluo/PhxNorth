"""Tests for the conversation store (FR-05).

Exercises thread creation, message linking, and the backfill against an
in-memory SQLite database (see ``conftest.db``).
"""

from datetime import datetime, timedelta

from models.user import User
from models.session import Session as MentorSession
from models.message import Message
from models.conversation import Conversation
from services import conversation_store as cs


def _users(db):
    mentor = User(
        email="mentor@t.com", username="mentor", full_name="Mentor One",
        hashed_password="x", role="mentor",
    )
    mentee = User(
        email="mentee@t.com", username="mentee", full_name="Mentee One",
        hashed_password="x", role="mentee",
    )
    db.add_all([mentor, mentee])
    db.commit()
    db.refresh(mentor)
    db.refresh(mentee)
    return mentor, mentee


def _session(db, mentor, mentee):
    s = MentorSession(
        mentor_id=mentor.id, mentee_id=mentee.id,
        scheduled_at=datetime.utcnow(), duration_minutes=30,
        topic="T", price=0.0, status="upcoming",
    )
    db.add(s)
    db.commit()
    db.refresh(s)
    return s


def test_get_or_create_is_idempotent(db):
    mentor, mentee = _users(db)
    c1 = cs.get_or_create_conversation(db, mentor.id, mentee.id)
    c2 = cs.get_or_create_conversation(db, mentor.id, mentee.id)
    assert c1.id == c2.id
    assert db.query(Conversation).count() == 1


def test_link_message_sets_thread_and_bumps_timestamp(db):
    mentor, mentee = _users(db)
    s = _session(db, mentor, mentee)
    when = datetime.utcnow()
    msg = Message(
        session_id=s.id, sender_id=mentee.id, sender_role="mentee",
        content="hello", created_at=when,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    convo = cs.link_message(db, msg, mentor.id, mentee.id)
    assert msg.conversation_id == convo.id
    assert convo.last_message_at == when


def test_backfill_links_orphan_messages(db):
    mentor, mentee = _users(db)
    s = _session(db, mentor, mentee)
    t0 = datetime.utcnow()
    m1 = Message(session_id=s.id, sender_id=mentee.id, sender_role="mentee",
                 content="first", created_at=t0)
    m2 = Message(session_id=s.id, sender_id=mentor.id, sender_role="mentor",
                 content="second", created_at=t0 + timedelta(minutes=5))
    db.add_all([m1, m2])
    db.commit()

    # Pre-condition: no conversations, messages unlinked.
    assert db.query(Conversation).count() == 0

    linked = cs.migrate_and_backfill(db)
    assert linked == 2

    convo = db.query(Conversation).one()
    db.refresh(m1)
    db.refresh(m2)
    assert m1.conversation_id == convo.id
    assert m2.conversation_id == convo.id
    # last_message_at should track the most recent message.
    assert convo.last_message_at == t0 + timedelta(minutes=5)


def test_backfill_is_idempotent(db):
    mentor, mentee = _users(db)
    s = _session(db, mentor, mentee)
    db.add(Message(session_id=s.id, sender_id=mentee.id, sender_role="mentee",
                   content="hi", created_at=datetime.utcnow()))
    db.commit()

    assert cs.migrate_and_backfill(db) == 1
    assert cs.migrate_and_backfill(db) == 0
    assert db.query(Conversation).count() == 1


def test_separate_pairs_get_separate_threads(db):
    mentor, mentee = _users(db)
    other = User(email="o@t.com", username="o", full_name="Other Mentee",
                 hashed_password="x", role="mentee")
    db.add(other)
    db.commit()
    db.refresh(other)

    c1 = cs.get_or_create_conversation(db, mentor.id, mentee.id)
    c2 = cs.get_or_create_conversation(db, mentor.id, other.id)
    assert c1.id != c2.id
    assert db.query(Conversation).count() == 2
