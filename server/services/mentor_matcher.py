"""Mentor matching (intent + profile scoring).

Replaces the hardcoded mentor list in the mentee question-entry flow with a
ranked match over real mentors, scored from the structured question intent
(produced by the FR-03 ``/questions/interpret`` step) plus mentor profile data.

Scoring is a transparent weighted sum (each component in 0..1):

    topic       0.35   intent tokens vs specializations + industry + field + bio
    track       0.25   rating and sessions completed
    logistics   0.15   online/availability and price-within-budget
    behavioral  0.15   DISC/5D compatibility (from cached disc_scores_json)
    stage       0.10   experience appropriate to the mentee's stage

The ``behavioral`` component reads cached DISC scores (``User.disc_scores_json``)
written by the frontend whenever it loads a user's DISC profile from the
behavioral backend. If scores are unavailable for either party, the component
returns a neutral 0.5 so it doesn't bias ranking.
"""

from __future__ import annotations

import math
import re
from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy.orm import Session as DBSession

from models.mentor_availability import MentorAvailability
from models.mentorship_request import MentorshipRequest
from models.session import Session as MentorSession
from models.user import User

WEIGHTS = {
    "topic": 0.35,
    "track": 0.25,
    "logistics": 0.15,
    "behavioral": 0.15,
    "stage": 0.10,
}

_AVATAR_COLORS = [
    "bg-blue-600", "bg-purple-600", "bg-emerald-600", "bg-amber-600",
    "bg-pink-600", "bg-indigo-600", "bg-teal-600", "bg-rose-600", "bg-slate-700",
]

_STOPWORDS = {
    "the", "a", "an", "to", "for", "of", "in", "on", "and", "or", "my", "me",
    "i", "want", "need", "how", "do", "with", "is", "are", "get", "into",
    "help", "about", "can", "should", "would", "what", "this", "that", "at",
}


def tokenize(text: Optional[str]) -> set[str]:
    if not text:
        return set()
    tokens = re.split(r"[^a-z0-9]+", text.lower())
    return {t for t in tokens if len(t) > 2 and t not in _STOPWORDS}


def _mentor_tokens(mentor: User) -> set[str]:
    parts: list[str] = []
    specs = mentor.specializations or []
    if isinstance(specs, list):
        parts.extend(str(s) for s in specs)
    for attr in ("industry", "field_of_study", "bio", "sector", "sub_sector"):
        val = getattr(mentor, attr, None)
        if val:
            parts.append(str(val))
    return tokenize(" ".join(parts))


def _topic_score(intent_tokens: set[str], mentor: User) -> tuple[float, int]:
    if not intent_tokens:
        return 0.5, 0  # no intent signal -> neutral
    mt = _mentor_tokens(mentor)
    overlap = intent_tokens & mt
    score = len(overlap) / float(len(intent_tokens))
    return min(1.0, score), len(overlap)


def _track_score(mentor: User) -> float:
    rating = (mentor.rating or 0.0) / 5.0
    # log-scaled session experience, saturating around ~150 sessions.
    sessions = math.log1p(max(0, mentor.total_sessions or 0)) / math.log1p(150)
    return max(0.0, min(1.0, 0.6 * rating + 0.4 * min(1.0, sessions)))


def _logistics_score(mentor: User, req: "MatchInput") -> float:
    score = 0.5
    if mentor.is_online:
        score += 0.3
    if req.max_budget is not None and mentor.hourly_rate is not None:
        score += 0.2 if mentor.hourly_rate <= req.max_budget else -0.3
    return max(0.0, min(1.0, score))


def _stage_score(mentor: User, req: "MatchInput") -> float:
    # Light heuristic: advanced stages benefit from more experienced mentors.
    advanced = (req.stage or "").lower() in {"reviewing", "interview", "submitted", "finalising", "finalizing"}
    sessions = mentor.total_sessions or 0
    if advanced:
        return 1.0 if sessions >= 20 else 0.5
    return 0.7  # most stages are fine with any mentor


