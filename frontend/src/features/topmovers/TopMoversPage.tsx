import { mockTopMovers } from './mockTopMovers'

function formatPrice(value: number): string {
  return `${value.toLocaleString('ko-KR')}원`
}

function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

// 급상승 종목 — 등락률 내림차순 랭킹. 등락 색은 브랜드 그린과 분리(PLAN.md §6):
// 상승 = rise(빨강), 하락 = fall(파랑), 한국 증시 관례를 그대로 따른다.
function TopMoversPage() {
  const ranked = [...mockTopMovers].sort((a, b) => b.changePercent - a.changePercent)

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-bold text-ink">급상승 종목</h1>
      <p className="mt-1 text-xs text-muted">
        등락률 mock 데이터입니다. 실시간 시세 연동은 추후 지원됩니다.
      </p>

      <ul className="mt-6 divide-y divide-line rounded-xl border border-line bg-white">
        {ranked.map((mover, index) => (
          <li key={mover.ticker} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="w-5 text-sm font-semibold text-muted">{index + 1}</span>
              <div>
                <p className="text-sm font-medium text-ink">{mover.name}</p>
                <p className="text-xs text-muted">{mover.ticker}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-ink">{formatPrice(mover.price)}</p>
              <p
                className={`text-sm font-semibold ${mover.changePercent >= 0 ? 'text-rise' : 'text-fall'}`}
              >
                {formatPercent(mover.changePercent)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TopMoversPage
