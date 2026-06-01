"""Tests for mentor matching (intent + profile scoring)."""

from models.user import User
from services.mentor_matcher import MatchInput, match_mentors, tokenize


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
