# 샘플 기사 시드 — seed_articles.json 을 articles 테이블에 넣는다(이미 있는 url 은 건너뛰어 여러 번 실행해도 중복 없음)
#
# 실행: cd backend && .venv/bin/python -m scripts.seed_articles
# 데이터는 프론트 mock(frontend/src/features/home/seedArticles.ts)과 같은 기사 — 연동 후에도 화면 내용이 그대로 유지된다.

import json
from datetime import datetime
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.article import Article

DATA_FILE = Path(__file__).with_name("seed_articles.json")


def seed(db: Session) -> int:
    """새로 넣은 기사 수를 돌려준다."""
    items = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    existing = set(db.scalars(select(Article.url)))  # Q5 — 원래부터 고유한 값(url)으로 중복 검사
    added = 0
    for item in items:
        if item["url"] in existing:
            continue
        # published_at 칸은 시간대 정보가 없는 timestamp — 한국 시각(+09:00) 그대로 저장
        published_at = datetime.fromisoformat(item["published_at"]).replace(tzinfo=None)
        db.add(Article(**{**item, "published_at": published_at}))
        added += 1
    db.commit()
    return added


if __name__ == "__main__":
    with SessionLocal() as db:
        added = seed(db)
        total = db.query(Article).count()
    print(f"새로 넣음 {added}건 · 전체 {total}건")
