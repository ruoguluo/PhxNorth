# Enterprise Consulting & Workshops Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build full-stack consulting projects (admin creates, mentors bid, admin selects) and mentor-created workshops (mentors create, mentees register), wiring the Mentor Dashboard to real data.

**Architecture:** New SQLAlchemy models + FastAPI routers in the demo backend (`server/`). Frontend adds API clients and wires existing dashboard cards + workshop page to real data. New MentorConsulting page for project browsing and applications.

**Tech Stack:** Python/FastAPI/SQLAlchemy (backend), React/TypeScript (frontend)

---

## File Structure

### Backend — Create
| File | Responsibility |
|------|---------------|
| `server/models/consulting_project.py` | ConsultingProject + ProjectApplication models |
| `server/models/workshop.py` | Workshop + WorkshopRegistration models |
| `server/schemas/consulting.py` | Pydantic schemas for consulting CRUD |
| `server/schemas/workshop.py` | Pydantic schemas for workshop CRUD |
| `server/routers/consulting.py` | Consulting project + application endpoints |
| `server/routers/workshops.py` | Workshop + registration endpoints |
| `server/tests/test_consulting.py` | Consulting model tests |
| `server/tests/test_workshops.py` | Workshop model tests |

### Backend — Modify
| File | Change |
|------|--------|
| `server/main.py` | Import new models, register new routers |
| `server/tests/conftest.py` | Import new models |
| `server/seed.py` | Add sample consulting projects + workshops |

### Frontend — Create
| File | Responsibility |
|------|---------------|
| `src/app/pages/MentorConsulting.tsx` | Consulting projects browse + applications page |

### Frontend — Modify
| File | Change |
|------|--------|
| `src/lib/api.ts` | Add consultingAPI, workshopAPI, types |
| `src/app/pages/MentorDashboard.tsx` | Wire cards to real data |
| `src/app/pages/MentorWorkshops.tsx` | Replace mock data with API |
| `src/app/routes.tsx` | Add consulting route |

---

## Task 1: ConsultingProject + ProjectApplication Models

**Files:**
- Create: `server/models/consulting_project.py`

- [ ] **Step 1: Create models file**

Create `server/models/consulting_project.py`:

```python
from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Float, Text, DateTime, JSON, ForeignKey
)
from database import Base


class ConsultingProject(Base):
    __tablename__ = "consulting_projects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    client_name = Column(String(255), nullable=True)
    budget_min = Column(Float, nullable=True)
    budget_max = Column(Float, nullable=True)
    duration_weeks = Column(Integer, nullable=True)
    required_skills = Column(JSON, nullable=True)
    industry = Column(String(100), nullable=True)
    status = Column(String(20), nullable=False, default="open")
    assigned_mentor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ProjectApplication(Base):
    __tablename__ = "project_applications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("consulting_projects.id"), nullable=False, index=True)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    proposal = Column(Text, nullable=True)
    proposed_rate = Column(Float, nullable=True)
    status = Column(String(20), nullable=False, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
```

- [ ] **Step 2: Verify import**

Run: `cd server && source venv/bin/activate && python -c "from models.consulting_project import ConsultingProject, ProjectApplication; print('OK')"`

- [ ] **Step 3: Commit**

```bash
git add server/models/consulting_project.py
git commit -m "feat: add ConsultingProject and ProjectApplication models"
```

---

## Task 2: Consulting Schemas

**Files:**
- Create: `server/schemas/consulting.py`

- [ ] **Step 1: Create schemas file**

Create `server/schemas/consulting.py`:

```python
from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class ConsultingProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    client_name: Optional[str] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    duration_weeks: Optional[int] = None
    required_skills: Optional[list[str]] = None
    industry: Optional[str] = None


class ConsultingProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    client_name: Optional[str] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    duration_weeks: Optional[int] = None
    required_skills: Optional[list[str]] = None
    industry: Optional[str] = None
    status: Optional[str] = None


class ConsultingProjectResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    client_name: Optional[str] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    duration_weeks: Optional[int] = None
    required_skills: Optional[list[str]] = None
    industry: Optional[str] = None
    status: str = "open"
    assigned_mentor_id: Optional[int] = None
    created_by: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ApplicationCreate(BaseModel):
    proposal: Optional[str] = None
    proposed_rate: Optional[float] = None


class ApplicationResponse(BaseModel):
    id: int
    project_id: int
    mentor_id: int
    proposal: Optional[str] = None
    proposed_rate: Optional[float] = None
    status: str = "pending"
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ApplicationAction(BaseModel):
    action: str  # "approve" or "reject"


class ProjectWithApplications(ConsultingProjectResponse):
    applications: list[ApplicationResponse] = []
```

- [ ] **Step 2: Verify import**

Run: `cd server && source venv/bin/activate && python -c "from schemas.consulting import ConsultingProjectCreate, ApplicationCreate; print('OK')"`

- [ ] **Step 3: Commit**

```bash
git add server/schemas/consulting.py
git commit -m "feat: add consulting Pydantic schemas"
```

---

## Task 3: Workshop + WorkshopRegistration Models

