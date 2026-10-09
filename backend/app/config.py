import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Duolingo Clone API"
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./duolingo.db")
    cors_origins: list[str] = ["*"]
    simulated_date_offset: int = 0  # For testing streak logic

settings = Settings()
