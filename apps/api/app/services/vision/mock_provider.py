import hashlib
import random
from typing import List
from app.services.vision.base import BaseVisionModelProvider, PredictionResult, DetectedObjectDTO

class ProgressEstimationProvider(BaseVisionModelProvider):
    @property
    def model_name(self) -> str:
        return "SiteBrain-Vision-Progress"

    @property
    def model_version(self) -> str:
        return "v1.2.0-yolov8x"

    @property
    def supported_classes(self) -> List[str]:
        return [
            "rebar_mesh",
            "formwork_panels",
            "concrete_pour",
            "safety_ppe_helmet",
            "safety_vest",
            "scaffolding_lvl14"
        ]

    def predict(self, image_bytes: bytes, filename: str) -> PredictionResult:
        # Deterministic simulation seeded by file hash for reproducible testing
        seed = int(hashlib.md5(image_bytes).hexdigest(), 16) % 10000
        rnd = random.Random(seed)

        estimated_progress = round(rnd.uniform(45.0, 95.0), 1)
        confidence_score = round(rnd.uniform(0.88, 0.98), 2)

        detected_objects = [
            DetectedObjectDTO(class_name="rebar_mesh", confidence=round(rnd.uniform(0.92, 0.99), 2), bbox=[120.0, 45.0, 480.0, 320.0]),
            DetectedObjectDTO(class_name="formwork_panels", confidence=round(rnd.uniform(0.85, 0.95), 2), bbox=[50.0, 200.0, 600.0, 500.0]),
            DetectedObjectDTO(class_name="concrete_pour", confidence=round(rnd.uniform(0.89, 0.97), 2), bbox=[200.0, 100.0, 550.0, 400.0]),
            DetectedObjectDTO(class_name="safety_ppe_helmet", confidence=round(rnd.uniform(0.94, 0.99), 2), bbox=[300.0, 150.0, 340.0, 190.0]),
        ]

        raw_metadata = {
            "image_filename": filename,
            "image_size_bytes": len(image_bytes),
            "grid_location": "Lvl 14 — Grid G-12",
            "inference_device": "NVIDIA CUDA TensorRT Core 0",
            "inference_latency_ms": rnd.randint(42, 88),
        }

        return PredictionResult(
            model_name=self.model_name,
            model_version=self.model_version,
            confidence_score=confidence_score,
            estimated_progress=estimated_progress,
            detected_classes=detected_objects,
            raw_metadata=raw_metadata
        )
