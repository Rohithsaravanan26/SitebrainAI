from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.auth import User
from app.models.digital_twin import DigitalTwinModel, SpatialAnnotation
from app.schemas.digital_twin import (
    SpatialAnnotationCreate,
    SpatialAnnotationResponse,
    DigitalTwinModelResponse,
)

router = APIRouter(prefix="/digital-twin", tags=["Digital Twin"])

# Seed a default model on first-call (no migrations needed for stub model)
def _get_or_create_default_model(db: Session) -> DigitalTwinModel:
    model = db.query(DigitalTwinModel).first()
    if not model:
        model = DigitalTwinModel(
            name="Harbor City Tower — Block C",
            version="BIM-REV-12",
            elements_count=284,
            completed_progress=67.0,
            file_url=None,
        )
        db.add(model)
        db.commit()
        db.refresh(model)
    return model

@router.get("/models", response_model=List[DigitalTwinModelResponse])
def list_models(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    models = db.query(DigitalTwinModel).all()
    return models

@router.get("/models/{model_id}", response_model=DigitalTwinModelResponse)
def get_model(
    model_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    model = db.query(DigitalTwinModel).filter(DigitalTwinModel.id == model_id).first()
    if not model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Digital twin model not found")
    return model

@router.get("/models/{model_id}/annotations", response_model=List[SpatialAnnotationResponse])
def list_annotations(
    model_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(SpatialAnnotation)
        .filter(SpatialAnnotation.model_id == model_id)
        .order_by(SpatialAnnotation.created_at.desc())
        .all()
    )

@router.post("/annotations", response_model=SpatialAnnotationResponse, status_code=status.HTTP_201_CREATED)
def create_annotation(
    annotation_in: SpatialAnnotationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    model = db.query(DigitalTwinModel).filter(DigitalTwinModel.id == annotation_in.model_id).first()
    if not model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Digital twin model not found")

    annotation = SpatialAnnotation(
        **annotation_in.model_dump(),
        created_by=current_user.full_name,
    )
    db.add(annotation)
    db.commit()
    db.refresh(annotation)
    return annotation

@router.patch("/annotations/{annotation_id}", response_model=SpatialAnnotationResponse)
def update_annotation_status(
    annotation_id: str,
    new_status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    annotation = db.query(SpatialAnnotation).filter(SpatialAnnotation.id == annotation_id).first()
    if not annotation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Annotation not found")
    annotation.status = new_status
    db.commit()
    db.refresh(annotation)
    return annotation

@router.delete("/annotations/{annotation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_annotation(
    annotation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    annotation = db.query(SpatialAnnotation).filter(SpatialAnnotation.id == annotation_id).first()
    if not annotation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Annotation not found")
    db.delete(annotation)
    db.commit()
