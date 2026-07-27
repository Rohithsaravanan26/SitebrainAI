import math
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, RoleChecker
from app.models.auth import User, UserRole
from app.models.projects import (
    Project,
    ProjectMember,
    ProjectMilestone,
    RFI,
    ProjectDocument,
    ProjectStatus,
    MilestoneStatus,
    RfiStatus,
)
from app.schemas.projects import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    PaginatedProjectsResponse,
    ProjectMemberCreate,
    ProjectMemberResponse,
    ProjectMilestoneCreate,
    ProjectMilestoneResponse,
    RFICreate,
    RFIUpdate,
    RFIResponse,
    ProjectDocumentCreate,
    ProjectDocumentResponse,
)

router = APIRouter(prefix="/projects", tags=["Projects & RFIs"])
require_pm_or_admin = RoleChecker([UserRole.ADMIN, UserRole.PROJECT_MANAGER])

# --- PROJECTS DIRECTORY (PAGINATED) ---
@router.get("", response_model=PaginatedProjectsResponse)
def list_projects(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
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

    total = query.count()
    total_pages = math.ceil(total / limit) if total > 0 else 1
    offset = (page - 1) * limit

    projects = query.order_by(Project.created_at.desc()).offset(offset).limit(limit).all()
    items = []
    for p in projects:
        resp = ProjectResponse.model_validate(p)
        if p.project_manager:
            resp.project_manager_name = p.project_manager.full_name
        resp.open_rfi_count = db.query(RFI).filter(RFI.project_id == p.id, RFI.status == RfiStatus.OPEN).count()
        items.append(resp)

    return PaginatedProjectsResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages
    )

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
        project_manager_id=project_in.project_manager_id or current_user.id,
        created_by_id=current_user.id
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
@router.patch("/{project_id}/settings", response_model=ProjectResponse)
def update_project_settings(
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

# --- TIMELINE / MILESTONES ---
@router.get("/{project_id}/timeline", response_model=List[ProjectMilestoneResponse])
def get_project_timeline(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    milestones = db.query(ProjectMilestone).filter(ProjectMilestone.project_id == project_id).order_by(ProjectMilestone.target_date.asc()).all()
    return [ProjectMilestoneResponse.model_validate(m) for m in milestones]

@router.post("/{project_id}/timeline", response_model=ProjectMilestoneResponse, status_code=status.HTTP_201_CREATED)
def create_project_milestone(
    project_id: str,
    milestone_in: ProjectMilestoneCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_pm_or_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    milestone = ProjectMilestone(**milestone_in.model_dump(), project_id=project_id)
    db.add(milestone)
    db.commit()
    db.refresh(milestone)

    return ProjectMilestoneResponse.model_validate(milestone)

# --- MEMBERS ---
@router.get("/{project_id}/members", response_model=List[ProjectMemberResponse])
def get_project_members(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    members = db.query(ProjectMember).filter(ProjectMember.project_id == project_id).all()
    results = []
    for m in members:
        if m.user:
            results.append(ProjectMemberResponse(
                id=m.id,
                project_id=m.project_id,
                user_id=m.user_id,
                full_name=m.user.full_name,
                email=m.user.email,
                role=m.user.role,
                role_in_project=m.role_in_project,
                created_at=m.created_at
            ))
    return results

@router.post("/{project_id}/members", response_model=ProjectMemberResponse, status_code=status.HTTP_201_CREATED)
def add_project_member(
    project_id: str,
    member_in: ProjectMemberCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_pm_or_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    user = db.query(User).filter(User.id == member_in.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User to add not found")

    member = ProjectMember(
        project_id=project_id,
        user_id=member_in.user_id,
        role_in_project=member_in.role_in_project
    )
    db.add(member)
    db.commit()
    db.refresh(member)

    return ProjectMemberResponse(
        id=member.id,
        project_id=member.project_id,
        user_id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=user.role,
        role_in_project=member.role_in_project,
        created_at=member.created_at
    )

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

# --- DOCUMENTS & UPLOADS ---
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
@router.post("/{project_id}/uploads", response_model=ProjectDocumentResponse, status_code=status.HTTP_201_CREATED)
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
