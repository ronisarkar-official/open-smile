import os
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/postgres"
    CRON_SECRET: str = "open-smile-cron-secret-2026"
    APP_ENV: str = "development"
    BETTER_AUTH_SECRET: str = ""
    IMAGEKIT_PRIVATE_KEY: str = ""
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: str = ""

    model_config = SettingsConfigDict(
        env_file=(".env.local", ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

@lru_cache()
def get_settings() -> Settings:
    return Settings()
