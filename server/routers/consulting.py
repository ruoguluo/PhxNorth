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
