import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ArticleCard from '../home/ArticleCard'
import { seedArticles } from '../home/seedArticles'
import { usePageTitle } from '../../lib/usePageTitle'
import type { Article } from '../../types/article'
import Container from '../../components/ui/Container'
import PageTitle from '../../components/ui/PageTitle'
import EmptyState from '../../components/ui/EmptyState'

const PAGE_SIZE = 10

// 상단바 검색(?q=)과 공유하는 매칭 규칙 — 제목·본문·언론사·종목코드에서 대소문자 무시 검색.
function matchesQuery(article: Article, query: string): boolean {
  const lowered = query.toLowerCase()
  return (
    article.title.toLowerCase().includes(lowered) ||
    article.body.toLowerCase().includes(lowered) ||
    article.source.toLowerCase().includes(lowered) ||
    article.tickers.some((ticker) => ticker.includes(query))
  )
}

// 뉴스 화면 — 전체 기사를 최신순으로 페이지네이션(이전 < 1 2 3 4 5 > 다음)해 보여준다.
// 현재 페이지는 ?page= 쿼리로, 검색어는 상단바가 넘겨주는 ?q= 쿼리로 관리해
// 뒤로가기/새로고침 시에도 상태가 유지된다.
function NewsPage() {
  usePageTitle('뉴스')
  const [searchParams, setSearchParams] = useSearchParams()
  const query = (searchParams.get('q') ?? '').trim()

  // 진입하거나 검색어가 바뀔 때 스크롤이 이전 위치에 남지 않도록 맨 위에서 시작한다.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [query])

  const sorted = [...seedArticles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  const filtered = query ? sorted.filter((article) => matchesQuery(article, query)) : sorted
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const rawPage = Number(searchParams.get('page') ?? '1')
  const page = Number.isInteger(rawPage) ? Math.min(Math.max(rawPage, 1), totalPages) : 1

  const pageArticles = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // 페이지 이동 시 검색어(q)는 유지한다. 기본값(1페이지, 검색 없음)은 쿼리에서 생략.
  function goToPage(next: number) {
    const params: Record<string, string> = {}
    if (query) params.q = query
    if (next !== 1) params.page = String(next)
    setSearchParams(params)
    window.scrollTo({ top: 0 })
  }

  return (
    <Container size="lg">
      <PageTitle
        title="뉴스"
        description={
          query ? (
            <span className="flex items-center gap-2">
              &ldquo;{query}&rdquo; 검색 결과 {filtered.length}건
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="text-primary-600 hover:underline"
              >
                검색 초기화
              </button>
            </span>
          ) : (
            '전체 기사를 최신순으로 보여드려요.'
          )
        }
      />

      <div className="mt-6 space-y-3">
        {pageArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
        {query && filtered.length === 0 && (
          <EmptyState
            icon="🔍"
            title={`"${query}"에 해당하는 기사가 없어요`}
            description="맞춤법을 확인하거나 종목코드·언론사명 등 다른 검색어로 시도해 보세요."
            action={
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="inline-block rounded-full border border-primary-600 px-5 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-50"
              >
                전체 기사 보기
              </button>
            }
          />
        )}
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
    </Container>
  )
}

export default NewsPage
