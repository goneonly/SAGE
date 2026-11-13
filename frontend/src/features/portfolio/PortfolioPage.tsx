import { mockHoldings } from './mockHoldings'
import { computePortfolioSummary } from './portfolioMetrics'
import PortfolioChart from './PortfolioChart'
import { usePageTitle } from '../../lib/usePageTitle'
import Container from '../../components/ui/Container'
import PageTitle from '../../components/ui/PageTitle'
import Card from '../../components/ui/Card'
import { formatSignedPercent, formatWon } from '../../lib/format'

function changeColorClass(value: number): string {
  if (value > 0) return 'text-rise'
  if (value < 0) return 'text-fall'
  return 'text-muted'
}

// 포트폴리오 화면 — PLAN.md §5: 총 자산 / 총 수익률 / 오늘 변동률 + 그래프 + 보유 종목.
// mockHoldings + mockPrices 로부터 computePortfolioSummary 가 지표를 계산한다(§11 mock 방침).
function PortfolioPage() {
  usePageTitle('포트폴리오')
  const summary = computePortfolioSummary(mockHoldings)

  return (
    <Container size="lg">
      <PageTitle
        title="포트폴리오"
        description="보유 종목·시세는 mock 데이터입니다. 실 계좌·시세 연동은 추후 지원됩니다."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-muted">총 자산</p>
          <p className="mt-1 text-lg font-bold text-ink">{formatWon(summary.totalAsset)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">총 수익률</p>
          <p className={`mt-1 text-lg font-bold ${changeColorClass(summary.totalReturnPercent)}`}>
            {formatSignedPercent(summary.totalReturnPercent)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">오늘 변동률</p>
          <p className={`mt-1 text-lg font-bold ${changeColorClass(summary.dailyChangePercent)}`}>
            {formatSignedPercent(summary.dailyChangePercent)}
          </p>
        </Card>
      </div>

      <Card className="mt-6 p-4">
        <p className="mb-2 text-xs text-muted">최근 거래일 총 평가액 추이</p>
        <PortfolioChart points={summary.valueHistory} />
      </Card>

      {/* 보유 종목 — <lg: 종목별 카드 / lg+: 표. 6열 표는 좁은 폭에서 종목명이 글자 단위로 꺾이고
          오른쪽 열이 잘린다. md~lg 는 사이드바(w-56) 때문에 본문이 ~500px 라 표가 넘치므로 lg 에서 전환한다. */}
      <ul className="mt-6 space-y-3 lg:hidden">
        {summary.holdings.map((holding) => (
          <Card as="li" key={holding.ticker} className="p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-semibold text-ink">{holding.name}</span>
              <span
                className={`shrink-0 font-semibold tabular-nums ${changeColorClass(holding.returnPercent)}`}
              >
                {formatSignedPercent(holding.returnPercent)}
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="text-xs text-muted">평가금액</dt>
                <dd className="tabular-nums text-ink">{formatWon(holding.marketValue)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">수량</dt>
                <dd className="tabular-nums text-ink">{holding.qty}주</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">평균단가</dt>
                <dd className="tabular-nums text-ink">{formatWon(holding.avgPrice)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">현재가</dt>
                <dd className="tabular-nums text-ink">{formatWon(holding.currentPrice)}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </ul>

      <Card className="mt-6 hidden overflow-x-auto lg:block">
        <table className="w-full whitespace-nowrap text-left text-sm tabular-nums">
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
                <td className="px-4 py-2 text-ink">{formatWon(holding.avgPrice)}</td>
                <td className="px-4 py-2 text-ink">{formatWon(holding.currentPrice)}</td>
                <td className="px-4 py-2 text-ink">{formatWon(holding.marketValue)}</td>
                <td className={`px-4 py-2 font-medium ${changeColorClass(holding.returnPercent)}`}>
                  {formatSignedPercent(holding.returnPercent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Container>
  )
}

export default PortfolioPage
