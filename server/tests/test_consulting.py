"""Tests for consulting project and application models."""

from models.consulting_project import ConsultingProject, ProjectApplication
from models.user import User
from utils.security import hash_password


def _make_admin(db):
    user = User(email="admin@test.com", username="admin", full_name="Admin",
                hashed_password=hash_password("pass"), role="admin")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def _make_mentor(db, email="mentor@test.com"):
    user = User(email=email, username=email.split("@")[0], full_name="Mentor",
                hashed_password=hash_password("pass"), role="mentor")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def test_create_project(db):
    admin = _make_admin(db)
    project = ConsultingProject(
        title="AI Strategy", description="Help with AI roadmap",
        client_name="Acme Corp", budget_min=5000, budget_max=10000,
        duration_weeks=4, required_skills=["AI", "Strategy"],
        industry="Technology", created_by=admin.id,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    assert project.id is not None
    assert project.status == "open"
    assert project.created_by == admin.id


def test_apply_to_project(db):
    admin = _make_admin(db)
    mentor = _make_mentor(db)
    project = ConsultingProject(title="Test", created_by=admin.id)
    db.add(project)
    db.commit()

    app = ProjectApplication(
        project_id=project.id, mentor_id=mentor.id,
        proposal="I can help", proposed_rate=150.0,
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    assert app.status == "pending"
    assert app.mentor_id == mentor.id


def test_approve_rejects_others(db):
    admin = _make_admin(db)
    m1 = _make_mentor(db, "m1@test.com")
    m2 = _make_mentor(db, "m2@test.com")
    project = ConsultingProject(title="Bid Project", created_by=admin.id)
    db.add(project)
    db.commit()

    app1 = ProjectApplication(project_id=project.id, mentor_id=m1.id, proposal="A")
    app2 = ProjectApplication(project_id=project.id, mentor_id=m2.id, proposal="B")
    db.add_all([app1, app2])
    db.commit()

    app1.status = "approved"
    project.status = "in_progress"
    project.assigned_mentor_id = m1.id
    db.query(ProjectApplication).filter(
        ProjectApplication.project_id == project.id,
        ProjectApplication.id != app1.id,
        ProjectApplication.status == "pending",
    ).update({"status": "rejected"})
    db.commit()

    db.refresh(app2)
    assert app2.status == "rejected"
    assert project.assigned_mentor_id == m1.id


def test_complete_project(db):
    admin = _make_admin(db)
    project = ConsultingProject(title="Done", created_by=admin.id, status="in_progress")
    db.add(project)
    db.commit()

    project.status = "completed"
    db.commit()
    db.refresh(project)
    assert project.status == "completed"
