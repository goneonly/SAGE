import { useMemo } from 'react'
import ArticleCard from './ArticleCard'
import { seedArticles } from './seedArticles'
import { getRecommendedArticles } from './recommend'
import { useWatchlistStore } from '../../lib/store/watchlistStore'

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
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-lg font-bold text-ink">추천 뉴스</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-ink">전체 뉴스</h2>
        <div className="space-y-3">
          {seedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
