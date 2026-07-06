// TODO(backend): 실제 AI 코멘트는 FastAPI가 Anthropic API(Claude)를 호출해 생성한 결과로 대체
// (PLAN.md §3~4 아키텍처). 지금은 정적 mock 문구 — LLM 호출 없음.
export interface InsightCard {
  id: string
  theme: string // 종목명 또는 테마명
  ticker?: string
  comment: string
  generatedAt: string
}

export const mockInsights: InsightCard[] = [
  {
    id: 'i1',
    theme: '삼성전자',
    ticker: '005930',
    comment:
      '반도체 업황 회복 기대감이 주가에 선반영되는 흐름입니다. 다음 분기 실적 발표에서 메모리 가격 상승분이 얼마나 반영될지가 단기 방향성의 핵심 변수로 보입니다.',
    generatedAt: '2026-07-06T09:00:00+09:00',
  },
  {
    id: 'i2',
    theme: '2차전지',
    comment:
      '전기차 수요 회복 신호와 원자재 가격 안정이 겹치며 업황 반등 기대가 커지고 있습니다. 다만 완성차 재고 조정 속도에 따라 관련주의 변동성이 커질 수 있어 분할 접근이 유효해 보입니다.',
    generatedAt: '2026-07-06T09:00:00+09:00',
  },
  {
    id: 'i3',
    theme: '은행주',
    comment:
      '기준금리 동결 국면에서도 순이자마진 개선 기대로 은행주 강세가 이어지고 있습니다. 배당수익률 매력까지 더해져 저평가 매수세가 유입되는 모습입니다.',
    generatedAt: '2026-07-05T09:00:00+09:00',
  },
  {
    id: 'i4',
    theme: 'SK하이닉스',
    ticker: '000660',
    comment:
      'AI向 고대역폭메모리(HBM) 수요가 레거시 메모리 사이클과 별도로 움직이는 구조적 변수로 부각되고 있습니다. 단기 급등에 따른 변동성 확대 가능성은 유의할 필요가 있습니다.',
    generatedAt: '2026-07-05T09:00:00+09:00',
  },
  {
    id: 'i5',
    theme: '원/달러 환율',
    comment:
      '환율이 1320원대에서 등락을 거듭하며 수출주 실적 변수로 작용하고 있습니다. 환헤지 비중이 낮은 기업일수록 환율 변동에 따른 실적 민감도가 크다는 점을 참고할 만합니다.',
    generatedAt: '2026-07-04T09:00:00+09:00',
  },
]
