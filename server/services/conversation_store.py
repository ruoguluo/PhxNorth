"""Conversation helpers and a lightweight startup migration (FR-05).

- ``get_or_create_conversation`` / ``link_message`` keep the durable
  mentor<->mentee thread in sync as messages are created.
- ``migrate_and_backfill`` adds the ``messages.conversation_id`` column (if the
  existing SQLite DB predates it) and backfills conversations from historical
  session messages. Safe to run on every startup (idempotent).
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import text
from sqlalchemy.orm import Session as DBSession

from database import engine
from models.conversation import Conversation
from models.message import Message
from models.session import Session as MentorSession


def get_or_create_conversation(
    db: DBSession, mentor_id: int, mentee_id: int, *, commit: bool = True
) -> Conversation:
    """Return the conversation for a mentor/mentee pair, creating it if needed."""
    convo = (
        db.query(Conversation)
        .filter(
            Conversation.mentor_id == mentor_id,
            Conversation.mentee_id == mentee_id,
        )
        .first()
    )
    if convo is None:
        convo = Conversation(
            mentor_id=mentor_id,
            mentee_id=mentee_id,
            last_message_at=datetime.utcnow(),
        )
        db.add(convo)
        if commit:
            db.commit()
            db.refresh(convo)
        else:
            db.flush()
    return convo


def link_message(
    db: DBSession,
    message: Message,
    mentor_id: int,
    mentee_id: int,
    *,
    commit: bool = True,
) -> Conversation:
    """Attach ``message`` to its conversation and bump ``last_message_at``."""
    convo = get_or_create_conversation(db, mentor_id, mentee_id, commit=False)
    message.conversation_id = convo.id
    convo.last_message_at = message.created_at or datetime.utcnow()
    if commit:
        db.commit()
        db.refresh(message)
    return convo


def _conversation_id_column_exists() -> bool:
    with engine.connect() as conn:
        rows = conn.execute(text("PRAGMA table_info(messages)")).fetchall()
        return any(r[1] == "conversation_id" for r in rows)


def migrate_and_backfill(db: DBSession) -> int:
    """Ensure the column exists and backfill conversations. Returns rows linked."""
    # 1) Add the column on legacy SQLite databases.
    try:
        if not _conversation_id_column_exists():
            with engine.begin() as conn:
                conn.execute(
                    text("ALTER TABLE messages ADD COLUMN conversation_id INTEGER")
                )
    except Exception:
        # Non-SQLite or already present; create_all handles fresh DBs.
        pass

    # 2) Backfill any messages without a conversation.
    unlinked = db.query(Message).filter(Message.conversation_id.is_(None)).all()
    if not unlinked:
        return 0

    # Cache session -> (mentor_id, mentee_id) to limit queries.
    session_pairs: dict[int, Optional[tuple[int, int]]] = {}
    linked = 0
    for msg in unlinked:
        if msg.session_id not in session_pairs:
            sess = (
                db.query(MentorSession)
                .filter(MentorSession.id == msg.session_id)
                .first()
            )
            session_pairs[msg.session_id] = (
                (sess.mentor_id, sess.mentee_id) if sess else None
            )
        pair = session_pairs[msg.session_id]
        if not pair:
            continue
        convo = get_or_create_conversation(db, pair[0], pair[1], commit=False)
        msg.conversation_id = convo.id
        if msg.created_at and (
            convo.last_message_at is None or msg.created_at > convo.last_message_at
        ):
            convo.last_message_at = msg.created_at
        linked += 1

    db.commit()
    return linked
