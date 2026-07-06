# PLAN.md — AI 맞춤형 금융 뉴스 학습 플랫폼

> Claude CLI(`claude`) 개발용 플랜 문서. 프로젝트 루트에 두고 `claude` 세션에서 컨텍스트로 참조한다.
> `/init` 로 생성되는 `CLAUDE.md`(코딩 규칙·명령어)와 역할이 다르다 — 이 문서는 **무엇을/어떤 순서로** 만들지를 정의한다.

- **프로젝트명**: UFN (repo slug: `UFN`)
- **Figma**: Portfolio - AI 맞춤형 금융 뉴스 학습 플랫폼 (Dev Mode, 로그인 필요) — 와이어프레임 §5 반영
- **문서 상태**: v0.2 — 와이어프레임 + 스택(React/Tailwind + FastAPI) 반영

---

## 1. 한 줄 정의 & 핵심 원칙

**주식 뉴스를 읽는 흐름을 끊지 않고, 어려운 용어·문장을 클릭 한 번으로 주린이 눈높이에 맞게 paraphrase 해주는 뉴스 학습 플랫폼.**

모든 기능 결정은 아래 4대 원칙에 부합해야 한다.

1. **흐름 유지(Continuous)** — 사용자가 뉴스를 벗어나지 않는다. 설명은 in-place(팝오버/사이드 패널)로 뜬다.
2. **문맥 기반(Contextual)** — 단어 사전이 아니다. **기사 문맥을 반영한** 재서술을 한다.
3. **레벨 맞춤(Personalized)** — Beginner / Intermediate / Advanced 로 난이도를 조절한다.
4. **비용 최적화(Cache-first)** — 자주 조회되는 용어는 DB에서 즉시, 없는 것만 LLM 호출.

> ⚠️ "요약(summary)"이 아니라 "눈높이 재서술(paraphrase)"이 차별점이다. 이 축을 흐리지 말 것.

---

## 2. 타깃 & 근거 (요약)

- 페르소나: 20대 사회 초년생, 주식 경력 ~1년, 비전공 '주린이'. 출퇴근에 포털/토스로 뉴스를 읽다 용어 검색 반복 → 흐름 끊김.
- 시장: 개인 투자자 약 1,410만 명 / 성인 금융이해력 66.5점(20대 65.8점) / 뉴스 소비 60%+가 포털.
- 경쟁: 토스·야후파이낸스는 요약은 있어도 **레벨별 paraphrase는 없음** → 빈틈.

---

## 3. 기술 스택 (확정)

| 레이어 | 선택 | 비고 |
| --- | --- | --- |
| Frontend | **React + Vite + TypeScript + Tailwind CSS** | Tailwind 토큰은 §6 컬러 참고 |
| 상태관리 | TanStack Query(서버 상태) + Zustand(경량 클라이언트 상태) | 필요 시점 도입 |
| Backend | **FastAPI (Python 3.11+)** | REST API. Claude 호출·캐시·인증 담당 |
| ORM/DB | **PostgreSQL + SQLAlchemy 2.0 + Alembic** | 마이그레이션 관리 |
| Auth | FastAPI JWT (OAuth2 password flow) | 와이어프레임의 로그인/회원가입 |
| LLM | **Anthropic Python SDK** (FastAPI 내부에서 호출) | Haiku=저비용, Sonnet=고난이도 |
| 패키지 | Front: pnpm / Back: **uv** | setup 가이드 §10과 정합 |
| 배포 | Front: Vercel / Back: Railway·Render 등 / DB: 매니지드 Postgres | 데모 URL 확보 |

**LLM 모델(현재 기준, 문서에서 최신 확인)**
- 기본 paraphrase: `claude-haiku-4-5` (빠르고 저렴 → 캐시 미스 대량 처리)
- 어려운/애매한 문장: `claude-sonnet-5` (품질 우선)
- 모델·가격 최신값: https://docs.claude.com/en/api/overview 확인 후 확정.

> 🔐 **`ANTHROPIC_API_KEY`는 FastAPI 서버에만.** 프론트에서 Claude API를 직접 부르지 않는다. 프론트 → FastAPI `/api/paraphrase` → Claude 순서.

---

