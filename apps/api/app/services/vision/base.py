from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List, Dict, Any, Optional

@dataclass
class DetectedObjectDTO:
    class_name: str
    confidence: float
    bbox: Optional[List[float]] = None

@dataclass
class PredictionResult:
    model_name: str
    model_version: str
    confidence_score: float
    estimated_progress: float
    detected_classes: List[DetectedObjectDTO]
    raw_metadata: Optional[Dict[str, Any]] = None

class BaseVisionModelProvider(ABC):
    @property
    @abstractmethod
    def model_name(self) -> str:
        """Name of the ML model engine."""
        pass

    @property
    @abstractmethod
    def model_version(self) -> str:
        """Version tag of the ML model engine."""
        pass

    @property
    @abstractmethod
    def supported_classes(self) -> List[str]:
        """Classes detected by this vision model."""
        pass

    @abstractmethod
    def predict(self, image_bytes: bytes, filename: str) -> PredictionResult:
        """
        Execute computer vision inference on raw image bytes.
        Returns structured PredictionResult.
        """
        pass
