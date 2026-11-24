# 뉴스 API 의 응답 모양 — 목록(본문 제외)·상세(본문 포함)·페이지 묶음(전체 개수 포함)

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ArticleSummary (BaseModel):
    id: int
    source: str
    title: str
    url: str
    published_at: datetime
    tickers: list[str]

    model_config = ConfigDict(from_attributes=True)


class ArticleDetail(ArticleSummary):
    body: str


class ArticleList(BaseModel):
    items: list[ArticleSummary]
    total: int
