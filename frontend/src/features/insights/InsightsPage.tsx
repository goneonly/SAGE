import { mockInsights } from './mockInsights'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// AI 투자 인사이트 — mock 코멘트 카드 목록. 실제로는 백엔드가 Claude를 호출해 생성한다(§3).
function InsightsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-bold text-ink">AI 투자 인사이트</h1>
      <p className="mt-1 text-xs text-muted">
        지금은 mock 코멘트입니다. 실제 AI 생성 연동은 추후 지원됩니다.
      </p>

      <div className="mt-6 space-y-4">
        {mockInsights.map((insight) => (
          <article
            key={insight.id}
            className="rounded-lg border border-line bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-ink">{insight.theme}</h2>
                {insight.ticker && (
                  <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                    {insight.ticker}
                  </span>
                )}
              </div>
              <time dateTime={insight.generatedAt} className="shrink-0 text-xs text-muted">
                {formatDate(insight.generatedAt)}
              </time>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink">{insight.comment}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default InsightsPage
