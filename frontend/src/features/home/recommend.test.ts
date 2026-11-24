import { describe, expect, it } from 'vitest'
import type { Article } from '../../types/article'
import { getRecommendedArticles } from './recommend'

// 추천 뉴스 정렬 규칙(PLAN.md §8 Phase 5): 관심 종목 겹침 점수 우선, 동점이면 최신순, 최대 limit 건.
function article(id: string, publishedAt: string, tickers: string[]): Article {
  return { id, source: '테스트', title: id, body: '', url: '', publishedAt, tickers }
}

const ARTICLES = [
  article('old-match-1', '2026-07-01T09:00:00+09:00', ['005930']),
  article('new-none', '2026-07-06T09:00:00+09:00', []),
  article('mid-match-2', '2026-07-03T09:00:00+09:00', ['005930', '000660']),
  article('newer-none', '2026-07-05T09:00:00+09:00', ['035420']),
]

describe('getRecommendedArticles', () => {
  it('관심 종목과 많이 겹치는 기사가 먼저 온다', () => {
    const result = getRecommendedArticles(ARTICLES, ['005930', '000660'])
    expect(result.map((item) => item.id).slice(0, 2)).toEqual(['mid-match-2', 'old-match-1'])
  })

  it('점수가 같으면 최신 기사가 먼저 온다', () => {
    const result = getRecommendedArticles(ARTICLES, [])
    expect(result.map((item) => item.id)).toEqual([
      'new-none',
      'newer-none',
      'mid-match-2',
      'old-match-1',
    ])
  })

  it('limit 개수만큼만 돌려주고 원본 배열은 바꾸지 않는다', () => {
    const before = ARTICLES.map((item) => item.id)
    expect(getRecommendedArticles(ARTICLES, ['005930'], 2)).toHaveLength(2)
    expect(ARTICLES.map((item) => item.id)).toEqual(before)
  })
})
