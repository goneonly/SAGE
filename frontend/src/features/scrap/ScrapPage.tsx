import { Link } from 'react-router-dom'
import { useScrapStore } from '../../lib/store/scrapStore'
import { usePageTitle } from '../../lib/usePageTitle'
import PageTitle from '../../components/ui/PageTitle'
import EmptyState from '../../components/ui/EmptyState'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 스크랩 화면 — 스크랩한 기사 카드 그리드, 각 카드 X로 삭제(PLAN.md §5).
// X 버튼은 카드(Link) 바깥에 겹쳐 배치해 카드 클릭(기사 이동)과 삭제 클릭이 서로 간섭하지 않게 한다.
function ScrapPage() {
  usePageTitle('스크랩')
  const entries = useScrapStore((state) => state.entries)
  const removeScrap = useScrapStore((state) => state.removeScrap)

  const sorted = [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div>
      <PageTitle title="스크랩" />

      {sorted.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon="📌"
          title="아직 스크랩한 기사가 없어요"
          description='기사 상세 화면 오른쪽 위의 "스크랩" 버튼을 누르면 여기에 모아둘 수 있어요.'
          action={
            <Link
              to="/news"
              className="inline-block rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-600/90"
            >
              기사 읽으러 가기
            </Link>
          }
        />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((entry) => (
            <div key={entry.id} className="relative">
              <Link
                to={`/article/${entry.articleId}`}
                className="block rounded-xl border border-line bg-surface p-4 transition hover:border-primary-500 hover:shadow-md"
              >
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>{entry.source}</span>
                  <span>·</span>
                  <time dateTime={entry.publishedAt}>{formatDate(entry.publishedAt)}</time>
                </div>
                <h2 className="mt-2 pr-6 text-base font-semibold text-ink">{entry.title}</h2>
              </Link>
              <button
                type="button"
                onClick={() => removeScrap(entry.articleId)}
                aria-label={`${entry.title} 스크랩 삭제`}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-surface text-xs leading-none text-muted shadow hover:bg-primary-50 hover:text-rise"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ScrapPage
