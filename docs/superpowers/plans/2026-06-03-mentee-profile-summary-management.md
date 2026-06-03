# Mentee Profile Summary & Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full-stack persistence for mentee profile data (timelines, credentials, privacy), a Summary section with editable bio + AI Signature Tags, and profile management (edit/update).

**Architecture:** Extend the demo backend (SQLite + SQLAlchemy) with new columns on `users` and two new tables (`timeline_entries`, `credentials`). Add CRUD routers. Frontend replaces localStorage with API calls and adds a Summary section that computes AI Signature Tags from existing DISC/Career APIs.

**Tech Stack:** Python/FastAPI/SQLAlchemy (backend), React/TypeScript (frontend), existing DISC API (Signature Tags data source)

---

## File Structure

### Backend — Create
| File | Responsibility |
|------|---------------|
| `server/models/timeline_entry.py` | TimelineEntry SQLAlchemy model |
| `server/models/credential.py` | Credential SQLAlchemy model |
| `server/schemas/timeline.py` | Pydantic schemas for timeline CRUD |
| `server/schemas/credential.py` | Pydantic schemas for credential CRUD |
| `server/routers/timeline.py` | Timeline CRUD endpoints under `/api/profile/timeline` |
| `server/routers/credentials.py` | Credential CRUD endpoints under `/api/profile/credentials` |
| `server/tests/test_timeline.py` | Timeline endpoint tests |
| `server/tests/test_credentials.py` | Credential endpoint tests |

### Backend — Modify
| File | Change |
|------|--------|
| `server/models/user.py` | Add 10 new columns (summary, visibility, etc.) |
| `server/schemas/user.py` | Extend ProfileUpdateRequest + UserResponse with new fields |
| `server/main.py` | Import new models, register new routers |
| `server/tests/conftest.py` | Import new models so tables are created in test DB |
| `server/seed.py` | Add sample timeline/credential data for chen.mentee |

### Frontend — Modify
| File | Change |
|------|--------|
| `src/lib/api.ts` | Add timelineAPI, credentialAPI, extend UserProfile type |
| `src/app/pages/MenteeProfileSetup.tsx` | Replace localStorage with API calls, add Summary section |
| `src/app/pages/Profile.tsx` | Wire Edit button, show summary + Signature Tags |

---

## Task 1: Extend User Model & Schema

**Files:**
- Modify: `server/models/user.py`
- Modify: `server/schemas/user.py`

- [ ] **Step 1: Add new columns to User model**

In `server/models/user.py`, add after the `specializations` line (line 41):

```python
    # Profile summary
    summary = Column(Text, nullable=True)
    functional_expertise = Column(JSON, nullable=True)
    markets_of_interest = Column(JSON, nullable=True)
    career_direction = Column(Text, nullable=True)
    preferred_mentor_geography = Column(String(100), nullable=True)

    # Privacy / visibility
    global_visibility = Column(String(20), default="public")
    show_current_company = Column(Boolean, default=True)
    show_full_timeline = Column(Boolean, default=True)
    allow_enterprise_view = Column(Boolean, default=False)
    allow_mentor_discovery = Column(Boolean, default=True)
```

- [ ] **Step 2: Extend UserResponse schema**

In `server/schemas/user.py`, add these fields to the `UserResponse` class after `specializations`:

```python
    summary: Optional[str] = None
    functional_expertise: Optional[list[str]] = None
    markets_of_interest: Optional[list[str]] = None
    career_direction: Optional[str] = None
    preferred_mentor_geography: Optional[str] = None
    global_visibility: str = "public"
    show_current_company: bool = True
    show_full_timeline: bool = True
    allow_enterprise_view: bool = False
    allow_mentor_discovery: bool = True
```

- [ ] **Step 3: Extend ProfileUpdateRequest schema**

Replace the `ProfileUpdateRequest` class in `server/schemas/user.py` with:

```python
class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    summary: Optional[str] = None
    avatar_url: Optional[str] = None
    hourly_rate: Optional[float] = None
    status: Optional[str] = None
    degree_level: Optional[str] = None
    field_of_study: Optional[str] = None
    years_experience: Optional[str] = None
    current_country: Optional[str] = None
    interested_countries: Optional[list[str]] = None
    industry: Optional[str] = None
    sector: Optional[str] = None
    sub_sector: Optional[str] = None
    interested_industries: Optional[list[str]] = None
    specializations: Optional[list[str]] = None
    keep_name_private: Optional[bool] = None
    functional_expertise: Optional[list[str]] = None
    markets_of_interest: Optional[list[str]] = None
    career_direction: Optional[str] = None
    preferred_mentor_geography: Optional[str] = None
    global_visibility: Optional[str] = None
    show_current_company: Optional[bool] = None
    show_full_timeline: Optional[bool] = None
    allow_enterprise_view: Optional[bool] = None
    allow_mentor_discovery: Optional[bool] = None
```

- [ ] **Step 4: Verify the server starts**

Run: `cd server && source venv/bin/activate && python -c "from models.user import User; print('OK')"`
Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add server/models/user.py server/schemas/user.py
git commit -m "feat: extend User model with summary, visibility, and profile fields"
```

---

## Task 2: TimelineEntry Model & Schema

**Files:**
- Create: `server/models/timeline_entry.py`
- Create: `server/schemas/timeline.py`

- [ ] **Step 1: Create TimelineEntry model**

Create `server/models/timeline_entry.py`:

```python
from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Boolean, Text, DateTime, ForeignKey
)
from database import Base


