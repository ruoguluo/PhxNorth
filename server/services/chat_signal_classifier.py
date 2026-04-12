"""Classify chat messages into behavioral event types for DISC signal extraction."""

import re
from datetime import datetime, timedelta
from sqlalchemy.orm import Session as DBSession
from models.message import Message

ENCOURAGEMENT_WORDS = {
    "great", "awesome", "well done", "good job", "nice", "excellent",
    "proud", "fantastic", "amazing", "brilliant", "wonderful", "perfect",
    "love it", "impressive", "outstanding", "bravo", "kudos",
}

STRUCTURED_LIST_RE = re.compile(r"^\s*(\d+[\.\)]\s|[\-\*\•]\s)", re.MULTILINE)

QUESTION_RE = re.compile(
    r"\?|^(how|what|why|when|where|who|which|could you|can you|would you|do you)",
    re.IGNORECASE | re.MULTILINE,
)


def classify_message(
    content: str,
    file_url: str | None,
    session_id: int,
    sender_id: int,
    created_at: datetime,
    db: DBSession,
) -> list[dict]:
    events: list[dict] = []
    meta = {"session_id": session_id, "sender_id": sender_id}

    # Rule 1: Rapid response
    if len(content) < 20:
        prev_msg = (
            db.query(Message)
            .filter(Message.session_id == session_id, Message.sender_id != sender_id, Message.created_at < created_at)
            .order_by(Message.created_at.desc())
            .first()
        )
        if prev_msg and (created_at - prev_msg.created_at).total_seconds() < 60:
            events.append({"event_type": "MESSAGE_RESPONDED", "platform": "chat", "payload": {**meta, "modifier": "fast_response"}})

    # Rule 2: Detailed feedback
    if len(content) > 200:
        events.append({"event_type": "MESSAGE_SENT", "platform": "chat", "payload": {**meta, "detail": "detailed_feedback", "length": len(content)}})

    # Rule 3: Encouragement
    content_lower = content.lower()
    if any(word in content_lower for word in ENCOURAGEMENT_WORDS):
        events.append({"event_type": "COMMENT_POSTED", "platform": "chat", "payload": {**meta, "detail": "encouragement"}})

    # Rule 4: Questions
    if QUESTION_RE.search(content):
        events.append({"event_type": "QUESTION_POSTED", "platform": "chat", "payload": {**meta, "detail": "collaborative_inquiry"}})

    # Rule 5: File attachment
    if file_url:
        events.append({"event_type": "CONTENT_SHARED", "platform": "chat", "payload": {**meta, "detail": "file_attachment"}})

    # Rule 6: First message in session
    earlier_count = (
        db.query(Message)
        .filter(Message.session_id == session_id, Message.created_at < created_at)
        .count()
    )
    if earlier_count == 0:
        events.append({"event_type": "MENTORSHIP_REQUESTED", "platform": "chat", "payload": {**meta, "detail": "session_initiator"}})

    # Rule 7: Structured communication
    if STRUCTURED_LIST_RE.search(content):
        events.append({"event_type": "MESSAGE_SENT", "platform": "chat", "payload": {**meta, "detail": "structured_communication"}})

    # Rule 8: High engagement (3+ in 2 min)
    two_min_ago = created_at - timedelta(minutes=2)
    recent_count = (
        db.query(Message)
        .filter(Message.session_id == session_id, Message.sender_id == sender_id, Message.created_at >= two_min_ago, Message.created_at <= created_at)
        .count()
    )
    if recent_count >= 3:
        events.append({"event_type": "MESSAGE_SENT", "platform": "chat", "payload": {**meta, "detail": "high_engagement", "count_in_2min": recent_count}})

    # Default: base MESSAGE_SENT if nothing matched
    if not events:
        events.append({"event_type": "MESSAGE_SENT", "platform": "chat", "payload": meta})

    return events
