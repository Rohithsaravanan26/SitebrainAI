import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.auth import User
from app.models.vision import VisionJob, VisionJobStatus
from app.schemas.vision import (
    VisionJobResponse,
    VisionPredictionResponse,
    ModelMetadataResponse,
)
from app.services.vision.mock_provider import ProgressEstimationProvider
from app.services.vision.worker import process_vision_job

router = APIRouter(prefix="/vision", tags=["Computer Vision"])
provider = ProgressEstimationProvider()

@router.post("/upload", response_model=VisionJobResponse, status_code=status.HTTP_202_ACCEPTED)
async def upload_image_for_analysis(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a valid image format (JPEG, PNG, WebP)"
        )

    image_bytes = await file.read()
    file_size = len(image_bytes)

    if file_size > 20 * 1024 * 1024: # 20MB max
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image size exceeds maximum limit of 20MB"
        )

    # Save job entry in DB
    job = VisionJob(
        filename=file.filename or "uploaded_image.jpg",
        file_path=f"storage/vision/{file.filename}",
        file_size_bytes=file_size,
        status=VisionJobStatus.PENDING
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # Trigger Async Worker Processing
    background_tasks.add_task(
        process_vision_job,
        job_id=job.id,
        image_bytes=image_bytes,
        filename=job.filename
    )

    return VisionJobResponse.model_validate(job)

@router.get("/jobs", response_model=List[VisionJobResponse])
def get_prediction_history(
    status_filter: Optional[VisionJobStatus] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(VisionJob)
    if status_filter:
        query = query.filter(VisionJob.status == status_filter)
    
    jobs = query.order_by(VisionJob.created_at.desc()).limit(limit).all()
    return [VisionJobResponse.model_validate(j) for j in jobs]

@router.get("/jobs/{job_id}", response_model=VisionJobResponse)
def get_job_status(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(VisionJob).filter(VisionJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vision job not found")
    return VisionJobResponse.model_validate(job)

@router.get("/jobs/{job_id}/result", response_model=VisionPredictionResponse)
def get_job_prediction_result(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(VisionJob).filter(VisionJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vision job not found")
    if job.status != VisionJobStatus.COMPLETED or not job.prediction:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Job prediction is not available yet. Current status: {job.status.value}"
        )
    return VisionPredictionResponse.model_validate(job.prediction)

@router.get("/models", response_model=List[ModelMetadataResponse])
def list_available_models(
    current_user: User = Depends(get_current_user),
):
    return [
        ModelMetadataResponse(
            name=provider.model_name,
            version=provider.model_version,
            description="Autonomous construction progress estimation & PPE detection engine",
            supported_classes=provider.supported_classes
        )
    ]
