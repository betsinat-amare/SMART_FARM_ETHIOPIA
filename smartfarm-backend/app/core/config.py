from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator

class Settings(BaseSettings):
    DATABASE_URL: str
    GOOGLE_API_KEY: str = "your_key_here"
    GEMINI_MODEL: str = "gemini-2.0-flash"

    @field_validator("GOOGLE_API_KEY", "DATABASE_URL", "GEMINI_MODEL", mode="before")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        if isinstance(v, str):
            return v.strip()
        return v

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()