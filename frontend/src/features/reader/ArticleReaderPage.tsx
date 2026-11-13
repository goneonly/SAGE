import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import HighlightText from '../../components/HighlightText'
import { computeFirstOccurrenceTerms } from '../paraphrase/firstOccurrence'
import ParaphrasePanel from '../../components/ParaphrasePanel'
import { getArticleById } from '../home/seedArticles'
import { getParaphrase, peekParaphraseCache, type TermParaphrase } from '../../lib/api/paraphrase'
import { useAuthStore } from '../../lib/store/authStore'
import { useScrapStore } from '../../lib/store/scrapStore'
import { useLearningStore } from '../../lib/store/learningStore'
import { usePageTitle } from '../../lib/usePageTitle'
import Container from '../../components/ui/Container'
import { formatDateTimeLong } from '../../lib/format'

// 기사 상세 리더 — 이 제품의 심장(PLAN.md §5). 스마트 하이라이트된 용어를 클릭하면
// 페이지 이동 없이 ParaphrasePanel 이 열려 설명을 보여준다(PLAN.md §1 원칙 1).
function ArticleReaderPage() {
  const { id } = useParams<{ id: string }>()
  const article = id ? getArticleById(id) : undefined
  usePageTitle(article?.title)
  const level = useAuthStore((state) => state.user?.level ?? 'beginner')
  const isScrapped = useScrapStore((state) => state.entries.some((entry) => entry.articleId === id))
  const toggleScrap = useScrapStore((state) => state.toggleScrap)

  const recordTermView = useLearningStore((state) => state.recordTermView)
  const recordArticleRead = useLearningStore((state) => state.recordArticleRead)
  const isReadToday = useLearningStore(
    (state) => id !== undefined && state.today.articleIds.includes(id),
  )

  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [paraphrase, setParaphrase] = useState<TermParaphrase | null>(null)

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

  // 읽기 완료 판정 — 본문 끝(원본 기사 링크 영역)이 화면에 들어오면 오늘의 목표에 반영한다.
  // 짧은 기사는 열자마자 끝이 보이므로 바로 읽은 것으로 친다.
  const articleEndRef = useRef<HTMLDivElement>(null)
  const readArticleId = article?.id
  useEffect(() => {
    const target = articleEndRef.current
    if (!target || !readArticleId) return
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        recordArticleRead(readArticleId)
        observer.disconnect()
      }
    })
    observer.observe(target)
    return () => observer.disconnect()
  }, [readArticleId, recordArticleRead])

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
    recordTermView(term, articleId)

    const cached = peekParaphraseCache(term, level, articleId)
    if (cached) {
      setParaphrase(cached)
      setIsLoading(false)
      return
    }

    setParaphrase(null)
    setIsLoading(true)
    try {
      const result = await getParaphrase(term, level, articleId)
      if (requestIdRef.current === requestId) {
        setParaphrase(result)
        setIsLoading(false)
      }
    } catch {
      // 실패해도 패널을 죽이지 않고 안내 문구로 대체 — 용어를 다시 클릭하면 재시도된다
      if (requestIdRef.current === requestId) {
        setParaphrase({
          explanation: '설명을 불러오지 못했어요. 용어를 다시 클릭해 재시도해 주세요.',
          impact: null,
        })
        setIsLoading(false)
      }
    }
  }

  function handleToggleScrap() {
    toggleScrap(scrapPayload)
  }

  return (
    // lg+ 에서 설명 패널(w-96, 화면 우측 고정)이 열리면 우측 바(w-64)를 덮고도 본문 쪽으로
    // 8rem(= 24rem − 16rem) 더 들어오므로, 그만큼 오른쪽 여백을 비워
    // 본문이 패널 밑으로 들어가지 않게 한다 — "읽는 흐름 유지"(PLAN.md §1 원칙 1)
    <div className={isPanelOpen ? 'lg:pr-32' : undefined}>
      <Container size="md">
        <Link to="/" className="text-sm text-primary-600 hover:underline">
          ← 홈으로
        </Link>

        <header className="mt-4 flex items-start justify-between gap-4 border-b border-line pb-4">
          <div>
            <h1 className="text-2xl font-bold text-ink">{article.title}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted">
              <span>{article.source}</span>
              <span>·</span>
              <time dateTime={article.publishedAt}>{formatDateTimeLong(article.publishedAt)}</time>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleScrap}
            className={`shrink-0 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
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
        <div ref={articleEndRef} className="mt-8 border-t border-line pt-4">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-600 hover:underline"
          >
            원본 기사 보기 ({article.source}) →
          </a>
          {isReadToday && (
            <p className="mt-2 text-xs text-muted" role="status">
              읽기 완료 — 오늘의 목표에 반영됐어요.
            </p>
          )}
        </div>

        <ParaphrasePanel
          isOpen={isPanelOpen}
          term={selectedTerm}
          level={level}
          isLoading={isLoading}
          explanation={paraphrase?.explanation ?? null}
          impact={paraphrase?.impact ?? null}
          onClose={() => setIsPanelOpen(false)}
        />
      </Container>
    </div>
  )
}

export default ArticleReaderPage