class TimelineEntry(Base):
    __tablename__ = "timeline_entries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    type = Column(String(20), nullable=False)  # education / career / business
    title = Column(String(255), nullable=False)
    organization = Column(String(255), nullable=True)
    hide_organization = Column(Boolean, default=False)
    start_date = Column(String(20), nullable=True)
    end_date = Column(String(20), nullable=True)
    is_current = Column(Boolean, default=False)
    location = Column(String(255), nullable=True)
    industry_l1 = Column(String(100), nullable=True)
    industry_l2 = Column(String(100), nullable=True)
    industry_l3 = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    degree_level = Column(String(50), nullable=True)
    field_of_study = Column(String(100), nullable=True)
    visibility = Column(String(20), default="public")
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

- [ ] **Step 2: Create timeline Pydantic schemas**

Create `server/schemas/timeline.py`:

```python
from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class TimelineEntryCreate(BaseModel):
    type: str  # education / career / business
    title: str
    organization: Optional[str] = None
    hide_organization: bool = False
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool = False
    location: Optional[str] = None
    industry_l1: Optional[str] = None
    industry_l2: Optional[str] = None
    industry_l3: Optional[str] = None
    description: Optional[str] = None
    degree_level: Optional[str] = None
    field_of_study: Optional[str] = None
    visibility: str = "public"
    sort_order: int = 0


class TimelineEntryUpdate(BaseModel):
    type: Optional[str] = None
    title: Optional[str] = None
    organization: Optional[str] = None
    hide_organization: Optional[bool] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: Optional[bool] = None
    location: Optional[str] = None
    industry_l1: Optional[str] = None
    industry_l2: Optional[str] = None
    industry_l3: Optional[str] = None
    description: Optional[str] = None
    degree_level: Optional[str] = None
    field_of_study: Optional[str] = None
    visibility: Optional[str] = None
    sort_order: Optional[int] = None


class TimelineEntryResponse(BaseModel):
    id: int
    user_id: int
    type: str
    title: str
    organization: Optional[str] = None
    hide_organization: bool = False
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool = False
    location: Optional[str] = None
    industry_l1: Optional[str] = None
    industry_l2: Optional[str] = None
    industry_l3: Optional[str] = None
    description: Optional[str] = None
    degree_level: Optional[str] = None
    field_of_study: Optional[str] = None
    visibility: str = "public"
    sort_order: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ReorderItem(BaseModel):
    id: int
    sort_order: int
```

- [ ] **Step 3: Verify import**

Run: `cd server && source venv/bin/activate && python -c "from models.timeline_entry import TimelineEntry; from schemas.timeline import TimelineEntryCreate; print('OK')"`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add server/models/timeline_entry.py server/schemas/timeline.py
git commit -m "feat: add TimelineEntry model and schemas"
```

---

## Task 3: Credential Model & Schema

**Files:**
- Create: `server/models/credential.py`
- Create: `server/schemas/credential.py`

- [ ] **Step 1: Create Credential model**

Create `server/models/credential.py`:

```python
from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Text, DateTime, ForeignKey
)
from database import Base


class Credential(Base):
    __tablename__ = "credentials"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    type = Column(String(20), nullable=False)  # certification / training / psychometric
    name = Column(String(255), nullable=False)
    issuer = Column(String(255), nullable=True)
    date_obtained = Column(String(20), nullable=True)
    expiry_date = Column(String(20), nullable=True)
    credential_id = Column(String(100), nullable=True)
    training_type = Column(String(50), nullable=True)
    duration = Column(String(50), nullable=True)
    test_type = Column(String(50), nullable=True)
    result_summary = Column(Text, nullable=True)
    visibility = Column(String(20), default="public")
    created_at = Column(DateTime, default=datetime.utcnow)
```

- [ ] **Step 2: Create credential Pydantic schemas**

Create `server/schemas/credential.py`:

```python
from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class CredentialCreate(BaseModel):
    type: str  # certification / training / psychometric
    name: str
    issuer: Optional[str] = None
    date_obtained: Optional[str] = None
    expiry_date: Optional[str] = None
    credential_id: Optional[str] = None
    training_type: Optional[str] = None
    duration: Optional[str] = None
    test_type: Optional[str] = None
    result_summary: Optional[str] = None
    visibility: str = "public"


class CredentialUpdate(BaseModel):
    type: Optional[str] = None
    name: Optional[str] = None
    issuer: Optional[str] = None
    date_obtained: Optional[str] = None
    expiry_date: Optional[str] = None
    credential_id: Optional[str] = None
    training_type: Optional[str] = None
    duration: Optional[str] = None
    test_type: Optional[str] = None
    result_summary: Optional[str] = None
    visibility: Optional[str] = None


class CredentialResponse(BaseModel):
    id: int
    user_id: int
    type: str
    name: str
    issuer: Optional[str] = None
    date_obtained: Optional[str] = None
    expiry_date: Optional[str] = None
    credential_id: Optional[str] = None
    training_type: Optional[str] = None
    duration: Optional[str] = None
    test_type: Optional[str] = None
    result_summary: Optional[str] = None
    visibility: str = "public"
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
```

- [ ] **Step 3: Verify import**

Run: `cd server && source venv/bin/activate && python -c "from models.credential import Credential; from schemas.credential import CredentialCreate; print('OK')"`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add server/models/credential.py server/schemas/credential.py
git commit -m "feat: add Credential model and schemas"
```