**Files:**
- Create: `server/models/workshop.py`

- [ ] **Step 1: Create models file**

Create `server/models/workshop.py`:

```python
from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Float, Text, DateTime, JSON, ForeignKey
)
from database import Base


class Workshop(Base):
    __tablename__ = "workshops"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    scheduled_at = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    max_participants = Column(Integer, nullable=True)
    price = Column(Float, nullable=True)
    status = Column(String(20), nullable=False, default="draft")
    tags = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class WorkshopRegistration(Base):
    __tablename__ = "workshop_registrations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    workshop_id = Column(Integer, ForeignKey("workshops.id"), nullable=False, index=True)
    mentee_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    status = Column(String(20), nullable=False, default="registered")
    created_at = Column(DateTime, default=datetime.utcnow)
```

- [ ] **Step 2: Verify import**

Run: `cd server && source venv/bin/activate && python -c "from models.workshop import Workshop, WorkshopRegistration; print('OK')"`

- [ ] **Step 3: Commit**

```bash
git add server/models/workshop.py
git commit -m "feat: add Workshop and WorkshopRegistration models"
```

---

## Task 4: Workshop Schemas

**Files:**
- Create: `server/schemas/workshop.py`

- [ ] **Step 1: Create schemas file**

Create `server/schemas/workshop.py`:

```python
from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class WorkshopCreate(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    max_participants: Optional[int] = None
    price: Optional[float] = None
    tags: Optional[list[str]] = None


class WorkshopUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    max_participants: Optional[int] = None
    price: Optional[float] = None
    status: Optional[str] = None
    tags: Optional[list[str]] = None


class RegistrationResponse(BaseModel):
    id: int
    workshop_id: int
    mentee_id: int
    status: str = "registered"
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class WorkshopResponse(BaseModel):
    id: int
    mentor_id: int
    title: str
    description: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    max_participants: Optional[int] = None
    price: Optional[float] = None
    status: str = "draft"
    tags: Optional[list[str]] = None
    registered_count: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class WorkshopWithRegistrations(WorkshopResponse):
    registrations: list[RegistrationResponse] = []
```

- [ ] **Step 2: Verify import**

Run: `cd server && source venv/bin/activate && python -c "from schemas.workshop import WorkshopCreate, WorkshopResponse; print('OK')"`

- [ ] **Step 3: Commit**

```bash
git add server/schemas/workshop.py
git commit -m "feat: add workshop Pydantic schemas"
```

---

## Task 5: Consulting Router

**Files:**
- Create: `server/routers/consulting.py`

- [ ] **Step 1: Create consulting router**

Create `server/routers/consulting.py`:

```python
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.consulting_project import ConsultingProject, ProjectApplication
from schemas.consulting import (
    ConsultingProjectCreate,
    ConsultingProjectUpdate,
    ConsultingProjectResponse,
    ApplicationCreate,
    ApplicationResponse,
    ApplicationAction,
    ProjectWithApplications,
)
from utils.deps import get_current_user, require_admin

router = APIRouter(prefix="/api/consulting", tags=["Consulting"])


@router.get("/projects", response_model=list[ConsultingProjectResponse])
def list_projects(
    status_filter: Optional[str] = Query(None, alias="status"),
    industry: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(ConsultingProject)
    if current_user.role != "admin":
        query = query.filter(ConsultingProject.status == "open")
    if status_filter:
        query = query.filter(ConsultingProject.status == status_filter)
    if industry:
        query = query.filter(ConsultingProject.industry == industry)
    return query.order_by(ConsultingProject.created_at.desc()).all()


@router.post("/projects", response_model=ConsultingProjectResponse, status_code=201)
def create_project(
    data: ConsultingProjectCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    project = ConsultingProject(created_by=current_user.id, **data.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("/projects/{project_id}")
def get_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = db.query(ConsultingProject).filter(ConsultingProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    resp = ProjectWithApplications.model_validate(project)
    if current_user.role == "admin":
        apps = db.query(ProjectApplication).filter(
            ProjectApplication.project_id == project_id
        ).order_by(ProjectApplication.created_at.desc()).all()
        resp.applications = [ApplicationResponse.model_validate(a) for a in apps]
    elif current_user.role == "mentor":
        my_app = db.query(ProjectApplication).filter(
            ProjectApplication.project_id == project_id,
            ProjectApplication.mentor_id == current_user.id,
        ).first()
        if my_app:
            resp.applications = [ApplicationResponse.model_validate(my_app)]
    return resp


@router.put("/projects/{project_id}", response_model=ConsultingProjectResponse)
def update_project(
    project_id: int,
    data: ConsultingProjectUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    project = db.query(ConsultingProject).filter(ConsultingProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(project, key, value)
    db.commit()
    db.refresh(project)
    return project


@router.post("/projects/{project_id}/apply", response_model=ApplicationResponse, status_code=201)
def apply_to_project(
    project_id: int,
    data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "mentor":
        raise HTTPException(status_code=403, detail="Only mentors can apply")
    project = db.query(ConsultingProject).filter(ConsultingProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.status != "open":
        raise HTTPException(status_code=400, detail="Project is not open for applications")
    existing = db.query(ProjectApplication).filter(
        ProjectApplication.project_id == project_id,
        ProjectApplication.mentor_id == current_user.id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this project")
    app = ProjectApplication(
        project_id=project_id,
        mentor_id=current_user.id,
        **data.model_dump(),
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return app


@router.put("/projects/{project_id}/applications/{app_id}", response_model=ApplicationResponse)
def handle_application(
    project_id: int,
    app_id: int,
    data: ApplicationAction,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    app = db.query(ProjectApplication).filter(
        ProjectApplication.id == app_id,
        ProjectApplication.project_id == project_id,
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if data.action == "approve":
        app.status = "approved"
        project = db.query(ConsultingProject).filter(ConsultingProject.id == project_id).first()
        project.status = "in_progress"
        project.assigned_mentor_id = app.mentor_id
        # Reject other pending applications
        db.query(ProjectApplication).filter(
            ProjectApplication.project_id == project_id,
            ProjectApplication.id != app_id,
            ProjectApplication.status == "pending",
        ).update({"status": "rejected"})
    elif data.action == "reject":
        app.status = "rejected"
    else:
        raise HTTPException(status_code=400, detail="Action must be 'approve' or 'reject'")

    db.commit()
    db.refresh(app)
    return app


@router.get("/my-applications", response_model=list[ApplicationResponse])
def list_my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "mentor":
        raise HTTPException(status_code=403, detail="Only mentors can view applications")
    return (
        db.query(ProjectApplication)
        .filter(ProjectApplication.mentor_id == current_user.id)
        .order_by(ProjectApplication.created_at.desc())
        .all()
    )


@router.put("/projects/{project_id}/complete", response_model=ConsultingProjectResponse)
def complete_project(
    project_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    project = db.query(ConsultingProject).filter(ConsultingProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.status != "in_progress":
        raise HTTPException(status_code=400, detail="Only in-progress projects can be completed")
    project.status = "completed"
    db.commit()
    db.refresh(project)
    return project
```