def _behavioral_score(mentor: User, mentee: Optional[User]) -> float:
    """DISC/5D compatibility between mentee and mentor.

    Scoring logic:
    - Complementary pairing scores higher (e.g. high-S mentor + low-S mentee)
    - Extreme mismatches on critical dimensions score lower
    - Returns 0.5 (neutral) if DISC data is unavailable for either party

    Reads cached ``disc_scores_json`` on the User model (written back by the
    frontend when it loads DISC data from the behavioral backend).
    """
    mentor_disc = getattr(mentor, "disc_scores_json", None)
    mentee_disc = getattr(mentee, "disc_scores_json", None) if mentee else None

    if not mentor_disc or not mentee_disc:
        return 0.5  # No data — neutral

    try:
        md = mentor_disc if isinstance(mentor_disc, dict) else {}
        td = mentee_disc if isinstance(mentee_disc, dict) else {}

        if not md or not td:
            return 0.5

        score = 0.5  # Base

        # Complementary S (Steadiness): High-S mentors are good for uncertain mentees
        mentor_s = md.get("S", 50)
        mentee_s = td.get("S", 50)
        if mentor_s > 60 and mentee_s < 40:
            score += 0.15  # Great complement
        elif mentor_s > 50:
            score += 0.05

        # Complementary D (Dominance): Balanced is better than extreme mismatch
        mentor_d = md.get("D", 50)
        mentee_d = td.get("D", 50)
        d_diff = abs(mentor_d - mentee_d)
        if d_diff < 20:
            score += 0.05  # Similar energy
        elif d_diff > 40:
            score -= 0.05  # May clash

        # High-C mentors good for detail-oriented mentees
        mentor_c = md.get("C", 50)
        mentee_c = td.get("C", 50)
        if mentor_c > 60 and mentee_c > 50:
            score += 0.1  # Both detail-oriented

        # High-I mentors good for mentees needing motivation
        mentor_i = md.get("I", 50)
        if mentor_i > 60:
            score += 0.05  # Engaging communicator

        return max(0.0, min(1.0, score))
    except Exception:
        return 0.5


class MatchInput:
    """Normalised matching intent (built from the FR-03 understanding)."""

    def __init__(
        self,
        *,
        category: Optional[str] = None,
        subtype: Optional[str] = None,
        primary_goal: Optional[str] = None,
        stage: Optional[str] = None,
        country: Optional[str] = None,
        keywords: Optional[list[str]] = None,
        max_budget: Optional[float] = None,
        raw_question: Optional[str] = None,
    ) -> None:
        self.category = category
        self.subtype = subtype
        self.primary_goal = primary_goal
        self.stage = stage
        self.country = country
        self.keywords = keywords or []
        self.max_budget = max_budget
        self.raw_question = raw_question

    def intent_tokens(self) -> set[str]:
        text = " ".join(
            filter(
                None,
                [
                    self.category,
                    self.subtype,
                    self.primary_goal,
                    self.raw_question,
                    " ".join(self.keywords),
                ],
            )
        )
        return tokenize(text)


def _confidence(score: float) -> str:
    if score >= 0.75:
        return "High"
    if score >= 0.55:
        return "Good"
    return "Moderate"


def _next_availability(db: DBSession, mentor_id: int) -> Optional[str]:
    """Find the mentor's next available slot from their weekly schedule.

    Returns an ISO-8601 datetime string for the next upcoming slot, or None
    if no availability is configured.
    """
    slots = (
        db.query(MentorAvailability)
        .filter(
            MentorAvailability.mentor_id == mentor_id,
            MentorAvailability.is_active == True,  # noqa: E712
        )
        .all()
    )
    if not slots:
        return None

    now = datetime.utcnow()
    current_dow = now.weekday()  # 0=Monday

    best: Optional[datetime] = None
    for slot in slots:
        # Parse start_time "HH:MM"
        parts = (slot.start_time or "").split(":")
        if len(parts) != 2:
            continue
        try:
            hour, minute = int(parts[0]), int(parts[1])
        except (ValueError, TypeError):
            continue

        # Days ahead until this slot's day_of_week
        days_ahead = (slot.day_of_week - current_dow) % 7
        candidate = now.replace(hour=hour, minute=minute, second=0, microsecond=0) + timedelta(days=days_ahead)

        # If the candidate is in the past today, push to next week
        if candidate <= now:
            candidate += timedelta(days=7)

        if best is None or candidate < best:
            best = candidate

    return best.isoformat() + "Z" if best else None


