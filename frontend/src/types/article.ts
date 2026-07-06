// PLAN.md §7 — articles(id, source, title, body, url, published_at, tickers, created_at)
// 백엔드 연동 시 이 shape 그대로 fetch 응답에 매핑하면 된다.
export interface Article {
  id: string
  source: string
  title: string
  body: string
  url: string
  publishedAt: string // ISO 8601
  tickers: string[]
}