---

## Task 4: Timeline CRUD Router

**Files:**
- Create: `server/routers/timeline.py`

- [ ] **Step 1: Create timeline router**

Create `server/routers/timeline.py`:

```python
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.timeline_entry import TimelineEntry
from schemas.timeline import (
    TimelineEntryCreate,
    TimelineEntryUpdate,
    TimelineEntryResponse,
    ReorderItem,
)
from utils.deps import get_current_user

router = APIRouter(prefix="/api/profile/timeline", tags=["Timeline"])


@router.get("", response_model=list[TimelineEntryResponse])
def list_timeline(
    type: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(TimelineEntry).filter(TimelineEntry.user_id == current_user.id)
    if type:
        query = query.filter(TimelineEntry.type == type)
    return query.order_by(TimelineEntry.sort_order, TimelineEntry.id).all()


@router.post("", response_model=TimelineEntryResponse, status_code=201)
def create_timeline_entry(
    data: TimelineEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry = TimelineEntry(user_id=current_user.id, **data.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.put("/{entry_id}", response_model=TimelineEntryResponse)
def update_timeline_entry(
    entry_id: int,
    data: TimelineEntryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry = db.query(TimelineEntry).filter(
        TimelineEntry.id == entry_id,
        TimelineEntry.user_id == current_user.id,
    ).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(entry, key, value)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=204)
def delete_timeline_entry(
    entry_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry = db.query(TimelineEntry).filter(
        TimelineEntry.id == entry_id,
        TimelineEntry.user_id == current_user.id,
    ).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    db.delete(entry)
    db.commit()


@router.put("/reorder", response_model=list[TimelineEntryResponse])
def reorder_timeline(
    items: list[ReorderItem],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    for item in items:
        entry = db.query(TimelineEntry).filter(
            TimelineEntry.id == item.id,
            TimelineEntry.user_id == current_user.id,
        ).first()
        if entry:
            entry.sort_order = item.sort_order
    db.commit()
    return (
        db.query(TimelineEntry)
        .filter(TimelineEntry.user_id == current_user.id)
        .order_by(TimelineEntry.sort_order, TimelineEntry.id)
        .all()
    )
```

**Important:** The `/reorder` route must be registered BEFORE `/{entry_id}` routes to avoid FastAPI treating "reorder" as an entry_id. Move the `reorder` endpoint definition above the `/{entry_id}` PUT, or use a separate prefix. In the code above, FastAPI matches routes in order, so the `PUT /reorder` at the bottom will actually conflict. Fix: move the reorder endpoint above the `PUT /{entry_id}` endpoint in the file.

- [ ] **Step 2: Verify import**

Run: `cd server && source venv/bin/activate && python -c "from routers.timeline import router; print('OK')"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add server/routers/timeline.py
git commit -m "feat: add timeline CRUD router"
```

---

## Task 5: Credentials CRUD Router

**Files:**
- Create: `server/routers/credentials.py`

- [ ] **Step 1: Create credentials router**

Create `server/routers/credentials.py`:

```python
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.credential import Credential
from schemas.credential import (
    CredentialCreate,
    CredentialUpdate,
    CredentialResponse,
)
from utils.deps import get_current_user

router = APIRouter(prefix="/api/profile/credentials", tags=["Credentials"])


@router.get("", response_model=list[CredentialResponse])
def list_credentials(
    type: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Credential).filter(Credential.user_id == current_user.id)
    if type:
        query = query.filter(Credential.type == type)
    return query.order_by(Credential.id).all()


@router.post("", response_model=CredentialResponse, status_code=201)
def create_credential(
    data: CredentialCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cred = Credential(user_id=current_user.id, **data.model_dump())
    db.add(cred)
    db.commit()
    db.refresh(cred)
    return cred


@router.put("/{cred_id}", response_model=CredentialResponse)
def update_credential(
    cred_id: int,
    data: CredentialUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cred = db.query(Credential).filter(
        Credential.id == cred_id,
        Credential.user_id == current_user.id,
    ).first()
    if not cred:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Credential not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(cred, key, value)
    db.commit()
    db.refresh(cred)
    return cred


@router.delete("/{cred_id}", status_code=204)
def delete_credential(
    cred_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cred = db.query(Credential).filter(
        Credential.id == cred_id,
        Credential.user_id == current_user.id,
    ).first()
    if not cred:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Credential not found")
    db.delete(cred)
    db.commit()
```

- [ ] **Step 2: Verify import**

Run: `cd server && source venv/bin/activate && python -c "from routers.credentials import router; print('OK')"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add server/routers/credentials.py
git commit -m "feat: add credentials CRUD router"
```

---

## Task 6: Wire New Models & Routers into App

**Files:**
- Modify: `server/main.py`
- Modify: `server/tests/conftest.py`

- [ ] **Step 1: Update main.py imports and router registration**

In `server/main.py`, change line 5 from:

```python
from routers import auth, profile, mentorship, admin, messages, billing, conversations
```

to:

```python
from routers import auth, profile, mentorship, admin, messages, billing, conversations, timeline, credentials
```

Add model imports after the existing `import models.conversation` (line 8):

