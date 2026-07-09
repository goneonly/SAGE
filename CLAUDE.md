# CLAUDE.md

> 코딩 규칙·명령어 전용 문서. 프로젝트 배경·아키텍처·로드맵은 [PLAN.md](PLAN.md) 참고.

## 프로젝트

- **SAGE** — 금융 뉴스 문장을 클릭 한 번으로 사용자 레벨에 맞게 paraphrase 해주는 학습 플랫폼.
- Frontend: `frontend/` — React + Vite + TypeScript + Tailwind CSS, 상태관리 Zustand(+TanStack Query 예정).
- Backend: FastAPI + SQLAlchemy + Alembic + PostgreSQL (PLAN.md §3, §4 참고). 아직 미착수 시 최신 상태는 실제 디렉토리로 확인.
- UI 문구는 전부 한국어. 컴포넌트/변수명은 영어.
- 디자인 토큰(PLAN.md §6): 브랜드 그린 `primary`와 증시 등락색 `rise`(상승/빨강)·`fall`(하락/파랑)은 반드시 분리 — 브랜드 색을 등락 의미로 쓰지 않는다.

## 명령어

```bash
cd frontend
npm run dev            # 개발 서버 (Vite)
npm run build           # tsc -b && vite build — PR 전 필수
npm run lint             # eslint
npm run format:check   # prettier --check
npm run format          # prettier --write
```

## 규칙

- 브랜치: `feat/`, `fix/`, `chore/` 접두사. `main` 직접 커밋 금지.
- 커밋 메시지: `feat: …` / `fix: …` / `chore: …`.
- 흐름: `git pull` → 브랜치 생성 → 구현 → `commit` → `push` → PR.
- 반응형 기준: Tailwind `md:`(768px) 분기점으로 데스크톱/모바일을 나눈다. 모바일 전용 UI(햄버거, 검색 아이콘 토글 등)는 `md:hidden`으로, 데스크톱 전용은 `hidden md:*`로 짝을 맞춘다.
- Tailwind 임의값(`ml-[10%]`, `mr-[82px]` 등)은 실험적 여백 조정에 한해 허용하되, 값을 확정하면 가능한 스케일 클래스(`ml-3` 등)로 정리한다.

## 금지

- `ANTHROPIC_API_KEY`를 프론트엔드 코드나 커밋에 절대 포함하지 않는다 — 백엔드 `.env`에만 존재(PLAN.md §3, §10).
- `.env`, `.env.local` 등 비밀값 파일을 커밋하지 않는다(`.gitignore`에 이미 등록됨). 실수 커밋 시 시크릿 로테이션 + `git filter-repo` 필요.
- 브랜드 그린(`primary`)을 상승/하락 의미로 쓰지 않는다 — 반드시 `rise`/`fall` 사용.
- 존재하지 않는 백엔드 엔드포인트를 가정한 프론트 코드를 작성하지 않는다 — `frontend/src/lib/api/`의 기존 mock 패턴을 따르거나 실제 라우터 확인 후 연동.

## 검증

PR 또는 작업 완료 전:

```bash
cd frontend && npx tsc -b && npm run lint && npm run format:check && npm run build
```

UI가 걸린 변경은 Preview 도구로 실제 브라우저에서 동작을 확인한다(모바일 360px, 데스크톱 1280px 두 폭 모두 — `md:` 분기가 많으므로).
