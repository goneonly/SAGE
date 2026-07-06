import type { Article } from '../../types/article'

function formatDate(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function teaser(body: string, length = 60): string {
  return body.length > length ? `${body.slice(0, length)}…` : body
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="rounded-lg border border-line bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-2 text-xs text-muted">
        <span>{article.source}</span>
        <span>·</span>
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      </div>
      <h3 className="mt-2 font-semibold text-ink">{article.title}</h3>
      <p className="mt-1 text-sm text-muted">{teaser(article.body)}</p>
    </article>
  )
}

export default ArticleCard
