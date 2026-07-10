"""SAGE 백엔드 — FastAPI 진입점.

Phase 0(스캐폴딩): 지금은 DB·인증·Claude 없이 서버가 뜨는지만 확인한다.
DoD(PLAN.md §8) — `/health` 가 200 을 반환하면 이 단계 완료.
"""

from fastapi import FastAPI

app = FastAPI(title="SAGE API", version="0.1.0")


@app.get("/")
def root() -> dict[str, str]:
    """루트 — 서버가 살아있는지 눈으로 확인하는 용도."""
    return {"service": "SAGE API", "docs": "/docs"}


@app.get("/health")
def health() -> dict[str, str]:
    """헬스체크 — 배포 환경/모니터링이 서버 생존을 확인하는 표준 엔드포인트."""
    return {"status": "ok"}
