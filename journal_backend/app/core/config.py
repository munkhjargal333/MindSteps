from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    app_name: str = "JournalApp"
    app_env: str = "development"
    secret_key: str = "change-me"
    debug: bool = True

    # Database — Supabase Pooler
    db_host: str = "localhost"
    db_port: int = 6543
    db_name: str = "postgres"
    db_user: str = "postgres"
    db_password: str = ""
    db_schema: str = "public"

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    # Supabase Auth
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_jwt_secret: str = ""

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # AI Provider
    ai_provider: str = "gemini"  # anthropic | gemini | openai | huggingface

    # API Keys
    anthropic_api_key: str = ""
    gemini_api_key: str = ""
    openai_api_key: str = ""
    hf_token: str = ""

    # Model name overrides
    anthropic_model: str = "claude-sonnet-4-5-20250929"
    gemini_model: str = "gemini-1.5-pro"
    openai_model: str = "gpt-4o"
    hf_model: str = "mistralai/Mistral-7B-Instruct-v0.3"
    zhipu_api_key: str = ""
    glm_model: str = "glm-4-plus"

    # Model generation parameters — бүх provider дундаа хуваалцана
    temperature: float = 0.3
    max_tokens: int = 1024
    top_p: float = 0.9
    top_k: int = 50

    # Logging
    log_level: str = "INFO"

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