- [ ] **Step 2: Verify import**

Run: `cd server && source venv/bin/activate && python -c "from routers.consulting import router; print('OK')"`

- [ ] **Step 3: Commit**

```bash
git add server/routers/consulting.py
git commit -m "feat: add consulting projects router with applications workflow"
```

---

## Task 6: Workshops Router

**Files:**
- Create: `server/routers/workshops.py`

- [ ] **Step 1: Create workshops router**

Create `server/routers/workshops.py`:

```python
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models.user import User
from models.workshop import Workshop, WorkshopRegistration
from schemas.workshop import (
    WorkshopCreate,
    WorkshopUpdate,
    WorkshopResponse,
    WorkshopWithRegistrations,
    RegistrationResponse,
)
from utils.deps import get_current_user

router = APIRouter(prefix="/api/workshops", tags=["Workshops"])


def _workshop_to_response(workshop: Workshop, db: Session) -> dict:
    """Convert a Workshop ORM object to a dict with registered_count."""
    count = db.query(func.count(WorkshopRegistration.id)).filter(
        WorkshopRegistration.workshop_id == workshop.id,
        WorkshopRegistration.status == "registered",
    ).scalar()
    data = {c.name: getattr(workshop, c.name) for c in workshop.__table__.columns}
    data["registered_count"] = count or 0
    return data


@router.get("", response_model=list[WorkshopResponse])
def list_workshops(
    mine: Optional[bool] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Workshop)
    if mine or current_user.role == "mentor":
        query = query.filter(Workshop.mentor_id == current_user.id)
    elif current_user.role == "mentee":
        query = query.filter(Workshop.status == "published")
    # admin sees all
    if status_filter:
        query = query.filter(Workshop.status == status_filter)
    workshops = query.order_by(Workshop.created_at.desc()).all()
    return [_workshop_to_response(w, db) for w in workshops]


@router.post("", response_model=WorkshopResponse, status_code=201)
def create_workshop(
    data: WorkshopCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "mentor":
        raise HTTPException(status_code=403, detail="Only mentors can create workshops")
    workshop = Workshop(mentor_id=current_user.id, **data.model_dump())
    db.add(workshop)
    db.commit()
    db.refresh(workshop)
    return _workshop_to_response(workshop, db)


@router.get("/{workshop_id}")
def get_workshop(
    workshop_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")

    data = _workshop_to_response(workshop, db)
    resp = WorkshopWithRegistrations(**data)

    if current_user.id == workshop.mentor_id or current_user.role == "admin":
        regs = db.query(WorkshopRegistration).filter(
            WorkshopRegistration.workshop_id == workshop_id
        ).all()
        resp.registrations = [RegistrationResponse.model_validate(r) for r in regs]
    return resp


@router.put("/{workshop_id}", response_model=WorkshopResponse)
def update_workshop(
    workshop_id: int,
    data: WorkshopUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    if workshop.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your workshop")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(workshop, key, value)
    db.commit()
    db.refresh(workshop)
    return _workshop_to_response(workshop, db)


@router.delete("/{workshop_id}", status_code=204)
def delete_workshop(
    workshop_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    if workshop.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your workshop")
    if workshop.status != "draft":
        raise HTTPException(status_code=400, detail="Only draft workshops can be deleted")
    db.delete(workshop)
    db.commit()


@router.put("/{workshop_id}/publish", response_model=WorkshopResponse)
def publish_workshop(
    workshop_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    if workshop.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your workshop")
    if workshop.status != "draft":
        raise HTTPException(status_code=400, detail="Only draft workshops can be published")
    workshop.status = "published"
    db.commit()
    db.refresh(workshop)
    return _workshop_to_response(workshop, db)


@router.put("/{workshop_id}/complete", response_model=WorkshopResponse)
def complete_workshop(
    workshop_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    if workshop.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your workshop")
    if workshop.status not in ("published", "in_progress"):
        raise HTTPException(status_code=400, detail="Workshop cannot be completed in current status")
    workshop.status = "completed"
    db.commit()
    db.refresh(workshop)
    return _workshop_to_response(workshop, db)


@router.post("/{workshop_id}/register", response_model=RegistrationResponse, status_code=201)
def register_for_workshop(
    workshop_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "mentee":
        raise HTTPException(status_code=403, detail="Only mentees can register")
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    if workshop.status != "published":
        raise HTTPException(status_code=400, detail="Workshop is not open for registration")
    if workshop.max_participants:
        current_count = db.query(func.count(WorkshopRegistration.id)).filter(
            WorkshopRegistration.workshop_id == workshop_id,
            WorkshopRegistration.status == "registered",
        ).scalar()
        if current_count >= workshop.max_participants:
            raise HTTPException(status_code=400, detail="Workshop is full")
    existing = db.query(WorkshopRegistration).filter(
        WorkshopRegistration.workshop_id == workshop_id,
        WorkshopRegistration.mentee_id == current_user.id,
        WorkshopRegistration.status == "registered",
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already registered")
    reg = WorkshopRegistration(
        workshop_id=workshop_id,
        mentee_id=current_user.id,
    )
    db.add(reg)
    db.commit()
    db.refresh(reg)
    return reg


@router.delete("/{workshop_id}/register", status_code=204)
def cancel_registration(
    workshop_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    reg = db.query(WorkshopRegistration).filter(
        WorkshopRegistration.workshop_id == workshop_id,
        WorkshopRegistration.mentee_id == current_user.id,
        WorkshopRegistration.status == "registered",
    ).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    reg.status = "cancelled"
    db.commit()
```