```python
import models.timeline_entry  # noqa: F401
import models.credential  # noqa: F401
```

Add router registrations after `app.include_router(billing.router)` (line 53):

```python
app.include_router(timeline.router)
app.include_router(credentials.router)
```

- [ ] **Step 2: Update test conftest.py**

In `server/tests/conftest.py`, add after `import models.billing` (line 28):

```python
import models.timeline_entry  # noqa: E402,F401
import models.credential  # noqa: E402,F401
```

- [ ] **Step 3: Verify server starts and tables exist**

Run: `cd server && source venv/bin/activate && python -c "from main import app; print('routes:', len(app.routes))"`
Expected: Prints route count without errors (should be higher than before).

- [ ] **Step 4: Commit**

```bash
git add server/main.py server/tests/conftest.py
git commit -m "chore: wire timeline and credentials into app startup and tests"
```

---

## Task 7: Backend Tests — Timeline & Credentials

**Files:**
- Create: `server/tests/test_timeline.py`
- Create: `server/tests/test_credentials.py`

- [ ] **Step 1: Create timeline tests**

Create `server/tests/test_timeline.py`:

```python
"""Tests for timeline_entries CRUD via the TimelineEntry model."""

from models.timeline_entry import TimelineEntry
from models.user import User
from utils.security import hash_password


def _make_user(db, email="test@example.com"):
    user = User(
        email=email,
        username=email.split("@")[0],
        full_name="Test User",
        hashed_password=hash_password("pass"),
        role="mentee",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def test_create_timeline_entry(db):
    user = _make_user(db)
    entry = TimelineEntry(
        user_id=user.id,
        type="career",
        title="Software Engineer",
        organization="Acme Corp",
        start_date="2020-01",
        is_current=True,
        visibility="public",
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    assert entry.id is not None
    assert entry.type == "career"
    assert entry.title == "Software Engineer"
    assert entry.user_id == user.id


def test_list_timeline_entries_by_type(db):
    user = _make_user(db)
    db.add(TimelineEntry(user_id=user.id, type="education", title="BSc CS"))
    db.add(TimelineEntry(user_id=user.id, type="career", title="Dev"))
    db.add(TimelineEntry(user_id=user.id, type="career", title="Senior Dev"))
    db.commit()

    careers = db.query(TimelineEntry).filter(
        TimelineEntry.user_id == user.id,
        TimelineEntry.type == "career",
    ).all()
    assert len(careers) == 2

    all_entries = db.query(TimelineEntry).filter(
        TimelineEntry.user_id == user.id,
    ).all()
    assert len(all_entries) == 3


def test_update_timeline_entry(db):
    user = _make_user(db)
    entry = TimelineEntry(user_id=user.id, type="career", title="Dev")
    db.add(entry)
    db.commit()

    entry.title = "Senior Dev"
    entry.organization = "BigCo"
    db.commit()
    db.refresh(entry)

    assert entry.title == "Senior Dev"
    assert entry.organization == "BigCo"


def test_delete_timeline_entry(db):
    user = _make_user(db)
    entry = TimelineEntry(user_id=user.id, type="education", title="MBA")
    db.add(entry)
    db.commit()
    entry_id = entry.id

    db.delete(entry)
    db.commit()

    assert db.query(TimelineEntry).filter(TimelineEntry.id == entry_id).first() is None


def test_sort_order(db):
    user = _make_user(db)
    db.add(TimelineEntry(user_id=user.id, type="career", title="First", sort_order=2))
    db.add(TimelineEntry(user_id=user.id, type="career", title="Second", sort_order=1))
    db.commit()

    entries = (
        db.query(TimelineEntry)
        .filter(TimelineEntry.user_id == user.id)
        .order_by(TimelineEntry.sort_order)
        .all()
    )
    assert entries[0].title == "Second"
    assert entries[1].title == "First"
```

- [ ] **Step 2: Create credential tests**

Create `server/tests/test_credentials.py`:

```python
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
```

- [ ] **Step 3: Run tests**

Run: `cd server && source venv/bin/activate && python -m pytest tests/test_timeline.py tests/test_credentials.py -v`
Expected: All tests PASS.

- [ ] **Step 4: Commit**

```bash
git add server/tests/test_timeline.py server/tests/test_credentials.py
git commit -m "test: add timeline and credential model tests"
```

---

## Task 8: Seed Sample Profile Data

**Files:**
- Modify: `server/seed.py`

- [ ] **Step 1: Add imports and sample data to seed.py**

In `server/seed.py`, add to the imports (after line 14):

```python
from models.timeline_entry import TimelineEntry
from models.credential import Credential
```

After the `db.add_all(sessions)` block (after line 326) and before `db.commit()`, add:

