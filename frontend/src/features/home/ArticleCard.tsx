import { Link } from 'react-router-dom'
import type { Article } from '../../types/article'
import { formatDateTimeShort, truncateText } from '../../lib/format'

// uniform=true 이면(추천 뉴스 그리드) 제목·요약 줄 수를 제한하고 카드 높이를 고정해
// 내용 길이와 무관하게 모든 블록을 동일한 크기로 유지한다. 기본(전체 뉴스 목록)은 자연 높이.
function ArticleCard({ article, uniform = false }: { article: Article; uniform?: boolean }) {
  return (
    <Link to={`/article/${article.id}`} className="block h-full">
      <article
        className={`rounded-xl border border-line bg-surface p-5 transition-all duration-300 hover:border-primary-600 hover:shadow-eco-hover-soft ${
          uniform ? 'flex h-44 flex-col' : ''
        }`}
      >
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>{article.source}</span>
          <span>·</span>
          <time dateTime={article.publishedAt}>{formatDateTimeShort(article.publishedAt)}</time>
        </div>
        <h3 className={`mt-2 font-semibold text-ink ${uniform ? 'line-clamp-2' : ''}`}>
          {article.title}
        </h3>
        <p className={`mt-1 text-sm text-muted ${uniform ? 'line-clamp-3' : ''}`}>
          {truncateText(article.body.split(/\n\s*\n/)[0], 60)}
        </p>
      </article>
    </Link>
  )
}

export default ArticleCard
