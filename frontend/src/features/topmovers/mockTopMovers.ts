// TODO(backend): 실제 등락률·현재가는 실시간 시세 API(예: 한국투자증권 OpenAPI)로 대체.
// PLAN.md §11 — 급상승 종목은 시세 데이터가 무거워 MVP는 mock, 실연동은 후순위.
export interface TopMover {
  ticker: string
  name: string
  price: number
  changePercent: number // 등락률(%) — 양수면 상승(rise/빨강), 음수면 하락(fall/파랑)
}

export const mockTopMovers: TopMover[] = [
  { ticker: '000660', name: 'SK하이닉스', price: 160000, changePercent: 7.82 },
  { ticker: '373220', name: 'LG에너지솔루션', price: 412000, changePercent: 5.14 },
  { ticker: '005930', name: '삼성전자', price: 75000, changePercent: 3.61 },
  { ticker: '006400', name: '삼성SDI', price: 298000, changePercent: 2.45 },
  { ticker: '033780', name: 'KT&G', price: 99000, changePercent: 1.02 },
  { ticker: '055550', name: '신한지주', price: 52300, changePercent: -1.18 },
  { ticker: '105560', name: 'KB금융', price: 78400, changePercent: -2.34 },
  { ticker: '005380', name: '현대차', price: 205000, changePercent: -3.77 },
]
