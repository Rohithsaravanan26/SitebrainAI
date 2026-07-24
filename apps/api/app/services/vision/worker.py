from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.vision import VisionJob, VisionPrediction, VisionJobStatus
from app.services.vision.mock_provider import ProgressEstimationProvider

provider = ProgressEstimationProvider()

def process_vision_job(job_id: str, image_bytes: bytes, filename: str):
    db: Session = SessionLocal()
    try:
        job = db.query(VisionJob).filter(VisionJob.id == job_id).first()
        if not job:
            return

        # Update status to PROCESSING
        job.status = VisionJobStatus.PROCESSING
        db.commit()

        # Execute Extensible Model Inference
        result = provider.predict(image_bytes=image_bytes, filename=filename)

        # Map detected objects to JSON dict
        detected_json = [
            {
                "class_name": obj.class_name,
                "confidence": obj.confidence,
                "bbox": obj.bbox
            }
            for obj in result.detected_classes
        ]

        # Save Prediction Record
        prediction = VisionPrediction(
            job_id=job.id,
            model_name=result.model_name,
            model_version=result.model_version,
            confidence_score=result.confidence_score,
            estimated_progress=result.estimated_progress,
            detected_classes=detected_json,
            raw_metadata=result.raw_metadata
        )
        db.add(prediction)

        # Mark Job COMPLETED
        job.status = VisionJobStatus.COMPLETED
        job.completed_at = datetime.now(timezone.utc)
        db.commit()

    except Exception as e:
        db.rollback()
        job = db.query(VisionJob).filter(VisionJob.id == job_id).first()
        if job:
            job.status = VisionJobStatus.FAILED
            db.commit()
    finally:
        db.close()