- [ ] **Step 2: Verify import**

Run: `cd server && source venv/bin/activate && python -c "from routers.workshops import router; print('OK')"`

- [ ] **Step 3: Commit**

```bash
git add server/routers/workshops.py
git commit -m "feat: add workshops router with registration workflow"
```

---

## Task 7: Wire Models & Routers into App

**Files:**
- Modify: `server/main.py`
- Modify: `server/tests/conftest.py`

- [ ] **Step 1: Update main.py**

In `server/main.py`:

1. Add to the router import line (should currently include `timeline, credentials`):
```python
from routers import auth, profile, mentorship, admin, messages, billing, conversations, timeline, credentials, consulting, workshops
```

2. Add model imports after existing model imports:
```python
import models.consulting_project  # noqa: F401
import models.workshop  # noqa: F401
```

3. Add router registrations after the credentials router:
```python
app.include_router(consulting.router)
app.include_router(workshops.router)
```

- [ ] **Step 2: Update conftest.py**

In `server/tests/conftest.py`, add after the credential model import:
```python
import models.consulting_project  # noqa: E402,F401
import models.workshop  # noqa: E402,F401
```

- [ ] **Step 3: Verify**

Run: `cd server && source venv/bin/activate && python -c "from main import app; print('routes:', len(app.routes))"`

- [ ] **Step 4: Commit**

```bash
git add server/main.py server/tests/conftest.py
git commit -m "chore: wire consulting and workshops into app startup and tests"
```

---

## Task 8: Backend Tests

**Files:**
- Create: `server/tests/test_consulting.py`
- Create: `server/tests/test_workshops.py`

- [ ] **Step 1: Create consulting tests**

Create `server/tests/test_consulting.py`:

```python
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

    # Approve app1
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
```

- [ ] **Step 2: Create workshop tests**

Create `server/tests/test_workshops.py`:

