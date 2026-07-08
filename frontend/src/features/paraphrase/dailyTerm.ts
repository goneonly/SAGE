import { seedTerms, type SeedTerm } from './seedTerms'

// 문자열(날짜)을 안정적인 정수로 매핑 — 같은 날짜 문자열은 항상 같은 숫자가 나온다.
function hashDateString(dateKey: string): number {
  let hash = 0
  for (let index = 0; index < dateKey.length; index += 1) {
    hash = (hash * 31 + dateKey.charCodeAt(index)) >>> 0
  }
  return hash
}

// 오늘의 주식 단어 후보 — 상식 어휘(everyday, 예: 반도체)는 "오늘의 용어"로 보여줘도
// 학습 가치가 없으므로 로테이션에서 제외한다(하이라이트 제외 기준과 동일한 판단 근거).
const dailyTermPool: SeedTerm[] = seedTerms.filter(
  (entry) => (entry.difficulty ?? 'standard') !== 'everyday',
)

// 오늘의 주식 단어 — PLAN.md §7 daily_terms(term, explanation_by_level, date) 흉내.
// 매 렌더마다 무작위로 고르면 새로고침할 때마다 단어가 바뀌어버리므로, "오늘 날짜"
// 문자열을 해시해 인덱스를 정하면 하루 동안은 항상 같은 용어가 나오고 날짜가
// 바뀌면 자연스럽게 다른 용어로 로테이션된다.
export function getDailyTerm(date: Date = new Date()): SeedTerm {
  const dateKey = date.toISOString().slice(0, 10) // YYYY-MM-DD
  const index = hashDateString(dateKey) % dailyTermPool.length
  return dailyTermPool[index]
}
