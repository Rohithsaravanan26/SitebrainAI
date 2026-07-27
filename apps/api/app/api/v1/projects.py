from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, RoleChecker
from app.models.auth import User, UserRole
from app.models.projects import Project, RFI, ProjectDocument, ProjectStatus, RfiStatus
from app.schemas.projects import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    RFICreate,
    RFIUpdate,
    RFIResponse,
    ProjectDocumentCreate,
    ProjectDocumentResponse,
)

router = APIRouter(prefix="/projects", tags=["Projects & RFIs"])
require_pm_or_admin = RoleChecker([UserRole.ADMIN, UserRole.PROJECT_MANAGER])

# --- PROJECTS ---
@router.get("", response_model=List[ProjectResponse])
def list_projects(
    status_filter: Optional[ProjectStatus] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Project)
    if status_filter:
        query = query.filter(Project.status == status_filter)
    if search:
        query = query.filter(
            (Project.name.ilike(f"%{search}%")) | (Project.code.ilike(f"%{search}%")) | (Project.location.ilike(f"%{search}%"))
        )

    projects = query.order_by(Project.created_at.desc()).all()
    results = []
    for p in projects:
        resp = ProjectResponse.model_validate(p)
        if p.project_manager:
            resp.project_manager_name = p.project_manager.full_name
        resp.open_rfi_count = db.query(RFI).filter(RFI.project_id == p.id, RFI.status == RfiStatus.OPEN).count()
        results.append(resp)
    return results

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_pm_or_admin),
):
    existing = db.query(Project).filter(Project.code == project_in.code.upper()).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Project code already exists")

    project = Project(
        **project_in.model_dump(exclude={"project_manager_id"}),
        code=project_in.code.upper(),
        project_manager_id=project_in.project_manager_id or current_user.id
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    resp = ProjectResponse.model_validate(project)
    if project.project_manager:
        resp.project_manager_name = project.project_manager.full_name
    return resp

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project_detail(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    resp = ProjectResponse.model_validate(project)
    if project.project_manager:
        resp.project_manager_name = project.project_manager.full_name
    resp.open_rfi_count = db.query(RFI).filter(RFI.project_id == project.id, RFI.status == RfiStatus.OPEN).count()
    return resp

@router.patch("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: str,
    project_in: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_pm_or_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    update_data = project_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(project, field, val)

    db.commit()
    db.refresh(project)

    resp = ProjectResponse.model_validate(project)
    if project.project_manager:
        resp.project_manager_name = project.project_manager.full_name
    return resp

# --- RFIS ---
@router.get("/{project_id}/rfis", response_model=List[RFIResponse])
def list_project_rfis(
    project_id: str,
    status_filter: Optional[RfiStatus] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    query = db.query(RFI).filter(RFI.project_id == project_id)
    if status_filter:
        query = query.filter(RFI.status == status_filter)

    rfis = query.order_by(RFI.created_at.desc()).all()
    results = []
    for r in rfis:
        resp = RFIResponse.model_validate(r)
        if r.author:
            resp.author_name = r.author.full_name
        if r.assigned_to:
            resp.assigned_to_name = r.assigned_to.full_name
        results.append(resp)
    return results

@router.post("/{project_id}/rfis", response_model=RFIResponse, status_code=status.HTTP_201_CREATED)
def create_rfi(
    project_id: str,
    rfi_in: RFICreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    count = db.query(RFI).filter(RFI.project_id == project_id).count() + 1
    rfi_num = f"RFI-{project.code}-{count:03d}"

    rfi = RFI(
        **rfi_in.model_dump(),
        project_id=project_id,
        rfi_number=rfi_num,
        author_id=current_user.id,
        status=RfiStatus.OPEN
    )
    db.add(rfi)
    db.commit()
    db.refresh(rfi)

    resp = RFIResponse.model_validate(rfi)
    resp.author_name = current_user.full_name
    if rfi.assigned_to:
        resp.assigned_to_name = rfi.assigned_to.full_name
    return resp

@router.patch("/{project_id}/rfis/{rfi_id}", response_model=RFIResponse)
def update_rfi(
    project_id: str,
    rfi_id: str,
    rfi_in: RFIUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rfi = db.query(RFI).filter(RFI.id == rfi_id, RFI.project_id == project_id).first()
    if not rfi:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="RFI not found")

    update_data = rfi_in.model_dump(exclude_unset=True)
    if "answer" in update_data and update_data["answer"]:
        if "status" not in update_data:
            update_data["status"] = RfiStatus.ANSWERED

    for field, val in update_data.items():
        setattr(rfi, field, val)

    db.commit()
    db.refresh(rfi)

    resp = RFIResponse.model_validate(rfi)
    if rfi.author:
        resp.author_name = rfi.author.full_name
    if rfi.assigned_to:
        resp.assigned_to_name = rfi.assigned_to.full_name
    return resp

# --- DOCUMENTS ---
@router.get("/{project_id}/documents", response_model=List[ProjectDocumentResponse])
def list_project_documents(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    docs = db.query(ProjectDocument).filter(ProjectDocument.project_id == project_id).order_by(ProjectDocument.created_at.desc()).all()
    results = []
    for d in docs:
        resp = ProjectDocumentResponse.model_validate(d)
        if d.uploaded_by:
            resp.uploaded_by_name = d.uploaded_by.full_name
        results.append(resp)
    return results

@router.post("/{project_id}/documents", response_model=ProjectDocumentResponse, status_code=status.HTTP_201_CREATED)
def create_project_document(
    project_id: str,
    doc_in: ProjectDocumentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    doc = ProjectDocument(
        **doc_in.model_dump(),
        project_id=project_id,
        uploaded_by_id=current_user.id
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    resp = ProjectDocumentResponse.model_validate(doc)
    resp.uploaded_by_name = current_user.full_name
    return resp
