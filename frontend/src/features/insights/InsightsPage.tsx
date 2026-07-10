import { mockInsights } from './mockInsights'
import { AI_DISCLAIMER } from '../../lib/aiDisclaimer'
import { usePageTitle } from '../../lib/usePageTitle'
import Container from '../../components/ui/Container'
import PageTitle from '../../components/ui/PageTitle'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'

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
  usePageTitle('AI 투자 인사이트')
  return (
    <Container size="md">
      <PageTitle
        title="AI 투자 인사이트"
        description="지금은 mock 코멘트입니다. 실제 AI 생성 연동은 추후 지원됩니다."
      />

      {/* AI 생성 콘텐츠 고지 — 경고 문구이므로 등락 색상(rise)과 같은 계열의 옅은 빨강 톤으로 노출 */}
      <p className="mt-4 rounded-lg border border-rise/20 bg-rise/10 px-4 py-3 text-xs leading-relaxed text-rise">
        {AI_DISCLAIMER}
      </p>

      <div className="mt-6 space-y-4">
        {mockInsights.map((insight) => (
          <Card as="article" key={insight.id} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-ink">{insight.theme}</h2>
                {insight.ticker && <Badge>{insight.ticker}</Badge>}
              </div>
              <time dateTime={insight.generatedAt} className="shrink-0 text-xs text-muted">
                {formatDate(insight.generatedAt)}
              </time>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink">{insight.comment}</p>
          </Card>
        ))}
      </div>
    </Container>
  )
}

export default InsightsPage
