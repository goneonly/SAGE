# 모든 모델의 부모 클래스 — 여기를 상속한 클래스가 DB 테이블로 등록된다

from sqlalchemy.orm import DeclarativeBase


class Base (DeclarativeBase):
    pass
