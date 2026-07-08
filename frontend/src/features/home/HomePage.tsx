import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import ArticleCard from './ArticleCard'
import { seedArticles } from './seedArticles'
import { getRecommendedArticles } from './recommend'
import { useWatchlistStore } from '../../lib/store/watchlistStore'

// 홈의 "전체 뉴스"는 최신 몇 건만 미리보기로 보여주고,
// 나머지는 "전체 더보기" 버튼으로 뉴스 화면(/news, 페이지네이션)에서 이어 본다.
const HOME_NEWS_PREVIEW_COUNT = 5

function HomePage() {
  const watchlistItems = useWatchlistStore((state) => state.items)
  const watchlistTickers = useMemo(
    () => watchlistItems.map((item) => item.ticker),
    [watchlistItems],
  )

  // 관심 종목이 바뀌면 watchlistTickers 가 바뀌고, 이 컴포넌트가 다시 렌더링되며
  // 추천 목록도 그때그때 다시 계산된다(한 번 계산해 고정하는 게 아님).
  const recommended = getRecommendedArticles(seedArticles, watchlistTickers)

  return (
    <div>
      <div className="mb-12 space-y-8">
        <section>
          <h2 className="mb-3 text-lg font-bold text-ink">추천 뉴스</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((article) => (
              <ArticleCard key={article.id} article={article} uniform />
            ))}
          </div>
        </section>
      </div>
      <section>
        <h2 className="mb-3 text-lg font-bold text-ink">전체 뉴스</h2>
        <div className="space-y-3">
          {[...seedArticles]
            .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
            .slice(0, HOME_NEWS_PREVIEW_COUNT)
            .map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
        </div>
        <Link
          to="/news"
          className="mt-4 block w-full rounded-lg border border-line bg-surface py-2.5 text-center text-sm font-medium text-muted transition-colors hover:border-primary-600 hover:text-primary-600"
        >
          전체 더보기
        </Link>
      </section>
    </div>
  )
}

export default HomePage
