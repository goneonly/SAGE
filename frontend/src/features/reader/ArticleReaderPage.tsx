import { useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import HighlightText, { computeFirstOccurrenceTerms } from '../../components/HighlightText'
import ParaphrasePanel from '../../components/ParaphrasePanel'
import { getArticleById } from '../home/seedArticles'
import { getParaphrase, peekParaphraseCache } from '../../lib/api/paraphrase'
import { useAuthStore } from '../../lib/store/authStore'
import { useScrapStore } from '../../lib/store/scrapStore'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 기사 상세 리더 — 이 제품의 심장(PLAN.md §5). 스마트 하이라이트된 용어를 클릭하면
// 페이지 이동 없이 ParaphrasePanel 이 열려 설명을 보여준다(PLAN.md §1 원칙 1).
function ArticleReaderPage() {
  const { id } = useParams<{ id: string }>()
  const article = id ? getArticleById(id) : undefined
  const level = useAuthStore((state) => state.user?.level ?? 'beginner')
  const isScrapped = useScrapStore((state) => state.entries.some((entry) => entry.articleId === id))
  const toggleScrap = useScrapStore((state) => state.toggleScrap)

  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [explanation, setExplanation] = useState<string | null>(null)

  // 같은 용어를 연달아 빠르게 클릭했을 때 먼저 보낸 요청의 응답이 늦게 도착해
  // 나중 요청의 결과를 덮어쓰지 않도록 요청 순번을 추적한다.
  const requestIdRef = useRef(0)

  const paragraphs = useMemo(
    () => (article?.body ?? '').split(/\n\s*\n/).filter((paragraph) => paragraph.trim().length > 0),
    [article?.body],
  )

  // 문단마다 HighlightText 가 독립 실행되므로, 기사 전체를 순서대로 훑어 각 용어의
  // 첫 등장 문단만 하이라이트 대상으로 정해 문단별 허용 집합을 내려준다(PLAN.md §6 가독성).
  const allowedTermsByParagraph = useMemo(
    () => computeFirstOccurrenceTerms(paragraphs, level),
    [paragraphs, level],
  )

  if (!article) {
    return <Navigate to="/" replace />
  }

  const articleId = article.id
  const scrapPayload = {
    id: article.id,
    title: article.title,
    source: article.source,
    publishedAt: article.publishedAt,
  }

  async function handleTermClick(term: string) {
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    setSelectedTerm(term)
    setIsPanelOpen(true)

    const cached = peekParaphraseCache(term, level, articleId)
    if (cached) {
      setExplanation(cached)
      setIsLoading(false)
      return
    }

    setExplanation(null)
    setIsLoading(true)
    const result = await getParaphrase(term, level, articleId)
    if (requestIdRef.current === requestId) {
      setExplanation(result)
      setIsLoading(false)
    }
  }

  function handleToggleScrap() {
    toggleScrap(scrapPayload)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/" className="text-sm text-primary-600 hover:underline">
        ← 홈으로
      </Link>

      <header className="mt-4 flex items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">{article.title}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted">
            <span>{article.source}</span>
            <span>·</span>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </div>
        </div>
        <button
          type="button"
          onClick={handleToggleScrap}
          className={`shrink-0 rounded-md border px-3 py-1.5 text-sm font-medium transition ${
            isScrapped
              ? 'border-primary-600 bg-primary-50 text-primary-700'
              : 'border-line text-muted hover:bg-primary-50 hover:text-ink'
          }`}
        >
          {isScrapped ? '스크랩 완료' : '스크랩'}
        </button>
      </header>

      <div className="mt-6 space-y-4 text-base leading-relaxed text-ink">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>
            <HighlightText
              text={paragraph}
              level={level}
              onTermClick={handleTermClick}
              allowedTerms={allowedTermsByParagraph[index]}
            />
          </p>
        ))}
      </div>

      {/* AI 재구성 기사 아래로 구분선 + 원본 기사 링크(PLAN.md §5 출처 명시) */}
      <div className="mt-8 border-t border-line pt-4">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary-600 hover:underline"
        >
          원본 기사 보기 ({article.source}) →
        </a>
      </div>

      <ParaphrasePanel
        isOpen={isPanelOpen}
        term={selectedTerm}
        level={level}
        isLoading={isLoading}
        explanation={explanation}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  )
}

export default ArticleReaderPage
