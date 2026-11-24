# 뉴스 API 테스트 — 목록(최신순·페이지네이션·검색·범위 검증)·상세(404·422)·시드 중복 방지

from datetime import datetime

import pytest

from app.models.article import Article
from scripts.seed_articles import seed
from tests.conftest import TestingSessionLocal


def make_article(n: int, title: str = "기사") -> Article:
    return Article(
        source="테스트일보",
        title=f"{title} {n}",
        body=f"본문 {n}",
        url=f"https://example.com/test/{n}",
        published_at=datetime(2026, 7, n),
        tickers=["005930"],
    )


@pytest.fixture
def articles(client):
    """7월 1~5일 기사 5개 — 5일이 가장 최신"""
    with TestingSessionLocal() as db:
        db.add_all([make_article(n) for n in range(1, 6)])
        db.commit()


def test_list_empty(client):
    res = client.get("/api/news")
    assert res.status_code == 200
    assert res.json() == {"items": [], "total": 0}


def test_list_latest_first_without_body(client, articles):
    items = client.get("/api/news").json()["items"]
    assert [a["title"] for a in items] == ["기사 5", "기사 4", "기사 3", "기사 2", "기사 1"]
    assert "body" not in items[0]  # 목록은 본문 제외


def test_list_pagination_keeps_total(client, articles):
    body = client.get("/api/news?limit=2&offset=2").json()
    assert [a["title"] for a in body["items"]] == ["기사 3", "기사 2"]
    assert body["total"] == 5  # 자르기 전 전체 개수


def test_list_search_title(client, articles):
    with TestingSessionLocal() as db:
        db.add(make_article(6, title="삼성전자 실적"))
        db.commit()
    body = client.get("/api/news", params={"q": "삼성"}).json()
    assert body["total"] == 1
    assert body["items"][0]["title"] == "삼성전자 실적 6"


@pytest.mark.parametrize("query", ["limit=0", "limit=101", "offset=-1"])
def test_list_rejects_out_of_range(client, query):
    assert client.get(f"/api/news?{query}").status_code == 422


def test_detail_includes_body(client, articles):
    first = client.get("/api/news").json()["items"][0]
    res = client.get(f"/api/news/{first['id']}")
    assert res.status_code == 200
    assert res.json()["body"] == "본문 5"


def test_detail_not_found(client):
    assert client.get("/api/news/999").status_code == 404


def test_detail_non_int_id(client):
    assert client.get("/api/news/abc").status_code == 422


def test_seed_is_idempotent(client):
    with TestingSessionLocal() as db:
        first = seed(db)
        second = seed(db)
        total = db.query(Article).count()
    assert first > 0
    assert second == 0  # 두 번 실행해도 중복 없음
    assert total == first
