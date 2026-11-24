# 테스트 공용 준비물 — 빈 sage_test DB 에 연결한 client, 로그인 토큰 헤더(auth_headers)

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.article import Article  # noqa: F401 — create_all 이 articles 테이블을 알도록
from app.models.user import User  # noqa: F401 — create_all 이 users 테이블을 알도록

# .env 의 DATABASE_URL 에서 DB 이름만 sage_test 로 바꾼다
TEST_DATABASE_URL = settings.database_url.rsplit("/", 1)[0] + "/sage_test"

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(
    bind=engine, autoflush=False, autocommit=False)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client():
    Base.metadata.create_all(engine)                    # 테스트마다 빈 테이블로 시작
    app.dependency_overrides[get_db] = override_get_db  # 진짜 DB 대신 테스트 DB
    yield TestClient(app)
    app.dependency_overrides.clear()
    Base.metadata.drop_all(engine)                      # 끝나면 지움 → 테스트끼리 영향 없음


@pytest.fixture
def auth_headers(client):
    """가입 + 로그인까지 마친 유저의 Authorization 헤더"""
    client.post("/api/auth/signup",
                json={"email": "me@example.com", "password": "password123"})
    res = client.post(
        "/api/auth/login", data={"username": "me@example.com", "password": "password123"})
    return {"Authorization": f"Bearer {res.json()['access_token']}"}
