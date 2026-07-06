# UFN — Frontend

AI 맞춤형 금융 뉴스 학습 플랫폼(UFN)의 프론트엔드. Vite + React + TypeScript + Tailwind CSS.

제품/개발 플랜은 루트의 `PLAN.md` 참고.

## 시작하기

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_BASE_URL 설정
npm run dev            # http://localhost:5173
```

## 스크립트

- `npm run dev` — 개발 서버
- `npm run build` — 타입체크 + 프로덕션 빌드
- `npm run lint` — ESLint
- `npm run format` / `npm run format:check` — Prettier

## 구조 (PLAN.md §9)

```
src/
├─ components/   # AppShell, Sidebar, RightBar, HighlightText, ParaphrasePanel
├─ features/     # reader, paraphrase, vocab, scrap, home, portfolio
├─ lib/          # api client, auth, hooks
├─ routes/
└─ types/
```

디자인 토큰(브랜드 그린, 상승=빨강/하락=파랑)은 `tailwind.config.js` — PLAN.md §6.