```python
        # ─── Sample Profile Data (Sarah Chen) ───────────────────────────

        mentee1.summary = "Computer Science graduate student passionate about AI/ML and SaaS product development. Seeking mentorship in product strategy and career transition to tech leadership."
        mentee1.functional_expertise = ["Software Development", "Machine Learning", "Product Strategy"]
        mentee1.markets_of_interest = ["United States", "Canada", "Singapore"]
        mentee1.career_direction = "Transition into product management at a top tech company"

        timeline_data = [
            TimelineEntry(
                user_id=mentee1.id, type="education", title="Master of Computer Science",
                organization="Stanford University", start_date="2024-09", is_current=True,
                location="Stanford, CA", degree_level="Master", field_of_study="Computer Science",
                visibility="public", sort_order=0,
            ),
            TimelineEntry(
                user_id=mentee1.id, type="education", title="Bachelor of Engineering",
                organization="Tsinghua University", start_date="2020-09", end_date="2024-06",
                location="Beijing, China", degree_level="Bachelor", field_of_study="Software Engineering",
                visibility="public", sort_order=1,
            ),
            TimelineEntry(
                user_id=mentee1.id, type="career", title="Software Engineering Intern",
                organization="Google", start_date="2023-06", end_date="2023-09",
                location="Mountain View, CA", industry_l1="Technology", industry_l2="Software",
                visibility="public", sort_order=0,
            ),
            TimelineEntry(
                user_id=mentee1.id, type="business", title="AI Study Assistant",
                organization="Personal Project", start_date="2024-01", is_current=True,
                description="Building an AI-powered study assistant using RAG and LLMs",
                industry_l1="Technology", visibility="public", sort_order=0,
            ),
        ]
        db.add_all(timeline_data)

        cred_data = [
            Credential(
                user_id=mentee1.id, type="certification", name="AWS Cloud Practitioner",
                issuer="Amazon Web Services", date_obtained="2023-12", visibility="public",
            ),
            Credential(
                user_id=mentee1.id, type="training", name="Machine Learning Specialization",
                issuer="Coursera / Stanford", training_type="Online Course",
                date_obtained="2023-08", duration="3 months", visibility="public",
            ),
        ]
        db.add_all(cred_data)
```

- [ ] **Step 2: Run seed and verify**

Run: `cd server && source venv/bin/activate && rm -f phxnorth.db && python seed.py`
Expected: Seed output shows success. No errors.

- [ ] **Step 3: Verify via quick API check**

Run: `cd server && source venv/bin/activate && python -c "
from database import SessionLocal
from models.timeline_entry import TimelineEntry
from models.credential import Credential
db = SessionLocal()
print('Timeline entries:', db.query(TimelineEntry).count())
print('Credentials:', db.query(Credential).count())
db.close()
"`
Expected: `Timeline entries: 4` and `Credentials: 2`

- [ ] **Step 4: Commit**

```bash
git add server/seed.py
git commit -m "feat: seed sample timeline and credential data for Sarah Chen"
```

---

## Task 9: Frontend API Client Extensions

**Files:**
- Modify: `src/lib/api.ts`

- [ ] **Step 1: Extend UserProfile interface**

In `src/lib/api.ts`, add the following fields to the `UserProfile` interface (after `specializations`, line 66):

```typescript
    summary?: string;
    functional_expertise?: string[];
    markets_of_interest?: string[];
    career_direction?: string;
    preferred_mentor_geography?: string;
    global_visibility?: string;
    show_current_company?: boolean;
    show_full_timeline?: boolean;
    allow_enterprise_view?: boolean;
    allow_mentor_discovery?: boolean;
```

- [ ] **Step 2: Add TimelineEntry and Credential types**

Add after the `profileAPI` object (after line 111):

```typescript
// ─── Timeline API ───────────────────────────────────────────────────

export interface TimelineEntry {
    id: number;
    user_id: number;
    type: "education" | "career" | "business";
    title: string;
    organization?: string;
    hide_organization: boolean;
    start_date?: string;
    end_date?: string;
    is_current: boolean;
    location?: string;
    industry_l1?: string;
    industry_l2?: string;
    industry_l3?: string;
    description?: string;
    degree_level?: string;
    field_of_study?: string;
    visibility: "public" | "private";
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

export const timelineAPI = {
    list: (type?: string) => {
        const qs = type ? `?type=${type}` : "";
        return fetchAPI<TimelineEntry[]>(`/profile/timeline${qs}`);
    },

    create: (data: Omit<TimelineEntry, "id" | "user_id" | "created_at" | "updated_at">) =>
        fetchAPI<TimelineEntry>("/profile/timeline", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    update: (id: number, data: Partial<Omit<TimelineEntry, "id" | "user_id" | "created_at" | "updated_at">>) =>
        fetchAPI<TimelineEntry>(`/profile/timeline/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    remove: (id: number) =>
        fetch(`${API_BASE}/profile/timeline/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("phxnorth_token")}`,
            },
        }).then((r) => { if (!r.ok) throw new Error("Delete failed"); }),

    reorder: (items: { id: number; sort_order: number }[]) =>
        fetchAPI<TimelineEntry[]>("/profile/timeline/reorder", {
            method: "PUT",
            body: JSON.stringify(items),
        }),
};

// ─── Credentials API ────────────────────────────────────────────────

export interface CredentialEntry {
    id: number;
    user_id: number;
    type: "certification" | "training" | "psychometric";
    name: string;
    issuer?: string;
    date_obtained?: string;
    expiry_date?: string;
    credential_id?: string;
    training_type?: string;
    duration?: string;
    test_type?: string;
    result_summary?: string;
    visibility: "public" | "private";
    created_at?: string;
}

