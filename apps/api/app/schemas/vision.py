from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.models.vision import VisionJobStatus

class DetectedObjectSchema(BaseModel):
    class_name: str
    confidence: float
    bbox: Optional[List[float]] = None

class VisionPredictionResponse(BaseModel):
    id: str
    job_id: str
    model_name: str
    model_version: str
    confidence_score: float
    estimated_progress: float
    detected_classes: List[DetectedObjectSchema]
    raw_metadata: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class VisionJobResponse(BaseModel):
    id: str
    filename: str
    file_size_bytes: int
    status: VisionJobStatus
    prediction: Optional[VisionPredictionResponse] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ModelMetadataResponse(BaseModel):
    name: str
    version: str
    description: str
    supported_classes: List[str]