## 4. 시스템 아키텍처

```
[React/Tailwind SPA]
   │  fetch (JWT)
   ▼
[FastAPI]  ── Auth · News · Paraphrase · Vocab · Scrap · Portfolio 라우터
   │
   ├─ (1) 캐시 조회 → PostgreSQL(term_cache)
   │        HIT → 즉시 반환
   │        MISS ↓
   ├─ (2) Anthropic Python SDK 호출 (level별 프롬프트 + 기사 문맥)
   ├─ (3) 결과 term_cache 저장 → 반환
   └─ 뉴스/포트폴리오 데이터 ← PostgreSQL / 외부 API(후순위)
```

**Cache-first Paraphrase 상세**
- `cache_key = hash(정규화 텍스트 + level + context_id)`.
- 정규화: 조사/공백/대소문자 제거로 히트율↑.
- 순수 용어 정의는 문맥 없이 캐시 공유 가능(`article_id = null`), 문장 paraphrase는 기사별로 다르므로 `article_id`(또는 문단 해시)를 키에 포함.
- **스마트 하이라이트**: (a) seed 금융 용어 사전 매칭(빠름) + (b) 레벨 필터로 1차 결정. 애매하면 LLM 배치로 "이 기사에서 X레벨이 모를 용어" 사전 추출·캐싱.

---

## 5. 화면(IA) — 와이어프레임 반영

공통 레이아웃: **상단바**(로고 · 검색 · 알림 · 로그인/(user)님·내 계정) + **왼쪽 메뉴 바** + **본문** + (일부 화면) **우측 바**.

왼쪽 메뉴(와이어프레임에서 읽음, 라벨 확인 필요): **홈 · 뉴스 · 스크랩 · 단어장 · 급상승 종목 · 포트폴리오 · AI 투자 인사이트**, 하단 **설정**.

| 화면 | 구성 | 우선순위 |
| --- | --- | --- |
| **홈** | 본문: `추천 뉴스`(AI 선정) + `전체 뉴스` 피드. 우측 바: `내 관심 종목`, `오늘의 주식 단어`, `내가 스크랩한 단어` | ⭐ MVP |
| **뉴스(목록)** | 검색 + 뉴스 카드 피드 + 우측 카드 | ⭐ MVP |
| **뉴스 상세(리더)** | 기사 본문 + 스마트 하이라이트 + 클릭 시 paraphrase 패널(문장/단어별 설명, 레벨 조절) | ⭐⭐ 코어 |
| **스크랩** | 스크랩한 기사 카드 그리드(각 카드 X로 삭제) | ⭐ MVP |
| **단어장 (작업중)** | 저장한 용어 리스트 + 복습. 와이어프레임에 "작업중" 표기 | ⭐ MVP |
| **로그인 / 회원가입** | 인증 폼 | ⭐ MVP |
| **설정** | 계정·레벨·환경 설정 | 보조 |
| **포트폴리오** | `총 자산` · `총 수익률` · `오늘 변동률` + 그래프 | 보조(§11 데이터 이슈) |
| **급상승 종목 / AI 투자 인사이트** | 종목 랭킹 · AI 코멘트 | 보조 |

> 뉴스 상세 리더가 이 제품의 심장이다. 홈/목록은 그 진입로, 스크랩/단어장은 복습 루프.

---

## 6. 디자인 토큰 — 메인 컬러 = 증시 그린

브랜드 컬러는 **초록**. 단, **한국 증시 관례상 상승=빨강 / 하락=파랑**이므로 브랜드 그린과 등락 색은 반드시 분리한다(초록을 등락 의미로 쓰지 말 것).

```js
// tailwind.config.js (theme.extend.colors 발췌)
colors: {
  primary: {              // 브랜드 그린
    50:  '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',       // 메인 액션/브랜드 기준색
    700: '#047857',
  },
  // 한국 증시 등락 (브랜드와 분리)
  rise: '#E03131',        // 상승 = 빨강
  fall: '#1C7ED6',        // 하락 = 파랑
  // 뉴럴/배경
  ink:  '#0F172A',        // 본문 텍스트
  muted:'#64748B',
  line: '#E2E8F0',        // 보더
  bg:   '#F8FAFC',        // 앱 배경
}
```