```python
"""Tests for workshop and registration models."""

from datetime import datetime, timedelta
from models.workshop import Workshop, WorkshopRegistration
from models.user import User
from utils.security import hash_password


def _make_mentor(db, email="wmentor@test.com"):
    user = User(email=email, username=email.split("@")[0], full_name="Mentor",
                hashed_password=hash_password("pass"), role="mentor")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def _make_mentee(db, email="wmentee@test.com"):
    user = User(email=email, username=email.split("@")[0], full_name="Mentee",
                hashed_password=hash_password("pass"), role="mentee")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def test_create_workshop(db):
    mentor = _make_mentor(db)
    ws = Workshop(
        mentor_id=mentor.id, title="Intro to ML",
        description="Learn ML basics", duration_minutes=90,
        max_participants=20, price=50.0, tags=["ML", "Python"],
    )
    db.add(ws)
    db.commit()
    db.refresh(ws)
    assert ws.id is not None
    assert ws.status == "draft"
    assert ws.mentor_id == mentor.id


def test_publish_workshop(db):
    mentor = _make_mentor(db)
    ws = Workshop(mentor_id=mentor.id, title="Test WS")
    db.add(ws)
    db.commit()
    ws.status = "published"
    db.commit()
    db.refresh(ws)
    assert ws.status == "published"


def test_register_for_workshop(db):
    mentor = _make_mentor(db)
    mentee = _make_mentee(db)
    ws = Workshop(mentor_id=mentor.id, title="WS", status="published", max_participants=10)
    db.add(ws)
    db.commit()

    reg = WorkshopRegistration(workshop_id=ws.id, mentee_id=mentee.id)
    db.add(reg)
    db.commit()
    db.refresh(reg)
    assert reg.status == "registered"


def test_cancel_registration(db):
    mentor = _make_mentor(db)
    mentee = _make_mentee(db)
    ws = Workshop(mentor_id=mentor.id, title="WS", status="published")
    db.add(ws)
    db.commit()

    reg = WorkshopRegistration(workshop_id=ws.id, mentee_id=mentee.id)
    db.add(reg)
    db.commit()

    reg.status = "cancelled"
    db.commit()
    db.refresh(reg)
    assert reg.status == "cancelled"


def test_capacity_check(db):
    mentor = _make_mentor(db)
    ws = Workshop(mentor_id=mentor.id, title="Small WS", status="published", max_participants=2)
    db.add(ws)
    db.commit()

    m1 = _make_mentee(db, "m1@test.com")
    m2 = _make_mentee(db, "m2@test.com")
    db.add(WorkshopRegistration(workshop_id=ws.id, mentee_id=m1.id))
    db.add(WorkshopRegistration(workshop_id=ws.id, mentee_id=m2.id))
    db.commit()

    count = db.query(WorkshopRegistration).filter(
        WorkshopRegistration.workshop_id == ws.id,
        WorkshopRegistration.status == "registered",
    ).count()
    assert count == 2
    assert count >= ws.max_participants
```

- [ ] **Step 3: Run all tests**

Run: `cd server && source venv/bin/activate && python -m pytest tests/ -v`
Expected: ALL tests pass.

- [ ] **Step 4: Commit**

```bash
git add server/tests/test_consulting.py server/tests/test_workshops.py
git commit -m "test: add consulting and workshop model tests"
```

---

## Task 9: Seed Data

**Files:**
- Modify: `server/seed.py`

- [ ] **Step 1: Add imports to seed.py**

After existing model imports add:
```python
from models.consulting_project import ConsultingProject, ProjectApplication
from models.workshop import Workshop, WorkshopRegistration
```

- [ ] **Step 2: Add seed data before `db.commit()`**

Add before the final `db.commit()` in the seed function:

