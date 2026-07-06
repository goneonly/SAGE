import type { PortfolioHolding } from '../../types/portfolio'
import { getCurrentPrice, getPreviousClose, mockPriceSeries } from './mockPrices'

export interface HoldingMetrics extends PortfolioHolding {
  currentPrice: number
  marketValue: number
  returnPercent: number // 평균단가 대비 수익률
}

export interface PortfolioSummary {
  totalAsset: number // 총 자산 = Σ(qty × 현재가)
  totalReturnPercent: number // 총 수익률 = (총 자산 − 총 매입원가) / 총 매입원가 × 100
  dailyChangePercent: number // 오늘 변동률 = (총 자산 − 전일 총 평가액) / 전일 총 평가액 × 100
  holdings: HoldingMetrics[]
  // 최근 거래일별 총 평가액 시계열 — 그래프용(날짜별로 모든 보유 종목의 qty × 그날 종가를 합산).
  valueHistory: { date: string; value: number }[]
}

// 보유 종목(mockHoldings) + 종목별 시세 히스토리(mockPrices)로부터 요약 지표를 계산한다.
// 실 데이터 연동 시에도 이 함수의 입력(holdings, 시세)만 실제 API 응답으로 바뀌면 되고,
// 계산 로직 자체는 그대로 재사용할 수 있도록 분리해뒀다.
export function computePortfolioSummary(holdings: PortfolioHolding[]): PortfolioSummary {
  const holdingMetrics: HoldingMetrics[] = holdings.map((holding) => {
    const currentPrice = getCurrentPrice(holding.ticker)
    const marketValue = holding.qty * currentPrice
    const returnPercent =
      holding.avgPrice > 0 ? ((currentPrice - holding.avgPrice) / holding.avgPrice) * 100 : 0
    return { ...holding, currentPrice, marketValue, returnPercent }
  })

  const totalAsset = holdingMetrics.reduce((sum, holding) => sum + holding.marketValue, 0)
  const totalCost = holdings.reduce((sum, holding) => sum + holding.qty * holding.avgPrice, 0)
  const totalReturnPercent = totalCost > 0 ? ((totalAsset - totalCost) / totalCost) * 100 : 0

  const previousTotal = holdings.reduce(
    (sum, holding) => sum + holding.qty * getPreviousClose(holding.ticker),
    0,
  )
  const dailyChangePercent =
    previousTotal > 0 ? ((totalAsset - previousTotal) / previousTotal) * 100 : 0

  const dates = Object.values(mockPriceSeries)[0]?.map((point) => point.date) ?? []
  const valueHistory = dates.map((date, dateIndex) => ({
    date,
    value: holdings.reduce((sum, holding) => {
      const point = mockPriceSeries[holding.ticker]?.[dateIndex]
      return sum + holding.qty * (point?.price ?? 0)
    }, 0),
  }))

  return {
    totalAsset,
    totalReturnPercent,
    dailyChangePercent,
    holdings: holdingMetrics,
    valueHistory,
  }
}
