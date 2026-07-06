import type { PortfolioHolding } from '../../types/portfolio'

// TODO(backend): 실제 보유 종목·수량·평균단가는 증권사 계좌 연동 API로 대체.
// PLAN.md §11 — 포트폴리오는 MVP 동안 mock 데이터로 시작하고 실데이터 연동은 후순위 TODO.
// 관심종목 시드(watchlistStore)·기사 시드(seedArticles)와 겹치는 종목 위주로 구성해 데모 연속성을 유지.
export const mockHoldings: PortfolioHolding[] = [
  { ticker: '005930', name: '삼성전자', qty: 20, avgPrice: 68000 },
  { ticker: '373220', name: 'LG에너지솔루션', qty: 3, avgPrice: 410000 },
  { ticker: '000660', name: 'SK하이닉스', qty: 10, avgPrice: 145000 },
  { ticker: '005380', name: '현대차', qty: 8, avgPrice: 210000 },
  { ticker: '033780', name: 'KT&G', qty: 15, avgPrice: 95000 },
]
