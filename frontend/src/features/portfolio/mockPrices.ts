// TODO(backend): 실시간 현재가·시세 히스토리는 실시간 시세 API(예: 한국투자증권 OpenAPI)로 대체.
// PLAN.md §11 — 포트폴리오/급상승 종목은 시세 데이터가 무거워 MVP는 mock, 실연동은 후순위.
// 최근 7거래일 종가를 날짜별로 하드코딩 — 마지막 값이 "현재가", 그 앞 값이 "전일 종가"로 쓰인다.
export interface MockPricePoint {
  date: string // YYYY-MM-DD
  price: number
}

const MOCK_DATES = [
  '2026-06-30',
  '2026-07-01',
  '2026-07-02',
  '2026-07-03',
  '2026-07-04',
  '2026-07-05',
  '2026-07-06',
]

const RAW_PRICES: Record<string, number[]> = {
  '005930': [71000, 72000, 71500, 73000, 74000, 73500, 75000],
  '373220': [395000, 398000, 402000, 405000, 401000, 408000, 412000],
  '000660': [150000, 152000, 149000, 151000, 155000, 158000, 160000],
  '005380': [205000, 207000, 206000, 204000, 208000, 207000, 205000],
  '033780': [96000, 95500, 97000, 96500, 98000, 97500, 99000],
}

export const mockPriceSeries: Record<string, MockPricePoint[]> = Object.fromEntries(
  Object.entries(RAW_PRICES).map(([ticker, prices]) => [
    ticker,
    prices.map((price, index) => ({ date: MOCK_DATES[index], price })),
  ]),
)

export function getCurrentPrice(ticker: string): number {
  const series = mockPriceSeries[ticker]
  return series && series.length > 0 ? series[series.length - 1].price : 0
}

export function getPreviousClose(ticker: string): number {
  const series = mockPriceSeries[ticker]
  if (!series || series.length < 2) return getCurrentPrice(ticker)
  return series[series.length - 2].price
}
