from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from app.models.projects import ProjectStatus, RfiStatus, RfiPriority, MilestoneStatus
from app.models.auth import UserRole

class ProjectBase(BaseModel):
    code: str = Field(..., min_length=2, max_length=50)
    name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    location: str
    status: ProjectStatus = ProjectStatus.ACTIVE
    start_date: datetime
    end_date: datetime
    budget: float = Field(0.0, ge=0)
    progress_percent: float = Field(0.0, ge=0, le=100)

class ProjectCreate(ProjectBase):
    project_manager_id: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    status: Optional[ProjectStatus] = None
    budget: Optional[float] = None
    progress_percent: Optional[float] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class ProjectResponse(ProjectBase):
    id: str
    project_manager_id: Optional[str] = None
    project_manager_name: Optional[str] = None
    created_by_id: Optional[str] = None
    open_rfi_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PaginatedProjectsResponse(BaseModel):
    items: List[ProjectResponse]
    total: int
    page: int
    limit: int
    total_pages: int

class ProjectMemberCreate(BaseModel):
    user_id: str
    role_in_project: str = "Member"

class ProjectMemberResponse(BaseModel):
    id: str
    project_id: str
    user_id: str
    full_name: str
    email: str
    role: UserRole
    role_in_project: str
    created_at: datetime

    class Config:
        from_attributes = True

class ProjectMilestoneCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    target_date: datetime
    status: MilestoneStatus = MilestoneStatus.UPCOMING
    progress_percent: float = Field(0.0, ge=0, le=100)

class ProjectMilestoneResponse(BaseModel):
    id: str
    project_id: str
    name: str
    target_date: datetime
    status: MilestoneStatus
    progress_percent: float
    created_at: datetime

    class Config:
        from_attributes = True

class RFIBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    question: str = Field(..., min_length=5)
    priority: RfiPriority = RfiPriority.MEDIUM
    due_date: datetime

class RFICreate(RFIBase):
    assigned_to_id: Optional[str] = None

class RFIUpdate(BaseModel):
    title: Optional[str] = None
    question: Optional[str] = None
    answer: Optional[str] = None
    status: Optional[RfiStatus] = None
    priority: Optional[RfiPriority] = None
    assigned_to_id: Optional[str] = None

class RFIResponse(RFIBase):
    id: str
    project_id: str
    rfi_number: str
    answer: Optional[str] = None
    status: RfiStatus
    author_id: Optional[str] = None
    author_name: Optional[str] = None
    assigned_to_id: Optional[str] = None
    assigned_to_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProjectDocumentBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    file_path: str
    file_type: str
    file_size_bytes: int = 0

class ProjectDocumentCreate(ProjectDocumentBase):
    pass

class ProjectDocumentResponse(ProjectDocumentBase):
    id: str
    project_id: str
    uploaded_by_id: Optional[str] = None
    uploaded_by_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
