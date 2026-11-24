# 서버 진입점 — FastAPI 앱을 만들고 라우터(auth·news)를 연결, 루트·헬스체크 제공

from fastapi import FastAPI
from app.api.routes.auth import router as auth_router
from app.api.routes.news import router as news_router

app = FastAPI(title="SAGE API", version="0.1.0")
app.include_router(auth_router)
app.include_router(news_router)


@app.get("/")
def root() -> dict[str, str]:
    """루트 — 서버가 살아있는지 눈으로 확인하는 용도."""
    return {"service": "SAGE API", "docs": "/docs"}


@app.get("/health")
def health() -> dict[str, str]:
    """헬스체크 — 배포 환경/모니터링이 서버 생존을 확인하는 표준 엔드포인트."""
    return {"status": "ok"}