```python
        # ─── Consulting Projects ─────────────────────────────────────────

        cp1 = ConsultingProject(
            title="AI-Driven Customer Segmentation Strategy",
            description="Help our retail client implement ML-based customer segmentation to improve targeting and retention.",
            client_name="RetailCo International",
            budget_min=8000, budget_max=15000, duration_weeks=6,
            required_skills=["Machine Learning", "Customer Analytics", "Strategy"],
            industry="Consumer & Retail", status="open", created_by=admin.id,
        )
        cp2 = ConsultingProject(
            title="FinTech Regulatory Compliance Audit",
            description="Assess regulatory readiness for a Series B fintech startup expanding into Southeast Asia.",
            client_name="PayFlow Asia",
            budget_min=12000, budget_max=20000, duration_weeks=8,
            required_skills=["FinTech", "Regulatory", "Compliance", "APAC"],
            industry="Financial Services", status="open", created_by=admin.id,
        )
        cp3 = ConsultingProject(
            title="Digital Health Platform Architecture Review",
            description="Independent architecture review of a telemedicine platform before Series A fundraise.",
            client_name="MediConnect",
            budget_min=5000, budget_max=10000, duration_weeks=3,
            required_skills=["HealthTech", "System Design", "Cloud Architecture"],
            industry="Healthcare & Life Sciences", status="open", created_by=admin.id,
        )
        cp4 = ConsultingProject(
            title="Enterprise Data Governance Framework",
            description="Design a data governance framework for a Fortune 500 manufacturing company.",
            client_name="GlobalMfg Corp",
            budget_min=20000, budget_max=35000, duration_weeks=12,
            required_skills=["Data Governance", "Enterprise Architecture", "Manufacturing"],
            industry="Industrial & Manufacturing", status="in_progress",
            assigned_mentor_id=mentor1.id, created_by=admin.id,
        )
        db.add_all([cp1, cp2, cp3, cp4])
        db.flush()

        # Applications for the in-progress project
        app1 = ProjectApplication(
            project_id=cp4.id, mentor_id=mentor1.id,
            proposal="I have 15+ years of experience in enterprise data systems.",
            proposed_rate=250.0, status="approved",
        )
        app2 = ProjectApplication(
            project_id=cp4.id, mentor_id=mentor2.id,
            proposal="Extensive background in manufacturing IT governance.",
            proposed_rate=200.0, status="rejected",
        )
        # Pending application on an open project
        app3 = ProjectApplication(
            project_id=cp1.id, mentor_id=mentor1.id,
            proposal="ML is my core expertise, happy to lead this.",
            proposed_rate=180.0, status="pending",
        )
        db.add_all([app1, app2, app3])

        # ─── Workshops ──────────────────────────────────────────────────

        ws1 = Workshop(
            mentor_id=mentor1.id,
            title="Scaling E-commerce with Microservices",
            description="Hands-on workshop on decomposing monoliths into microservices for high-traffic e-commerce platforms.",
            scheduled_at=now + timedelta(days=7, hours=14),
            duration_minutes=120, max_participants=25, price=75.0,
            status="published", tags=["Microservices", "E-commerce", "Architecture"],
        )
        ws2 = Workshop(
            mentor_id=mentor1.id,
            title="AI Product Management Fundamentals",
            description="Learn how to manage AI/ML product development from ideation to production.",
            scheduled_at=now + timedelta(days=14, hours=10),
            duration_minutes=90, max_participants=30, price=50.0,
            status="draft", tags=["AI", "Product Management", "ML"],
        )
        ws3 = Workshop(
            mentor_id=mentor3.id,
            title="HIPAA Compliance for Startups",
            description="Everything you need to know about HIPAA compliance when building health-tech products.",
            scheduled_at=now + timedelta(days=10, hours=16),
            duration_minutes=60, max_participants=20, price=40.0,
            status="published", tags=["HIPAA", "HealthTech", "Compliance"],
        )
        db.add_all([ws1, ws2, ws3])
        db.flush()

        # Workshop registrations
        db.add_all([
            WorkshopRegistration(workshop_id=ws1.id, mentee_id=mentee1.id),
            WorkshopRegistration(workshop_id=ws1.id, mentee_id=mentee2.id),
            WorkshopRegistration(workshop_id=ws3.id, mentee_id=mentee3.id),
        ])
```

- [ ] **Step 3: Re-seed and verify**

Run: `cd server && source venv/bin/activate && rm -f phxnorth.db && python seed.py`

- [ ] **Step 4: Commit**

```bash
git add server/seed.py
git commit -m "feat: seed consulting projects, applications, workshops, and registrations"
```

---

## Task 10: Frontend API Client

**Files:**
- Modify: `src/lib/api.ts`

- [ ] **Step 1: Add consulting types and API**

Add after the `credentialAPI` object in `src/lib/api.ts`:

```typescript
// ─── Consulting API ─────────────────────────────────────────────────

export interface ConsultingProject {
    id: number;
    title: string;
    description?: string;
    client_name?: string;
    budget_min?: number;
    budget_max?: number;
    duration_weeks?: number;
    required_skills?: string[];
    industry?: string;
    status: string;
    assigned_mentor_id?: number;
    created_by: number;
    created_at?: string;
    updated_at?: string;
    applications?: ProjectApplication[];
}

export interface ProjectApplication {
    id: number;
    project_id: number;
    mentor_id: number;
    proposal?: string;
    proposed_rate?: number;
    status: string;
    created_at?: string;
}

export const consultingAPI = {
    listProjects: (params?: { status?: string; industry?: string }) => {
        const qs = new URLSearchParams();
        if (params?.status) qs.set("status", params.status);
        if (params?.industry) qs.set("industry", params.industry);
        const suffix = qs.toString() ? `?${qs}` : "";
        return fetchAPI<ConsultingProject[]>(`/consulting/projects${suffix}`);
    },

    getProject: (id: number) =>
        fetchAPI<ConsultingProject>(`/consulting/projects/${id}`),

    createProject: (data: Record<string, unknown>) =>
        fetchAPI<ConsultingProject>("/consulting/projects", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    apply: (projectId: number, data: { proposal?: string; proposed_rate?: number }) =>
        fetchAPI<ProjectApplication>(`/consulting/projects/${projectId}/apply`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    handleApplication: (projectId: number, appId: number, action: "approve" | "reject") =>
        fetchAPI<ProjectApplication>(`/consulting/projects/${projectId}/applications/${appId}`, {
            method: "PUT",
            body: JSON.stringify({ action }),
        }),

    myApplications: () =>
        fetchAPI<ProjectApplication[]>("/consulting/my-applications"),

    completeProject: (id: number) =>
        fetchAPI<ConsultingProject>(`/consulting/projects/${id}/complete`, { method: "PUT" }),
};

// ─── Workshop API ───────────────────────────────────────────────────

export interface WorkshopEntry {
    id: number;
    mentor_id: number;
    title: string;
    description?: string;
    scheduled_at?: string;
    duration_minutes?: number;
    max_participants?: number;
    price?: number;
    status: string;
    tags?: string[];
    registered_count: number;
    created_at?: string;
    updated_at?: string;
    registrations?: { id: number; workshop_id: number; mentee_id: number; status: string; created_at?: string }[];
}

export const workshopAPI = {
    list: (params?: { mine?: boolean; status?: string }) => {
        const qs = new URLSearchParams();
        if (params?.mine) qs.set("mine", "true");
        if (params?.status) qs.set("status", params.status);
        const suffix = qs.toString() ? `?${qs}` : "";
        return fetchAPI<WorkshopEntry[]>(`/workshops${suffix}`);
    },

    get: (id: number) => fetchAPI<WorkshopEntry>(`/workshops/${id}`),

    create: (data: Record<string, unknown>) =>
        fetchAPI<WorkshopEntry>("/workshops", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    update: (id: number, data: Record<string, unknown>) =>
        fetchAPI<WorkshopEntry>(`/workshops/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    remove: (id: number) =>
        fetch(`${API_BASE}/workshops/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("phxnorth_token")}` },
        }).then((r) => { if (!r.ok) throw new Error("Delete failed"); }),

    publish: (id: number) =>
        fetchAPI<WorkshopEntry>(`/workshops/${id}/publish`, { method: "PUT" }),

    complete: (id: number) =>
        fetchAPI<WorkshopEntry>(`/workshops/${id}/complete`, { method: "PUT" }),

    register: (id: number) =>
        fetchAPI<unknown>(`/workshops/${id}/register`, { method: "POST" }),

    cancelRegistration: (id: number) =>
        fetch(`${API_BASE}/workshops/${id}/register`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("phxnorth_token")}` },
        }).then((r) => { if (!r.ok) throw new Error("Cancel failed"); }),
};
```

