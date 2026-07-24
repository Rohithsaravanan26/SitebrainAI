import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Float, Integer, DateTime, Enum as SQLEnum, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class VisionJobStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class VisionJob(Base):
    __tablename__ = "vision_jobs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(512), nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[VisionJobStatus] = mapped_column(SQLEnum(VisionJobStatus), default=VisionJobStatus.PENDING, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    prediction: Mapped["VisionPrediction | None"] = relationship("VisionPrediction", back_populates="job", uselist=False, cascade="all, delete-orphan")

class VisionPrediction(Base):
    __tablename__ = "vision_predictions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id: Mapped[str] = mapped_column(String(36), ForeignKey("vision_jobs.id", ondelete="CASCADE"), unique=True, nullable=False)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    model_version: Mapped[str] = mapped_column(String(50), nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False)
    estimated_progress: Mapped[float] = mapped_column(Float, nullable=False)
    detected_classes: Mapped[dict] = mapped_column(JSON, nullable=False) # List of detected objects with confidence
    raw_metadata: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    job: Mapped["VisionJob"] = relationship("VisionJob", back_populates="prediction")
