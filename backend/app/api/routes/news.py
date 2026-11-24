# 뉴스 API — 기사 목록(최신순·페이지네이션·제목 검색)과 상세 조회 (/api/news/*), 로그인 불필요

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.article import Article
from app.schemas.news import ArticleDetail, ArticleList

router = APIRouter(prefix="/api/news", tags=["news"])


@router.get("", response_model=ArticleList)
def list_news(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    q: str | None = None,
    db: Session = Depends(get_db),
):
    stmt = select(Article)
    if q:
        stmt = stmt.where(Article.title.ilike(f"%{q}%"))

    # 페이지로 자르기 전에 세야 검색 결과 전체 개수가 나온다(프론트가 페이지 수 계산)
    total = db.scalar(select(func.count()).select_from(stmt.subquery()))
    rows = db.scalars(
        stmt.order_by(Article.published_at.desc())
        .offset(offset)
        .limit(limit)
    ).all()
    return {"items": rows, "total": total}


@router.get("/{article_id}", response_model=ArticleDetail)
def get_news(article_id: int, db: Session = Depends(get_db)):
    article = db.get(Article, article_id)
    if article is None:
        raise HTTPException(status_code=404, detail="기사를 찾을 수 없습니다.")
    return article