def _engagement_counts(db: DBSession, mentor_id: int) -> tuple[int, int]:
    """(distinct mentees, completed sessions) for display badges."""
    distinct_mentees = (
        db.query(MentorSession.mentee_id)
        .filter(MentorSession.mentor_id == mentor_id)
        .distinct()
        .count()
    )
    completed = (
        db.query(MentorSession)
        .filter(
            MentorSession.mentor_id == mentor_id,
            MentorSession.status == "completed",
        )
        .count()
    )
    return distinct_mentees, completed


def match_mentors(
    db: DBSession,
    req: MatchInput,
    mentee: Optional[User] = None,
    *,
    limit: int = 8,
) -> list[dict]:
    """Return ranked mentor matches as MentorMatch-shaped dicts."""
    intent_tokens = req.intent_tokens()

    candidates = (
        db.query(User)
        .filter(User.role == "mentor", User.is_active == True)  # noqa: E712
        .all()
    )

    # Pre-compute queue data per mentor (active sessions + pending requests)
    active_sessions: dict[int, int] = {}
    pending_requests: dict[int, int] = {}
    for m in candidates:
        active_sessions[m.id] = (
            db.query(MentorSession)
            .filter(MentorSession.mentor_id == m.id, MentorSession.status == "in_progress")
            .count()
        )
        pending_requests[m.id] = (
            db.query(MentorshipRequest)
            .filter(MentorshipRequest.mentor_id == m.id, MentorshipRequest.status == "pending")
            .count()
        )

    scored: list[tuple[float, dict]] = []
    for mentor in candidates:
        topic, overlap = _topic_score(intent_tokens, mentor)
        components = {
            "topic": topic,
            "track": _track_score(mentor),
            "logistics": _logistics_score(mentor, req),
            "behavioral": _behavioral_score(mentor, mentee),
            "stage": _stage_score(mentor, req),
        }
        total = sum(WEIGHTS[k] * v for k, v in components.items())

        reasons: list[str] = []
        if overlap:
            reasons.append(f"{overlap} topic match(es) with your question")
        if mentor.rating and mentor.rating >= 4.5:
            reasons.append(f"Highly rated ({mentor.rating:.1f}/5)")
        if mentor.is_online:
            reasons.append("Available now")
        if req.country and mentor.current_country and \
                req.country.lower() == mentor.current_country.lower():
            reasons.append(f"Based in {mentor.current_country}")

        specs = mentor.specializations or []
        expertise = [str(s) for s in specs][:3] if isinstance(specs, list) else []
        if not expertise and mentor.industry:
            expertise = [mentor.industry]

        marked, deep = _engagement_counts(db, mentor.id)

        match = {
            "id": str(mentor.id),
            "name": (None if mentor.keep_name_private else mentor.full_name) or "Mentor",
            "title": mentor.industry or mentor.field_of_study or "Mentor",
            "expertise": expertise,
            "experience": mentor.years_experience or f"{mentor.total_sessions or 0} sessions",
            "matchScore": int(round(total * 100)),
            "matchConfidence": _confidence(total),
            "availability": "Available now" if mentor.is_online else "By appointment",
            "responseTime": "< 5 min" if mentor.is_online else "N/A",
            "sessionsCompleted": mentor.total_sessions or 0,
            "avatarColor": _AVATAR_COLORS[mentor.id % len(_AVATAR_COLORS)],
            "status": "online" if mentor.is_online else "offline",
            "mentorshipType": "both",
            "menteesMarked": marked,
            "deepDialogues": deep,
            "reasons": reasons,
            "hourlyRate": mentor.hourly_rate or 0,
            "queueLength": active_sessions.get(mentor.id, 0) + pending_requests.get(mentor.id, 0),
            "estimatedWaitTime": (
                f"{(active_sessions.get(mentor.id, 0) + pending_requests.get(mentor.id, 0)) * 15} min"
                if active_sessions.get(mentor.id, 0) + pending_requests.get(mentor.id, 0) > 0
                else None
            ),
            "nextAvailability": _next_availability(db, mentor.id),
        }
        scored.append((total, match))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [m for _, m in scored[:limit]]
