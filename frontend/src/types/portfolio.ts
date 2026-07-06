// PLAN.md §7 portfolio_holdings(id, user_id, ticker, qty, avg_price) — id/user_id는
// 클라이언트 mock 단계에서는 생략(로그인 사용자 한 명, 배열 순서로 충분).
// name 은 화면 표시용 — 실 데이터 연동 시 시세 API 응답의 종목명으로 대체될 필드.
export interface PortfolioHolding {
  ticker: string
  name: string
  qty: number
  avgPrice: number
}
