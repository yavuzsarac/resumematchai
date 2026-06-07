from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ResumeMatch AI"
    app_env: str = "development"
    api_v1_prefix: str = ""

    database_url: str = "sqlite:///./resumematch.db"
    jwt_secret_key: str = "change-this-secret-before-deploying"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    frontend_url: str = "http://localhost:3000"
    cors_origins: str = "http://localhost:3000"
    max_upload_size_mb: int = 8

    embedding_model_name: str = "all-MiniLM-L6-v2"
    enable_embedding_model: bool = False
    openai_api_key: str | None = None
    openai_model: str = "gpt-4o-mini"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    @field_validator("database_url", mode="before")
    @classmethod
    def use_psycopg_driver(cls, value: str) -> str:
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+psycopg://", 1)
        if value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+psycopg://", 1)
        return value

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