- 하이라이트 강조: `primary/100` 배경 + `primary/700` 밑줄. 클릭 시 `primary/600`.
- 다크모드는 MVP 이후.

---

## 7. 데이터 모델 (PostgreSQL / SQLAlchemy)

```sql
users(id, email, hashed_password, level enum('beginner','intermediate','advanced'), created_at)

articles(id, source, title, body, url, published_at, tickers text[], created_at)

-- paraphrase 캐시 (핵심)
term_cache(
  id, cache_key text unique,      -- hash(text + level + context)
  original_text text, level text,
  article_id uuid null,           -- 문장 paraphrase면 채움, 순수 용어면 null
  explanation text, model text, created_at
)

user_vocab(id, user_id, term text, explanation text, created_at)
user_scraps(id, user_id, article_id, created_at)
daily_terms(id, term, explanation_by_level jsonb, date date)

-- 우측 바 / 보조 화면
watchlist(id, user_id, ticker text, created_at)          -- 내 관심 종목
portfolio_holdings(id, user_id, ticker, qty, avg_price)  -- 포트폴리오(보조)
```

---

## 8. 개발 단계 (Claude CLI에서 순서대로)

각 Phase = `claude` 세션에서 하나씩 지시 → 커밋 → 다음. Phase 끝마다 **완료 기준(DoD)** 충족 시 진행.

### Phase 0 — 스캐폴딩
- 프론트: Vite+React+TS+Tailwind, ESLint/Prettier, §6 컬러 토큰.
- 백엔드: FastAPI + uv, SQLAlchemy+Alembic, Postgres 연결, `/health` 엔드포인트.
- **DoD**: 프론트 빈 화면, 백엔드 `/health` 200, 린트 통과, 첫 커밋.

### Phase 1 — 인증 + 앱 셸 + 홈
- 로그인/회원가입(JWT). 상단바 + 왼쪽 메뉴 + 우측 바 셸 레이아웃.
- 홈: `추천 뉴스` / `전체 뉴스` 피드(시드 기사 5~10건).
- **DoD**: 회원가입→로그인→홈 진입, 피드 렌더링, 보호 라우팅 동작.

### Phase 2 — 뉴스 상세 리더 + 하이라이트 + 클릭 Paraphrase (⭐⭐ 코어)
- 기사 상세 리더 뷰(문단 렌더링).
- seed 금융 용어 사전 매칭 → 하이라이트. 클릭 → 인라인 팝오버/사이드 패널로 설명(이탈 없음).
- FastAPI `POST /api/paraphrase`(캐시 조회→미스 시 Claude→저장).
- **DoD**: 기사 안 용어 클릭 시 3초 내 설명, 재클릭 즉시(캐시 히트).

### Phase 3 — 레벨 시스템
- 온보딩/설정에서 레벨 선택 → `users.level`.
- 레벨별 프롬프트 분기 + 하이라이트 대상 변화.
- **DoD**: 같은 용어가 레벨별 다른 설명 반환·각각 캐시.

### Phase 4 — 단어장 & 스크랩
- 설명 팝오버 "단어장 저장" / 기사 "스크랩".
- 스크랩 그리드(카드 X 삭제), 단어장 리스트(작업중 → 기본 CRUD).
- **DoD**: 저장/삭제/조회 유지(새로고침 후에도).

### Phase 5 — 우측 바 위젯 + AI 추천 뉴스
- 우측 바: `내 관심 종목`, `오늘의 주식 단어`(daily_terms), `내가 스크랩한 단어`.
- 추천 뉴스: 레벨·관심 티커 기반 규칙 정렬(임베딩은 후순위).
- **DoD**: 홈 진입 시 우측 바 3위젯 + 추천 목록 노출.

### Phase 6 — 보조 화면 (포트폴리오 / 급상승 / AI 인사이트)
- 시세는 **목(mock) 데이터**로 시작(§11). 총자산/수익률/그래프, 급상승 랭킹, AI 코멘트.
- **DoD**: mock 기준 화면 완성, 실데이터 연동은 TODO로 명시.

