import type { Level } from '../../types/auth'

// PLAN.md §7 term_cache shape(term, level, explanation)을 흉내낸 seed 금융 용어 사전.
// 레벨 시스템은 Phase 3에서 붙는다 — 지금은 모든 항목을 'beginner' 설명 하나로 둔다.
// HighlightText 가 이 목록으로 기사 본문을 스캔하고, lib/api/paraphrase.ts 가 캐시 미스 시 이 설명을 반환한다.
export interface SeedTerm {
  term: string
  level: Level
  explanation: string
}

export const seedTerms: SeedTerm[] = [
  {
    term: '코스피',
    level: 'beginner',
    explanation:
      '한국 종합주가지수(KOSPI). 유가증권시장에 상장된 대표 기업들의 주가를 종합해 산출하는 지수예요.',
  },
  {
    term: '코스닥',
    level: 'beginner',
    explanation: '중소·벤처기업 중심으로 구성된 국내 주식시장 지수예요.',
  },
  {
    term: 'PER',
    level: 'beginner',
    explanation:
      '주가수익비율. 주가를 주당순이익(EPS)으로 나눈 값으로, 주가가 이익 대비 몇 배인지 보여줘요. 낮을수록 저평가로 볼 수 있어요.',
  },
  {
    term: 'PBR',
    level: 'beginner',
    explanation:
      '주가순자산비율. 주가를 주당순자산(BPS)으로 나눈 값으로, 1보다 낮으면 회사가 가진 자산 가치보다 주가가 싸다는 뜻이에요.',
  },
  {
    term: '시가총액',
    level: 'beginner',
    explanation:
      '상장 주식 수에 현재 주가를 곱한 값. 그 기업의 시장 가치(몸값)를 나타내는 지표예요.',
  },
  {
    term: '공매도',
    level: 'beginner',
    explanation:
      '주식을 빌려서 먼저 판 뒤, 주가가 떨어지면 싼 값에 되사서 갚아 차익을 얻는 투자 기법이에요.',
  },
  {
    term: '배당수익률',
    level: 'beginner',
    explanation: '주가 대비 연간 배당금의 비율. 배당금을 주가로 나눠 100을 곱해 계산해요.',
  },
  {
    term: '순이자마진',
    level: 'beginner',
    explanation:
      'NIM(Net Interest Margin). 은행이 자산 운용으로 벌어들인 이자수익에서 조달 비용을 뺀 뒤 운용자산으로 나눈 수익성 지표예요.',
  },
  {
    term: '기준금리',
    level: 'beginner',
    explanation: '한국은행이 정하는 정책금리. 시중 대출·예금 금리 전반의 기준이 돼요.',
  },
  {
    term: '환율',
    level: 'beginner',
    explanation: '한 나라 통화와 다른 나라 통화를 교환하는 비율이에요. 예: 원/달러 환율.',
  },
  {
    term: '외국인 순매수',
    level: 'beginner',
    explanation:
      '외국인 투자자가 일정 기간 매수한 금액에서 매도한 금액을 뺀 값이 양수(플러스)인 상태예요.',
  },
  {
    term: '개인 순매도',
    level: 'beginner',
    explanation: '개인 투자자의 매도 금액이 매수 금액보다 많은 상태예요.',
  },
  {
    term: '2차전지',
    level: 'beginner',
    explanation:
      '충전해서 반복적으로 쓸 수 있는 배터리. 전기차와 에너지저장장치(ESS)의 핵심 부품이에요.',
  },
  {
    term: '반도체',
    level: 'beginner',
    explanation:
      '전자기기의 두뇌 역할을 하는 핵심 부품. 메모리(D램·낸드)와 비메모리(시스템반도체)로 나뉘어요.',
  },
  {
    term: '목표주가',
    level: 'beginner',
    explanation: '증권사가 향후 일정 기간 내 도달할 것으로 예상하는 주가 수준이에요.',
  },
  {
    term: '변동성',
    level: 'beginner',
    explanation: '자산 가격이 오르내리는 정도. 변동성이 크면 수익과 손실의 폭도 함께 커져요.',
  },
  {
    term: '차익실현',
    level: 'beginner',
    explanation: '보유 자산의 가격이 오른 뒤 이를 매도해 이익을 확정하는 행위예요.',
  },
  {
    term: '실적',
    level: 'beginner',
    explanation: '기업이 일정 기간 동안 거둔 매출·이익 등 경영 성과를 말해요.',
  },
]

// HighlightText 의 스캔 대상 — 길이 내림차순으로 정렬해 긴 용어가 먼저 매칭되도록 한다.
export const SEED_TERM_LIST: string[] = seedTerms
  .map((entry) => entry.term)
  .sort((a, b) => b.length - a.length)

export function findSeedTerm(term: string): SeedTerm | undefined {
  return seedTerms.find((entry) => entry.term === term)
}
