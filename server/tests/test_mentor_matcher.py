"""Tests for mentor matching (intent + profile scoring)."""

from models.user import User
from services.mentor_matcher import (
    MatchInput, match_mentors, tokenize, _behavioral_score,
)


def _mentor(db, **kw):
    defaults = dict(
        email=f"{kw.get('username','m')}@t.com",
        username=kw.get("username", "m"),
        full_name=kw.get("full_name", "A Mentor"),
        hashed_password="x",
        role="mentor",
        is_active=True,
        is_online=False,
        rating=0.0,
        total_sessions=0,
    )
    defaults.update(kw)
    u = User(**defaults)
    db.add(u)
    db.commit()
    db.refresh(u)
    return u


def test_tokenize_drops_stopwords_and_short():
    toks = tokenize("I want to get into UK Chemistry admissions")
    assert "chemistry" in toks
    assert "admissions" in toks
    assert "to" not in toks and "i" not in toks


def test_topic_relevance_ranks_specialist_first(db):
    _mentor(
        db, username="chem", full_name="Dr Chem",
        specializations=["Chemistry", "UK Admissions", "UCAS"],
        industry="Education", rating=4.0, total_sessions=10,
    )
    _mentor(
        db, username="fin", full_name="Ms Finance",
        specializations=["Investment Banking", "M&A"],
        industry="Finance", rating=5.0, total_sessions=200,
    )
    intent = MatchInput(category="education", primary_goal="UK chemistry admissions")
    results = match_mentors(db, intent, limit=5)

    assert results[0]["name"] == "Dr Chem"  # topic beats raw track record
    assert results[0]["matchScore"] >= results[1]["matchScore"]
    assert any("topic match" in r for r in results[0]["reasons"])


def test_budget_penalises_overpriced(db):
    cheap = _mentor(db, username="cheap", full_name="Cheap", specializations=["Strategy"],
                    hourly_rate=50.0, rating=4.0, total_sessions=10)
    pricey = _mentor(db, username="pricey", full_name="Pricey", specializations=["Strategy"],
                     hourly_rate=500.0, rating=4.0, total_sessions=10)
    intent = MatchInput(primary_goal="business strategy", max_budget=100.0)
    results = match_mentors(db, intent, limit=5)
    by_name = {r["name"]: r["matchScore"] for r in results}
    assert by_name["Cheap"] > by_name["Pricey"]


def test_online_mentor_scores_higher_on_logistics(db):
    on = _mentor(db, username="on", full_name="Online", specializations=["Marketing"],
                 is_online=True, rating=4.0, total_sessions=10)
    off = _mentor(db, username="off", full_name="Offline", specializations=["Marketing"],
                  is_online=False, rating=4.0, total_sessions=10)
    intent = MatchInput(primary_goal="marketing growth")
    results = match_mentors(db, intent, limit=5)
    by_name = {r["name"]: r for r in results}
    assert by_name["Online"]["status"] == "online"
    assert by_name["Online"]["matchScore"] >= by_name["Offline"]["matchScore"]


def test_response_shape_and_confidence_buckets(db):
    _mentor(db, username="x", full_name="X", specializations=["Chemistry"],
            rating=5.0, total_sessions=100, is_online=True)
    intent = MatchInput(primary_goal="chemistry")
    r = match_mentors(db, intent, limit=1)[0]
    # drop-in shape for the frontend MentorMatch
    for key in ("id", "name", "title", "expertise", "matchScore", "matchConfidence",
                "status", "sessionsCompleted", "avatarColor", "menteesMarked",
                "deepDialogues"):
        assert key in r
    assert r["matchConfidence"] in {"High", "Good", "Moderate"}
    assert 0 <= r["matchScore"] <= 100


def test_no_intent_returns_neutral_ranking(db):
    _mentor(db, username="a", full_name="A", specializations=["Anything"],
            rating=4.0, total_sessions=10)
    intent = MatchInput()  # no signal
    results = match_mentors(db, intent, limit=5)
    assert len(results) == 1
    assert 0 <= results[0]["matchScore"] <= 100


# ── Behavioral (DISC) scoring tests ─────────────────────────────────


def _user_with_disc(disc: dict | None, **kw) -> User:
    """Create an in-memory User with disc_scores_json (no DB needed)."""
    defaults = dict(
        email="u@t.com", username="u", full_name="U",
        hashed_password="x", role="mentee", is_active=True, is_online=False,
        rating=0.0, total_sessions=0,
    )
    defaults.update(kw)
    u = User(**defaults)
    u.disc_scores_json = disc
    return u


