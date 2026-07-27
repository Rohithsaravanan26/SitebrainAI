from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.inventory import router as inventory_router
from app.api.v1.vision import router as vision_router
from app.api.v1.digital_twin import router as digital_twin_router
from app.api.v1.projects import router as projects_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, tags=["Health"])
app.include_router(auth_router, prefix="/api/v1")
app.include_router(inventory_router, prefix="/api/v1")
app.include_router(vision_router, prefix="/api/v1")
app.include_router(digital_twin_router, prefix="/api/v1")
app.include_router(projects_router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "message": "SiteBrain AI Core API Baseline",
        "docs": "/docs" if settings.ENVIRONMENT != "production" else "disabled",
    }
