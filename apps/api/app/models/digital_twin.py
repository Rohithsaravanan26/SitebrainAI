import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Float, Integer, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class AnnotationCategory(str, enum.Enum):
    RFI = "RFI"
    SAFETY_HAZARD = "SAFETY_HAZARD"
    DEFECT = "DEFECT"
    QUALITY_INSPECTION = "QUALITY_INSPECTION"

class DigitalTwinModel(Base):
    __tablename__ = "digital_twin_models"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    version: Mapped[str] = mapped_column(String(50), nullable=False)
    elements_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    completed_progress: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    file_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    annotations: Mapped[list["SpatialAnnotation"]] = relationship("SpatialAnnotation", back_populates="model", cascade="all, delete-orphan")

class SpatialAnnotation(Base):
    __tablename__ = "spatial_annotations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    model_id: Mapped[str] = mapped_column(String(36), ForeignKey("digital_twin_models.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    category: Mapped[AnnotationCategory] = mapped_column(SQLEnum(AnnotationCategory), nullable=False)
    position_x: Mapped[float] = mapped_column(Float, nullable=False)
    position_y: Mapped[float] = mapped_column(Float, nullable=False)
    position_z: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="OPEN", nullable=False)
    created_by: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    model: Mapped["DigitalTwinModel"] = relationship("DigitalTwinModel", back_populates="annotations")