### Phase 7 — 다듬기 & 배포
- 로딩/에러/빈 상태, 반응형, 접근성. Vercel+백엔드 배포, README/데모 URL.
- **DoD**: 공개 URL에서 읽기→클릭 설명→저장 플로우가 끊김 없이 동작.

---

## 9. 디렉토리 구조 (제안)

```
UFN/
├─ frontend/
│  ├─ src/
│  │  ├─ components/       # AppShell, Sidebar, RightBar, HighlightText, ParaphrasePanel
│  │  ├─ features/{reader,paraphrase,vocab,scrap,home,portfolio}/
│  │  ├─ lib/              # api client, auth, hooks
│  │  ├─ routes/  └─ types/
│  ├─ tailwind.config.js   # §6 토큰
│  └─ .env                 # VITE_API_BASE_URL
├─ backend/
│  ├─ app/
│  │  ├─ main.py
│  │  ├─ api/routes/       # auth, news, paraphrase, vocab, scrap, portfolio
│  │  ├─ core/             # config, security(JWT)
│  │  ├─ db/               # session, base
│  │  ├─ models/           # SQLAlchemy
│  │  ├─ schemas/          # Pydantic
│  │  └─ services/         # claude_service, cache_service, news_service
│  ├─ alembic/
│  ├─ pyproject.toml       # uv
│  └─ .env                 # ANTHROPIC_API_KEY, DATABASE_URL, JWT_SECRET_KEY
├─ scripts/                # 시드 기사·용어 사전 적재
├─ CLAUDE.md               # /init 생성 (코딩 규칙)
└─ PLAN.md                 # 이 문서
```

---

## 10. 환경 변수

```bash
# backend/.env
ANTHROPIC_API_KEY=
DATABASE_URL=postgresql+psycopg://user:pass@localhost:5432/finnews
JWT_SECRET_KEY=
# MARKET_DATA_API_KEY=   # 포트폴리오 실데이터 붙일 때(후순위)

# frontend/.env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 11. MVP 스코프 & 결정 필요 사항

**IN (MVP)**: 인증 · 홈(추천/전체 뉴스) · 뉴스 상세 리더 · 스마트 하이라이트 · 클릭 paraphrase · 레벨 시스템 · 단어장/스크랩 · 캐시 · 우측 바 위젯.

**보조/후순위**: 포트폴리오 · 급상승 종목 · AI 투자 인사이트 · 브라우저 확장/포털 오버레이 · 실시간 뉴스 대량 수집 · 임베딩 추천 · 확장 도메인(보험 약관·대출 계약서·DART 공시·IR·사업보고서).

**결정 필요**
1. **뉴스 소스** — 데모 시드 기사 vs 뉴스 API/RSS 실시간(저작권 확인). 포트폴리오면 시드 권장.
2. **시세 데이터** — 포트폴리오/급상승은 실시간 시세 API(한국투자증권 OpenAPI 등)가 필요. 무거우니 **MVP는 mock**, 실연동은 후순위.
3. **하이라이트 방식** — 사전 매칭만으로 시작 vs LLM 사전추출 도입 시점.
4. **repo/제품 이름** 확정.

---

## 12. 개발 규칙 (setup 가이드와 정합)

- 브랜치 `feat/ fix/ chore/`, main 직접 커밋 금지.
- 커밋 `feat: … / fix: … / chore: …`.
- 흐름: `git pull` → 브랜치 → `claude` 구현 → `commit` → `push` → `gh pr create --fill`.
- 비밀값은 `.env`만(가이드 `.gitignore` 포함). 실수 커밋 시 시크릿 로테이션 + filter-repo.

---

## 13. Claude CLI 첫 프롬프트 예시

프로젝트 루트에서 `claude` 실행 후:

```
이 리포의 PLAN.md 를 읽고 Phase 0(스캐폴딩)을 진행해줘.
frontend 는 Vite+React+TypeScript+Tailwind(§6 컬러 토큰 반영),
backend 는 FastAPI + uv + SQLAlchemy + Alembic + Postgres 로 초기화하고,
§9 디렉토리 구조와 §10 .env 템플릿을 만들어줘.
커밋 메시지는 §12 규칙을 따라줘.
```

이후 "PLAN.md의 Phase N 을 진행해줘"로 이어가면 된다.