export const credentialAPI = {
    list: (type?: string) => {
        const qs = type ? `?type=${type}` : "";
        return fetchAPI<CredentialEntry[]>(`/profile/credentials${qs}`);
    },

    create: (data: Omit<CredentialEntry, "id" | "user_id" | "created_at">) =>
        fetchAPI<CredentialEntry>("/profile/credentials", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    update: (id: number, data: Partial<Omit<CredentialEntry, "id" | "user_id" | "created_at">>) =>
        fetchAPI<CredentialEntry>(`/profile/credentials/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    remove: (id: number) =>
        fetch(`${API_BASE}/profile/credentials/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("phxnorth_token")}`,
            },
        }).then((r) => { if (!r.ok) throw new Error("Delete failed"); }),
};
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx vite build 2>&1 | tail -5`
Expected: Build succeeds (new types are only used internally, no consumers yet).

- [ ] **Step 4: Commit**

```bash
git add src/lib/api.ts
git commit -m "feat: add timelineAPI, credentialAPI and extend UserProfile type"
```

---

## Task 10: MenteeProfileSetup — Replace localStorage with API Calls

**Files:**
- Modify: `src/app/pages/MenteeProfileSetup.tsx`

This is the largest task. The key changes:

- [ ] **Step 1: Add API imports**

At the top of `MenteeProfileSetup.tsx`, add:

```typescript
import { profileAPI, timelineAPI, credentialAPI, type TimelineEntry as APITimelineEntry, type CredentialEntry } from '../../lib/api';
```

- [ ] **Step 2: Add data loading on mount**

Replace the existing `localStorage`-based state restoration with API-based loading. Add a `useEffect` that runs on mount:

```typescript
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  async function loadProfile() {
    try {
      const [profile, timeline, creds] = await Promise.allSettled([
        profileAPI.get(),
        timelineAPI.list(),
        credentialAPI.list(),
      ]);

      if (profile.status === 'fulfilled') {
        const p = profile.value;
        setFirstName(p.full_name?.split(' ')[0] ?? '');
        setLastName(p.full_name?.split(' ').slice(1).join(' ') ?? '');
        setCurrentTitle('');
        setCurrentOrganization('');
        setCountry(p.current_country ?? '');
        setIndustryL1(p.industry ?? '');
        setIndustryL2(p.sector ?? '');
        setYearsOfExperience(p.years_experience ?? '');
        setSummary(p.summary ?? '');
        setFunctionalExpertise(p.functional_expertise ?? []);
        setMarketsOfInterest(p.markets_of_interest ?? []);
        setCareerDirection(p.career_direction ?? '');
        setPreferredMentorGeography(p.preferred_mentor_geography ?? '');
        setGlobalVisibility(p.global_visibility ?? 'public');
        setShowCurrentCompany(p.show_current_company ?? true);
        setShowFullCareerTimeline(p.show_full_timeline ?? true);
        setAllowEnterpriseView(p.allow_enterprise_view ?? false);
        setAllowMentorDiscovery(p.allow_mentor_discovery ?? true);
      }

      if (timeline.status === 'fulfilled') {
        const entries = timeline.value.map((e) => ({
          id: String(e.id),
          type: e.type as 'education' | 'career' | 'business',
          startDate: e.start_date ?? '',
          endDate: e.end_date ?? '',
          isCurrent: e.is_current,
          title: e.title,
          organization: e.organization ?? '',
          hideOrganization: e.hide_organization,
          location: e.location ?? '',
          industryL1: e.industry_l1 ?? '',
          industryL2: e.industry_l2 ?? '',
          industryL3: e.industry_l3 ?? '',
          visibility: e.visibility as 'public' | 'private',
          _serverId: e.id,
        }));
        setTimelineEntries(entries);
      }

      if (creds.status === 'fulfilled') {
        const c = creds.value;
        setCertifications(c.filter(x => x.type === 'certification').map(x => ({ ...x, id: String(x.id), _serverId: x.id })));
        setTrainings(c.filter(x => x.type === 'training').map(x => ({ ...x, id: String(x.id), _serverId: x.id })));
        setPsychTests(c.filter(x => x.type === 'psychometric').map(x => ({ ...x, id: String(x.id), _serverId: x.id })));
      }
    } catch (err) {
      console.error('Failed to load profile data:', err);
    } finally {
      setIsLoading(false);
    }
  }
  loadProfile();
}, []);
```

- [ ] **Step 3: Replace Save Draft / localStorage with API save functions**

Create helper functions that save to the API:

```typescript
const saveProfileFields = async () => {
  await profileAPI.update({
    full_name: `${firstName} ${lastName}`.trim(),
    current_country: country || undefined,
    industry: industryL1 || undefined,
    sector: industryL2 || undefined,
    years_experience: yearsOfExperience || undefined,
    summary: summary || undefined,
    functional_expertise: functionalExpertise.length ? functionalExpertise : undefined,
    markets_of_interest: marketsOfInterest.length ? marketsOfInterest : undefined,
    career_direction: careerDirection || undefined,
    preferred_mentor_geography: preferredMentorGeography || undefined,
  });
};

const savePrivacySettings = async () => {
  await profileAPI.update({
    global_visibility: globalVisibility,
    show_current_company: showCurrentCompany,
    show_full_timeline: showFullCareerTimeline,
    allow_enterprise_view: allowEnterpriseView,
    allow_mentor_discovery: allowMentorDiscovery,
    keep_name_private: !showCurrentCompany,
  });
};

const saveTimelineEntry = async (entry: TimelineEntry) => {
  const payload = {
    type: entry.type,
    title: entry.title,
    organization: entry.organization,
    hide_organization: entry.hideOrganization,
    start_date: entry.startDate,
    end_date: entry.endDate || undefined,
    is_current: entry.isCurrent,
    location: entry.location,
    industry_l1: entry.industryL1,
    industry_l2: entry.industryL2,
    industry_l3: entry.industryL3,
    visibility: entry.visibility,
  };
  if ((entry as any)._serverId) {
    return timelineAPI.update((entry as any)._serverId, payload);
  }
  return timelineAPI.create({ ...payload, hide_organization: entry.hideOrganization, sort_order: 0 });
};

const deleteTimelineEntry = async (entry: TimelineEntry) => {
  if ((entry as any)._serverId) {
    await timelineAPI.remove((entry as any)._serverId);
  }
};
```

- [ ] **Step 4: Wire save functions to each section's Save button**

Replace every `localStorage.setItem('phxnorth_profile_draft', ...)` call and "Save Draft" button handler with calls to the appropriate save function above. Each section's Save button should call the relevant function (e.g., education/career Save → `saveTimelineEntry`, privacy Save → `savePrivacySettings`).

Remove the `localStorage.getItem('phxnorth_profile_draft')` restoration logic.

- [ ] **Step 5: Verify the page loads and saves**

Start the dev server, navigate to `/app/mentee/profile-setup`, confirm:
1. Existing profile data loads from API
2. Saving a section persists to the backend
3. Refreshing the page retains the data

- [ ] **Step 6: Commit**

```bash
git add src/app/pages/MenteeProfileSetup.tsx
git commit -m "feat: replace localStorage with API persistence in MenteeProfileSetup"
```

---

## Task 11: MenteeProfileSetup — Add Summary Section

**Files:**
- Modify: `src/app/pages/MenteeProfileSetup.tsx`

- [ ] **Step 1: Add Summary to sidebar sections array**

In the `sections` array definition, add after the `overview` entry:

```typescript
{ id: "summary", label: "Summary & Tags", weight: 0, status: sectionStatuses.summary ?? "not-started" },
```

- [ ] **Step 2: Add summary state and DISC data state**

```typescript
const [summary, setSummary] = useState('');
const [savingSummary, setSavingSummary] = useState(false);

// Signature Tags (computed from DISC + Career)
const [signatureTags, setSignatureTags] = useState<{
  strengths: { label: string; confidence: number }[];
  domainSignals: { label: string; confidence: number }[];
  decisionStyle: { label: string; confidence: number }[];
  collaborationStyle: { label: string; confidence: number }[];
} | null>(null);
```

- [ ] **Step 3: Load DISC + Career data for Signature Tags**

In the `loadProfile` function (from Task 10), add after the credential loading:

```typescript
// Load DISC + Career data for Signature Tags (independent — failure is OK)
try {
  const [disc, career, prefs] = await Promise.allSettled([
    discProfileAPI.get('me', '90d'),
    discCareerAPI.get('me'),
    discCareerAPI.preferences('me'),
  ]);

  const tags: typeof signatureTags = {
    strengths: [],
    domainSignals: [],
    decisionStyle: [],
    collaborationStyle: [],
  };

  if (disc.status === 'fulfilled') {
    const d = disc.value;
    // Strengths from DISC traits
    if (d.traits?.length) {
      tags.strengths = d.traits.slice(0, 4).map(t => ({ label: t, confidence: d.confidence * 100 }));
    }
    // Collaboration style from I + S scores
    const iScore = d.scores.I;
    const sScore = d.scores.S;
    if (iScore >= 60 && sScore >= 60) {
      tags.collaborationStyle = [{ label: 'Team Builder', confidence: d.confidence * 100 }];
    } else if (iScore >= 60) {
      tags.collaborationStyle = [{ label: 'Influencer & Communicator', confidence: d.confidence * 100 }];
    } else if (sScore >= 60) {
      tags.collaborationStyle = [{ label: 'Steady Collaborator', confidence: d.confidence * 100 }];
    } else {
      tags.collaborationStyle = [{ label: 'Independent Worker', confidence: d.confidence * 100 }];
    }
  }

  if (career.status === 'fulfilled') {
    const c = career.value;
    // Domain signals from job entries
    const industries = new Map<string, number>();
    const roles = new Map<string, number>();
    for (const job of c.job_entries ?? []) {
      if (job.company) industries.set(job.company, (industries.get(job.company) ?? 0) + 1);
      if (job.title) roles.set(job.title, (roles.get(job.title) ?? 0) + 1);
    }
    tags.domainSignals = [...roles.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([label]) => ({ label, confidence: 80 }));
  }

  if (prefs.status === 'fulfilled') {
    const p = prefs.value;
    const riskLabel = p.conservative_vs_aggressive_risk?.label ?? 'Balanced';
    const growthLabel = p.stability_vs_growth?.label ?? 'Balanced';
    tags.decisionStyle = [
      { label: riskLabel, confidence: 75 },
      { label: growthLabel, confidence: 75 },
    ];
  }

  setSignatureTags(tags);
} catch {
  // Signature Tags are optional
}
```

Add the DISC API import at the top:

```typescript
import { discProfileAPI, discCareerAPI } from '../../lib/disc-api';
```

- [ ] **Step 4: Render Summary section**

Add the `activeSection === "summary"` rendering block:

```tsx
{activeSection === "summary" && (
  <div className="space-y-8">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Summary & Signature Tags</h2>
      <p className="text-gray-500">Your personal bio and AI-generated profile tags</p>
    </div>

    {/* Editable Bio */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Summary</h3>
      <textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Write a brief summary about yourself, your goals, and what you're looking for in mentorship..."
        rows={5}
        maxLength={1000}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0A2463] focus:outline-none resize-none"
      />
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-400">{summary.length}/1000 characters</span>
        <button
          onClick={async () => {
            setSavingSummary(true);
            try {
              await profileAPI.update({ summary });
            } catch (err) {
              console.error('Failed to save summary:', err);
            } finally {
              setSavingSummary(false);
            }
          }}
          disabled={savingSummary}
          className="px-6 py-2 bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 transition-colors text-sm font-semibold disabled:opacity-50"
        >
          {savingSummary ? 'Saving...' : 'Save Summary'}
        </button>
      </div>
    </div>

    {/* AI Signature Tags */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-[#0A2463]" />
        <h3 className="text-lg font-semibold text-gray-900">AI Signature Tags</h3>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Auto-generated</span>
      </div>

      {signatureTags ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          {signatureTags.strengths.length > 0 && (
            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-emerald-800 mb-2">Strengths</h4>
              <div className="flex flex-wrap gap-2">
                {signatureTags.strengths.map((tag) => (
                  <span key={tag.label} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    {tag.label} <span className="text-emerald-500">{Math.round(tag.confidence)}%</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Domain Signals */}
          {signatureTags.domainSignals.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Domain Signals</h4>
              <div className="flex flex-wrap gap-2">
                {signatureTags.domainSignals.map((tag) => (
                  <span key={tag.label} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Decision Style */}
          {signatureTags.decisionStyle.length > 0 && (
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-purple-800 mb-2">Decision & Risk Style</h4>
              <div className="flex flex-wrap gap-2">
                {signatureTags.decisionStyle.map((tag) => (
                  <span key={tag.label} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Collaboration Style */}
          {signatureTags.collaborationStyle.length > 0 && (
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-orange-800 mb-2">Collaboration Style</h4>
              <div className="flex flex-wrap gap-2">
                {signatureTags.collaborationStyle.map((tag) => (
                  <span key={tag.label} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-medium">No Signature Tags yet</p>
          <p className="text-sm mt-1">Upload your CV or complete the 5D Analysis to generate AI-powered profile tags.</p>
          <a href="/app/cv-upload" className="inline-block mt-3 text-[#0A2463] text-sm font-semibold hover:underline">Upload CV →</a>
        </div>
      )}
    </div>
  </div>
)}
```

Note: `Sparkles` must be imported from `lucide-react` — check existing imports and add if not present.

- [ ] **Step 5: Verify the Summary section renders**

Start the dev server, navigate to `/app/mentee/profile-setup`, click "Summary & Tags" in sidebar. Confirm:
1. Bio textarea appears with character count
2. Save Summary button calls API
3. If no DISC data, shows fallback CTA

- [ ] **Step 6: Commit**

```bash
git add src/app/pages/MenteeProfileSetup.tsx
git commit -m "feat: add Summary section with editable bio and AI Signature Tags"
```

---

## Task 12: Profile Page — Wire Edit Button & Show Summary

**Files:**
- Modify: `src/app/pages/Profile.tsx`

- [ ] **Step 1: Add navigate import and wire Edit button**

Add `useNavigate` import from `react-router` (if not present). Wire the Edit button:

```tsx
const navigate = useNavigate();
```

Find the "Edit Profile" button and add the click handler:

```tsx
onClick={() => navigate('/app/mentee/profile-setup')}
```

- [ ] **Step 2: Load and display summary**

In the Profile component, the user data already comes from `authAPI.getMe()` via auth context. Since we extended `UserProfile`, the `summary` field is now available. Add a summary section in the profile view:

```tsx
{/* Summary */}
{user?.summary && (
  <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
    <p className="text-gray-600 whitespace-pre-line">{user.summary}</p>
  </div>
)}
```

Place this after the avatar/name header section and before the Professional Background section.

- [ ] **Step 3: Verify**

Navigate to `/app/profile`, confirm:
1. Edit Profile button navigates to `/app/mentee/profile-setup`
2. If summary exists, it's displayed

- [ ] **Step 4: Commit**

```bash
git add src/app/pages/Profile.tsx
git commit -m "feat: wire Edit Profile button and display summary on Profile page"
```

---

## Task 13: Final Verification

- [ ] **Step 1: Run all backend tests**

Run: `cd server && source venv/bin/activate && python -m pytest tests/ -v`
Expected: All tests pass (including existing billing, conversations, mentor_matcher tests).

- [ ] **Step 2: Run frontend build**

Run: `npx vite build 2>&1 | tail -5`
Expected: Build succeeds with no errors.

- [ ] **Step 3: End-to-end manual test**

1. Start dev server: `./start-dev.sh`
2. Login as `chen.mentee@phxnorth.com` / `mentee123`
3. Navigate to `/app/mentee/profile-setup`
4. Verify seeded data loads (education, career, credentials)
5. Click "Summary & Tags" — write a bio, save it
6. Edit a career entry, save it
7. Navigate to `/app/profile` — verify summary shows, Edit button works
8. Refresh the page — verify data persists

- [ ] **Step 4: Final commit if needed**

```bash
git add -A
git commit -m "chore: final adjustments for mentee profile management"
```
