import { mockHoldings } from './mockHoldings'
import { computePortfolioSummary } from './portfolioMetrics'
import PortfolioChart from './PortfolioChart'

function formatCurrency(value: number): string {
  return `${Math.round(value).toLocaleString('ko-KR')}원`
}

function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

function changeColorClass(value: number): string {
  if (value > 0) return 'text-rise'
  if (value < 0) return 'text-fall'
  return 'text-muted'
}

// 포트폴리오 화면 — PLAN.md §5: 총 자산 / 총 수익률 / 오늘 변동률 + 그래프 + 보유 종목.
// mockHoldings + mockPrices 로부터 computePortfolioSummary 가 지표를 계산한다(§11 mock 방침).
function PortfolioPage() {
  const summary = computePortfolioSummary(mockHoldings)

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-bold text-ink">포트폴리오</h1>
      <p className="mt-1 text-xs text-muted">
        보유 종목·시세는 mock 데이터입니다. 실 계좌·시세 연동은 추후 지원됩니다.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs text-muted">총 자산</p>
          <p className="mt-1 text-lg font-bold text-ink">{formatCurrency(summary.totalAsset)}</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs text-muted">총 수익률</p>
          <p className={`mt-1 text-lg font-bold ${changeColorClass(summary.totalReturnPercent)}`}>
            {formatPercent(summary.totalReturnPercent)}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs text-muted">오늘 변동률</p>
          <p className={`mt-1 text-lg font-bold ${changeColorClass(summary.dailyChangePercent)}`}>
            {formatPercent(summary.dailyChangePercent)}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-line bg-surface p-4">
        <p className="mb-2 text-xs text-muted">최근 거래일 총 평가액 추이</p>
        <PortfolioChart points={summary.valueHistory} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-muted">
              <th className="px-4 py-2 font-medium">종목명</th>
              <th className="px-4 py-2 font-medium">수량</th>
              <th className="px-4 py-2 font-medium">평균단가</th>
              <th className="px-4 py-2 font-medium">현재가</th>
              <th className="px-4 py-2 font-medium">평가금액</th>
              <th className="px-4 py-2 font-medium">수익률</th>
            </tr>
          </thead>
          <tbody>
            {summary.holdings.map((holding) => (
              <tr key={holding.ticker} className="border-b border-line last:border-0">
                <td className="px-4 py-2 text-ink">{holding.name}</td>
                <td className="px-4 py-2 text-ink">{holding.qty}</td>
                <td className="px-4 py-2 text-ink">{formatCurrency(holding.avgPrice)}</td>
                <td className="px-4 py-2 text-ink">{formatCurrency(holding.currentPrice)}</td>
                <td className="px-4 py-2 text-ink">{formatCurrency(holding.marketValue)}</td>
                <td className={`px-4 py-2 font-medium ${changeColorClass(holding.returnPercent)}`}>
                  {formatPercent(holding.returnPercent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PortfolioPage