def test_behavioral_returns_neutral_when_no_disc_data():
    mentor = _user_with_disc(None, role="mentor")
    mentee = _user_with_disc(None)
    assert _behavioral_score(mentor, mentee) == 0.5


def test_behavioral_returns_neutral_when_mentee_is_none():
    mentor = _user_with_disc({"D": 70, "I": 50, "S": 60, "C": 40}, role="mentor")
    assert _behavioral_score(mentor, None) == 0.5


def test_behavioral_returns_neutral_when_only_mentor_has_disc():
    mentor = _user_with_disc({"D": 70, "I": 50, "S": 60, "C": 40}, role="mentor")
    mentee = _user_with_disc(None)
    assert _behavioral_score(mentor, mentee) == 0.5


def test_behavioral_high_s_mentor_with_low_s_mentee():
    """High-S mentor + low-S mentee should get the complementary bonus."""
    mentor = _user_with_disc({"D": 40, "I": 50, "S": 75, "C": 50}, role="mentor")
    mentee = _user_with_disc({"D": 40, "I": 50, "S": 30, "C": 50})
    score = _behavioral_score(mentor, mentee)
    assert score > 0.5, "Complementary S pairing should score above neutral"


def test_behavioral_high_c_pair_gets_bonus():
    """Both high-C should get the detail-oriented bonus."""
    mentor = _user_with_disc({"D": 30, "I": 40, "S": 50, "C": 80}, role="mentor")
    mentee = _user_with_disc({"D": 30, "I": 40, "S": 50, "C": 70})
    score = _behavioral_score(mentor, mentee)
    assert score > 0.5


def test_behavioral_extreme_d_mismatch_penalised():
    """Extreme D mismatch (diff > 40) should score below the complementary pair."""
    # Clashing pair: high-D mentor, low-D mentee with large gap
    clash_mentor = _user_with_disc({"D": 90, "I": 40, "S": 30, "C": 40}, role="mentor")
    clash_mentee = _user_with_disc({"D": 20, "I": 40, "S": 30, "C": 40})
    # Balanced pair: similar D
    bal_mentor = _user_with_disc({"D": 50, "I": 40, "S": 30, "C": 40}, role="mentor")
    bal_mentee = _user_with_disc({"D": 45, "I": 40, "S": 30, "C": 40})
    clash_score = _behavioral_score(clash_mentor, clash_mentee)
    bal_score = _behavioral_score(bal_mentor, bal_mentee)
    assert bal_score > clash_score


def test_behavioral_score_clamped_0_to_1():
    """Score must always be between 0.0 and 1.0."""
    mentor = _user_with_disc({"D": 100, "I": 100, "S": 100, "C": 100}, role="mentor")
    mentee = _user_with_disc({"D": 0, "I": 0, "S": 0, "C": 0})
    score = _behavioral_score(mentor, mentee)
    assert 0.0 <= score <= 1.0


def test_behavioral_boosts_mentor_with_disc_in_full_match(db):
    """Mentor with DISC data matching a mentee with DISC data should score
    higher on behavioral than a mentor without DISC data."""
    m_with = _mentor(
        db, username="disc_m", full_name="DISC Mentor",
        specializations=["Finance"], rating=4.0, total_sessions=10,
    )
    m_with.disc_scores_json = {"D": 40, "I": 50, "S": 70, "C": 60}
    db.commit()

    m_without = _mentor(
        db, username="nodisc_m", full_name="No DISC Mentor",
        specializations=["Finance"], rating=4.0, total_sessions=10,
    )
    # m_without has no disc_scores_json

    mentee = User(
        email="mentee@t.com", username="mentee", full_name="Mentee",
        hashed_password="x", role="mentee", is_active=True, is_online=False,
        rating=0.0, total_sessions=0,
    )
    mentee.disc_scores_json = {"D": 45, "I": 55, "S": 30, "C": 55}
    db.add(mentee)
    db.commit()

    intent = MatchInput(primary_goal="finance career")
    results = match_mentors(db, intent, mentee=mentee, limit=5)
    by_name = {r["name"]: r["matchScore"] for r in results}
    assert by_name["DISC Mentor"] > by_name["No DISC Mentor"]
