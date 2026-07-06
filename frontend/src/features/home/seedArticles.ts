import type { Article } from '../../types/article'

// Phase 1 하드코딩 시드 — PLAN.md §7 articles 테이블 shape과 동일하게 맞춰
// 나중에 실제 뉴스 fetch로 교체할 때 컴포넌트는 그대로 두면 되도록 함.
// 앞 3건은 "추천 뉴스"(AI 선정)로 취급, 전체는 "전체 뉴스" 피드로 노출.
export const seedArticles: Article[] = [
  {
    id: 'a1',
    source: '한국경제',
    title: '코스피, 외국인 매수세에 2650선 회복',
    body: '외국인 투자자들의 순매수가 이어지며 코스피 지수가 2650선을 회복했다. 반도체 대형주 중심으로 매수세가 집중됐다...',
    url: 'https://example.com/news/a1',
    publishedAt: '2026-07-06T08:12:00+09:00',
    tickers: ['005930', '000660'],
  },
  {
    id: 'a2',
    source: '매일경제',
    title: '금리 동결에도 은행주는 강세, 왜?',
    body: '한국은행이 기준금리를 동결했지만 은행주는 오히려 강세를 보였다. 순이자마진(NIM) 개선 기대감이 반영된 결과로 풀이된다...',
    url: 'https://example.com/news/a2',
    publishedAt: '2026-07-06T07:40:00+09:00',
    tickers: ['055550', '105560'],
  },
  {
    id: 'a3',
    source: '서울경제',
    title: '2차전지 업황 반등 신호, 개인 투자자 순매수 전환',
    body: '2차전지 관련주들의 업황 반등 기대감이 커지며 개인 투자자들의 순매수가 전환됐다. 증권가는 하반기 실적 개선을 점치고 있다...',
    url: 'https://example.com/news/a3',
    publishedAt: '2026-07-05T18:05:00+09:00',
    tickers: ['373220', '006400'],
  },
  {
    id: 'a4',
    source: '조선비즈',
    title: '환율 1320원대 등락, 수출주 영향은',
    body: '원/달러 환율이 1320원대에서 등락을 거듭하고 있다. 수출 비중이 높은 기업들의 실적에 미칠 영향에 관심이 쏠린다...',
    url: 'https://example.com/news/a4',
    publishedAt: '2026-07-05T15:20:00+09:00',
    tickers: [],
  },
  {
    id: 'a5',
    source: '이데일리',
    title: '개인 투자자, 이번 주 순매도 전환',
    body: '개인 투자자들이 이번 주 코스피 시장에서 순매도로 전환했다. 차익 실현 매물이 출회된 것으로 분석된다...',
    url: 'https://example.com/news/a5',
    publishedAt: '2026-07-05T11:02:00+09:00',
    tickers: [],
  },
  {
    id: 'a6',
    source: '한국경제',
    title: '반도체 업황, 하반기 회복 기대감 확산',
    body: '메모리 반도체 가격 상승세가 이어지며 하반기 업황 회복 기대감이 확산되고 있다. 주요 증권사들은 목표주가를 상향 조정했다...',
    url: 'https://example.com/news/a6',
    publishedAt: '2026-07-04T20:15:00+09:00',
    tickers: ['005930'],
  },
  {
    id: 'a7',
    source: '연합인포맥스',
    title: '공매도 재개 이후 변동성 확대',
    body: '공매도 재개 이후 일부 종목의 변동성이 확대되고 있다. 시장 전문가들은 단기 수급 요인이 크다고 설명한다...',
    url: 'https://example.com/news/a7',
    publishedAt: '2026-07-04T13:47:00+09:00',
    tickers: [],
  },
  {
    id: 'a8',
    source: '머니투데이',
    title: '배당주 투자 매력도 재조명, 배당수익률 4% 넘는 종목은',
    body: '저금리 기조 장기화 전망 속에 배당주 투자 매력이 재조명되고 있다. 배당수익률 4%를 넘는 종목들이 주목받는다...',
    url: 'https://example.com/news/a8',
    publishedAt: '2026-07-03T09:30:00+09:00',
    tickers: [],
  },
]

export const RECOMMENDED_ARTICLE_IDS = ['a1', 'a2', 'a3']

export function getRecommendedArticles(articles: Article[]): Article[] {
  return articles.filter((article) => RECOMMENDED_ARTICLE_IDS.includes(article.id))
}
