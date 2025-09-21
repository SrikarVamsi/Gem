from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="FACTMCP_")

    gemini_api_key: str
    http_host: str = "127.0.0.1"
    http_port: int = 8080


settings = Settings()  # reads environment


