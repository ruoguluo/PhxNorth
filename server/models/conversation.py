"""Conversation model (FR-05).

A Conversation is the durable mentor<->mentee message thread. It spans every
session the pair shares, so "all conversations between mentees and mentors are
kept" and remain browsable independently of any single session.

Individual messages still carry their ``session_id`` (when sent inside a
session) but are also linked to a ``conversation_id`` so history can be
retrieved across sessions.
"""

from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    UniqueConstraint,
)
from database import Base


class Conversation(Base):
    """A durable mentor<->mentee thread spanning sessions."""

    __tablename__ = "conversations"
    __table_args__ = (
        UniqueConstraint("mentor_id", "mentee_id", name="uq_conversation_pair"),
    )

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    mentee_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_message_at = Column(DateTime, default=datetime.utcnow, index=True)