- [ ] **Step 2: Verify build**

Run: `npx vite build 2>&1 | tail -3`

- [ ] **Step 3: Commit**

```bash
git add src/lib/api.ts
git commit -m "feat: add consultingAPI and workshopAPI to frontend"
```

---

## Task 11: Mentor Dashboard — Wire Real Data

**Files:**
- Modify: `src/app/pages/MentorDashboard.tsx`

- [ ] **Step 1: Add API imports**

Add to imports at top:
```typescript
import { consultingAPI, workshopAPI, type ConsultingProject, type WorkshopEntry } from '../../lib/api';
```
(Extend the existing import from `../../lib/api`.)

- [ ] **Step 2: Add state and data loading**

Add state variables:
```typescript
const [openProjects, setOpenProjects] = useState<ConsultingProject[]>([]);
const [myWorkshops, setMyWorkshops] = useState<WorkshopEntry[]>([]);
```

In the existing `useEffect` data loading block (or add a new one), add:
```typescript
consultingAPI.listProjects({ status: 'open' }).then(setOpenProjects).catch(() => {});
workshopAPI.list({ mine: true }).then(setMyWorkshops).catch(() => {});
```

- [ ] **Step 3: Replace Enterprise Consulting card**

Replace the hardcoded Enterprise Consulting card (lines ~245-264) with:

```tsx
{/* Enterprise Consulting */}
<div className="bg-white rounded-xl border-2 border-blue-300 p-5 hover:border-blue-400 hover:shadow-lg transition-all">
  <div className="flex items-start justify-between mb-3">
    <div className="p-2 bg-blue-100 rounded-lg">
      <Users className="w-6 h-6 text-blue-600" />
    </div>
    {openProjects.length > 0 && (
      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-medium animate-pulse">
        Opportunities Available
      </span>
    )}
  </div>
  <h3 className="font-bold text-gray-900 mb-2">Enterprise Consulting</h3>
  <p className="text-sm text-gray-600 mb-3">Lead advisory projects for organizations seeking expert guidance</p>
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
    <p className="text-xs text-blue-900 font-semibold mb-1">Project Matches</p>
    <p className="text-lg font-bold text-blue-700">
      {openProjects.length > 0 ? `${openProjects.length} project${openProjects.length > 1 ? 's' : ''} waiting` : 'No projects available'}
    </p>
  </div>
  <button
    onClick={() => navigate('/app/mentor/consulting')}
    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
  >
    View Projects
  </button>
</div>
```

- [ ] **Step 4: Replace Workshop Speaker card**

Replace the hardcoded Workshop Speaker card (lines ~266-285) with:

```tsx
{/* Workshop Speaker */}
<div className="bg-white rounded-xl border-2 border-purple-300 p-5 hover:border-purple-400 hover:shadow-lg transition-all">
  <div className="flex items-start justify-between mb-3">
    <div className="p-2 bg-purple-100 rounded-lg">
      <Award className="w-6 h-6 text-purple-600" />
    </div>
    {myWorkshops.filter(w => w.status === 'published').length > 0 && (
      <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full font-medium">
        {myWorkshops.filter(w => w.status === 'published').length} Published
      </span>
    )}
  </div>
  <h3 className="font-bold text-gray-900 mb-2">Workshop Speaker</h3>
  <p className="text-sm text-gray-600 mb-3">Lead group sessions and share expertise with multiple participants</p>
  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
    <p className="text-xs text-purple-900 font-semibold mb-1">Your Workshops</p>
    <p className="text-lg font-bold text-purple-700">
      {myWorkshops.length > 0 ? `${myWorkshops.length} workshop${myWorkshops.length > 1 ? 's' : ''}` : 'Create your first workshop'}
    </p>
  </div>
  <button
    onClick={() => navigate('/app/mentor/workshops')}
    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
  >
    Manage Workshops
  </button>
</div>
```

