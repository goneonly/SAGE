import ArticleCard from './ArticleCard'
import { getRecommendedArticles, seedArticles } from './seedArticles'

function HomePage() {
  const recommended = getRecommendedArticles(seedArticles)

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
