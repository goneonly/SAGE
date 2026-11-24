# articles 테이블 모양 정의 — 뉴스 기사(언론사·제목·본문·원문 URL·발행 시각·종목 코드)

from datetime import datetime

from sqlalchemy import String, Text, func
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Article(Base):
    __tablename__ = "articles"

    id: Mapped[int] = mapped_column(primary_key=True)
    source: Mapped[str] = mapped_column(String(100))
    title: Mapped[str] = mapped_column(String(300))
    body: Mapped[str] = mapped_column(Text)
    url: Mapped[str] = mapped_column(String(500), unique=True)
    published_at: Mapped[datetime] = mapped_column(index=True)
    tickers: Mapped[list[str]] = mapped_column(ARRAY(String(20)), default=list)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
