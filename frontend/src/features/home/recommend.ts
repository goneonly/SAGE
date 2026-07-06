import type { Article } from '../../types/article'

const TICKER_MATCH_SCORE = 10

// (a) 관심종목 매칭 개수 × 가중치 — 매칭되는 티커가 많을수록 점수가 높아진다.
function scoreArticle(article: Article, watchlistTickers: Set<string>): number {
  const matches = article.tickers.filter((ticker) => watchlistTickers.has(ticker)).length
  return matches * TICKER_MATCH_SCORE
}

// PLAN.md §8 Phase 5 — 임베딩 없이 규칙 기반으로 "추천 뉴스"를 정렬한다.
// (a) 관심종목 티커 겹침 점수 우선, (b) 동점이면 최신순(publishedAt desc)을 2차 기준으로 사용.
// watchlistTickers 는 매 렌더마다 zustand store에서 읽어 넘기므로, 관심 종목이 바뀌면
// (추가/삭제) 이 함수의 결과도 곧바로 다시 계산되어 반응형으로 갱신된다.
export function getRecommendedArticles(
  articles: Article[],
  watchlistTickers: string[],
  limit = 3,
): Article[] {
  const tickerSet = new Set(watchlistTickers)

  return [...articles]
    .sort((a, b) => {
      const scoreDiff = scoreArticle(b, tickerSet) - scoreArticle(a, tickerSet)
      if (scoreDiff !== 0) return scoreDiff
      return b.publishedAt.localeCompare(a.publishedAt)
    })
    .slice(0, limit)
}
