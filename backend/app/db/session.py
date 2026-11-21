# backend/app/db/session.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

engine = create_engine(settings.database_url)
# engine: Postgres 와의 실제 연결. 앱 전체에 딱 1개

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
# SessionLocal : 호출할 때마다 새 Session 을 만듬


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
# get_db : FastAPI 의존성. 요청 시작 시 세션을 빌려주고, 요청이 끝나면 finally 에서 닫음
