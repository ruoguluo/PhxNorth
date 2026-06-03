"""Tests for credentials CRUD via the Credential model."""

from models.credential import Credential
from models.user import User
from utils.security import hash_password


def _make_user(db, email="cred@example.com"):
    user = User(
        email=email,
        username=email.split("@")[0],
        full_name="Cred User",
        hashed_password=hash_password("pass"),
        role="mentee",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def test_create_certification(db):
    user = _make_user(db)
    cred = Credential(
        user_id=user.id,
        type="certification",
        name="AWS Solutions Architect",
        issuer="Amazon",
        date_obtained="2023-06",
        visibility="public",
    )
    db.add(cred)
    db.commit()
    db.refresh(cred)

    assert cred.id is not None
    assert cred.type == "certification"
    assert cred.name == "AWS Solutions Architect"


def test_create_training(db):
    user = _make_user(db)
    cred = Credential(
        user_id=user.id,
        type="training",
        name="React Bootcamp",
        issuer="Codecademy",
        training_type="Online Course",
        duration="12 weeks",
    )
    db.add(cred)
    db.commit()
    db.refresh(cred)

    assert cred.training_type == "Online Course"


def test_create_psychometric(db):
    user = _make_user(db)
    cred = Credential(
        user_id=user.id,
        type="psychometric",
        name="DISC Assessment",
        test_type="DISC Assessment",
        result_summary="Primary: D, Secondary: I",
    )
    db.add(cred)
    db.commit()
    db.refresh(cred)

    assert cred.test_type == "DISC Assessment"
    assert cred.result_summary == "Primary: D, Secondary: I"


def test_list_by_type(db):
    user = _make_user(db)
    db.add(Credential(user_id=user.id, type="certification", name="AWS"))
    db.add(Credential(user_id=user.id, type="training", name="React"))
    db.add(Credential(user_id=user.id, type="certification", name="GCP"))
    db.commit()

    certs = db.query(Credential).filter(
        Credential.user_id == user.id,
        Credential.type == "certification",
    ).all()
    assert len(certs) == 2


def test_update_credential(db):
    user = _make_user(db)
    cred = Credential(user_id=user.id, type="certification", name="AWS SA")
    db.add(cred)
    db.commit()

    cred.name = "AWS Solutions Architect Professional"
    cred.issuer = "Amazon Web Services"
    db.commit()
    db.refresh(cred)

    assert cred.name == "AWS Solutions Architect Professional"


def test_delete_credential(db):
    user = _make_user(db)
    cred = Credential(user_id=user.id, type="training", name="Old Course")
    db.add(cred)
    db.commit()
    cred_id = cred.id

    db.delete(cred)
    db.commit()

    assert db.query(Credential).filter(Credential.id == cred_id).first() is None
