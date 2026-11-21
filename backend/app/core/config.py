from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    database_url: str
    jwt_secret_key: str
    # Claude API 키는 Phase 2(paraphrase)부터 쓴다 — 기본값 "" 이라 .env 에 아직 없어도 서버가 켜진다.
    # 위 두 값은 기본값이 없어서 .env 에 없으면 시작할 때 바로 에러(빠뜨린 걸 일찍 알게 하려고)
    anthropic_api_key: str = ""


settings = Settings()
