from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from app.models.digital_twin import AnnotationCategory

class SpatialAnnotationCreate(BaseModel):
    model_id: str
    title: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = Field(None, max_length=500)
    category: AnnotationCategory
    position_x: float
    position_y: float
    position_z: float
    status: str = "OPEN"

class SpatialAnnotationResponse(BaseModel):
    id: str
    model_id: str
    title: str
    description: Optional[str] = None
    category: AnnotationCategory
    position_x: float
    position_y: float
    position_z: float
    status: str
    created_by: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class DigitalTwinModelResponse(BaseModel):
    id: str
    name: str
    version: str
    elements_count: int
    completed_progress: float
    file_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