- [ ] **Step 5: Ensure `navigate` is available**

Check if `useNavigate` is already imported. If not, add:
```typescript
import { useNavigate } from 'react-router';
const navigate = useNavigate();
```

- [ ] **Step 6: Verify build**

Run: `npx vite build 2>&1 | tail -3`

- [ ] **Step 7: Commit**

```bash
git add src/app/pages/MentorDashboard.tsx
git commit -m "feat: wire Mentor Dashboard consulting and workshop cards to real API data"
```

---

## Task 12: MentorConsulting Page

**Files:**
- Create: `src/app/pages/MentorConsulting.tsx`
- Modify: `src/app/routes.tsx`

- [ ] **Step 1: Create MentorConsulting page**

Create `src/app/pages/MentorConsulting.tsx`. This page has two tabs: "Available Projects" and "My Applications". Read the existing `MentorDashboard.tsx` and `MentorWorkshops.tsx` files for styling patterns (Tailwind classes, card layouts, color schemes). Follow the same patterns.

The page should:
- Import `consultingAPI`, `ConsultingProject`, `ProjectApplication` from `../../lib/api`
- Have state for `projects`, `myApplications`, `activeTab`, `applyingTo` (project id being applied to), `proposal`, `proposedRate`
- On mount, load projects and applications via `Promise.allSettled`
- Available Projects tab: grid of project cards showing title, client, budget range, skills tags, duration, industry badge. Each card has an "Apply" button that expands a form with proposal textarea + rate input + submit
- My Applications tab: list of application cards with project title, proposed rate, status badge (pending=yellow, approved=green, rejected=red)

This is a complete page — implement it fully with proper loading states and error handling. The page should be about 200-300 lines.

- [ ] **Step 2: Add route**

In `src/app/routes.tsx`, add the import at the top:
```typescript
import { MentorConsulting } from "./pages/MentorConsulting";
```

Add the route inside the `mentor` children array (next to `workshops`):
```typescript
{
    path: "consulting",
    Component: MentorConsulting,
},
```

- [ ] **Step 3: Verify build**

Run: `npx vite build 2>&1 | tail -3`

- [ ] **Step 4: Commit**

```bash
git add src/app/pages/MentorConsulting.tsx src/app/routes.tsx
git commit -m "feat: add MentorConsulting page with project browsing and applications"
```

---

## Task 13: MentorWorkshops — Replace Mock Data

**Files:**
- Modify: `src/app/pages/MentorWorkshops.tsx`

- [ ] **Step 1: Read the existing file**

Read `src/app/pages/MentorWorkshops.tsx` completely to understand the current mock data structure and UI.

- [ ] **Step 2: Replace mock data with API**

Key changes:
- Remove the `mockWorkshops` constant
- Import `workshopAPI`, `WorkshopEntry` from `../../lib/api`
- Add state: `workshops`, `isLoading`
- On mount: `workshopAPI.list({ mine: true }).then(setWorkshops)`
- Map API response fields to the UI (adapt field names as needed: `scheduled_at` → date display, `registered_count` → attendee count, etc.)
- Wire "Create Workshop" form to `workshopAPI.create()`
- Wire edit to `workshopAPI.update()`
- Wire delete to `workshopAPI.remove()`
- Wire publish to `workshopAPI.publish()`
- Show loading skeleton while data loads

The existing page structure and styling should be preserved — only the data source changes.

- [ ] **Step 3: Verify build**

Run: `npx vite build 2>&1 | tail -3`

- [ ] **Step 4: Commit**

```bash
git add src/app/pages/MentorWorkshops.tsx
git commit -m "feat: wire MentorWorkshops to real API, replace mock data"
```

---

## Task 14: Final Verification

- [ ] **Step 1: Run all backend tests**

Run: `cd server && source venv/bin/activate && python -m pytest tests/ -v`
Expected: All tests pass.

- [ ] **Step 2: Run frontend build**

Run: `npx vite build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 3: Re-seed and start server**

```bash
cd server && rm -f phxnorth.db && python seed.py
```

- [ ] **Step 4: End-to-end manual test**

1. Login as `admin@phxnorth.com` / `admin123` — verify consulting projects were created
2. Login as `sarah.mentor@phxnorth.com` / `mentor123`
3. Navigate to `/app/mentor/dashboard` — verify consulting card shows "3 projects waiting" and workshop card shows real data
4. Click "View Projects" → `/app/mentor/consulting` — verify projects list loads
5. Apply to a project — verify application appears in "My Applications" tab
6. Navigate to `/app/mentor/workshops` — verify workshops load from API
7. Create a new workshop — verify it appears in the list
8. Publish the workshop — verify status changes

- [ ] **Step 5: Final commit if needed**

```bash
git add -A
git commit -m "chore: final adjustments for consulting and workshops"
```
