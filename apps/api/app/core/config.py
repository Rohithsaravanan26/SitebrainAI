from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "SiteBrain AI API"
    VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "info"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]

    # Security & Auth Settings
    SECRET_KEY: str = "sitebrain-super-secret-enterprise-key-change-in-prod-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    VERIFICATION_TOKEN_EXPIRE_HOURS: int = 24
    RESET_PASSWORD_TOKEN_EXPIRE_HOURS: int = 2

    # Database Settings
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/sitebrain_db"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
