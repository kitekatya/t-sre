from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    cors_origins: str = "http://localhost:5173"
    app_version: str = "v1"
    hostname: str = "local"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
