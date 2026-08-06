from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    database_url: str
    jwt_secret_key: str
    anthropic_api_key: str = ""   # 왜 이것만 기본값이 있을까? → 생각해보기


settings = Settings()
