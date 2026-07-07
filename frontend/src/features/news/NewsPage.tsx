import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ArticleCard from '../home/ArticleCard'
import { seedArticles } from '../home/seedArticles'

const PAGE_SIZE = 10

// 뉴스 화면 — 전체 기사를 최신순으로 페이지네이션(이전 < 1 2 3 4 5 > 다음)해 보여준다.
// 현재 페이지는 ?page= 쿼리로 관리해 뒤로가기/새로고침 시에도 위치가 유지된다.
function NewsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // 홈의 "전체 더보기" 등으로 진입할 때 스크롤이 이전 위치에 남지 않도록 맨 위에서 시작한다.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const sorted = [...seedArticles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))

  const rawPage = Number(searchParams.get('page') ?? '1')
  const page = Number.isInteger(rawPage) ? Math.min(Math.max(rawPage, 1), totalPages) : 1

  const pageArticles = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function goToPage(next: number) {
    setSearchParams(next === 1 ? {} : { page: String(next) })
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-bold text-ink">뉴스</h1>
      <p className="mt-1 text-xs text-muted">전체 기사를 최신순으로 보여드려요.</p>

      <div className="mt-6 space-y-3">
        {pageArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <nav aria-label="페이지 이동" className="mt-8 flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-primary-50 hover:text-ink disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent"
        >
          이전
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => goToPage(pageNumber)}
            aria-current={pageNumber === page ? 'page' : undefined}
            className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
              pageNumber === page
                ? 'bg-primary-600 font-semibold text-white'
                : 'text-muted hover:bg-primary-50 hover:text-ink'
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-primary-50 hover:text-ink disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent"
        >
          다음
        </button>
      </nav>
    </div>
  )
}

export default NewsPage
