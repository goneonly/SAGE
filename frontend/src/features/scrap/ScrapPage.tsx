import { Link } from 'react-router-dom'
import { useScrapStore } from '../../lib/store/scrapStore'

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
  const entries = useScrapStore((state) => state.entries)
  const removeScrap = useScrapStore((state) => state.removeScrap)

  const sorted = [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div>
      <h1 className="text-xl font-bold text-ink">스크랩</h1>

      {sorted.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">
          아직 스크랩한 기사가 없어요. 기사 상세 화면에서 "스크랩" 버튼을 눌러보세요.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((entry) => (
            <div key={entry.id} className="relative">
              <Link
                to={`/article/${entry.articleId}`}
                className="block rounded-lg border border-line bg-white p-4 shadow-sm transition hover:shadow-md hover:border-primary-500"
              >
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>{entry.source}</span>
                  <span>·</span>
                  <time dateTime={entry.publishedAt}>{formatDate(entry.publishedAt)}</time>
                </div>
                <h3 className="mt-2 pr-6 font-semibold text-ink">{entry.title}</h3>
              </Link>
              <button
                type="button"
                onClick={() => removeScrap(entry.articleId)}
                aria-label={`${entry.title} 스크랩 삭제`}
                className="absolute right-2 top-2 rounded-full bg-white p-1 text-xs text-muted shadow hover:bg-primary-50 hover:text-rise"
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
