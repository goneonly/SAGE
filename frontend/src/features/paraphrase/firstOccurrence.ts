import { segmentByTerms } from './termMatcher'
import { getTermDifficulty, type TermDifficulty } from './seedTerms'
import type { Level } from '../../types/auth'

// 사전이 커져도 화면이 형광펜 범벅이 되지 않도록 한 문단에서 하이라이트할 용어 수의 상한.
const MAX_HIGHLIGHTS_PER_PARAGRAPH = 4
// 상한 초과 시 어떤 용어를 남길지의 우선순위 — 설명 가치가 큰(더 어려운) 용어부터.
const DIFFICULTY_PRIORITY: Record<TermDifficulty, number> = { standard: 2, basic: 1, everyday: 0 }

// 기사 전체에서 각 용어의 "첫 등장 문단"을 미리 계산한다(PLAN.md §6 가독성 — 같은 용어가
// 기사 안에 여러 번 나와도 첫 등장 한 번만 하이라이트). 판정은 termMatcher(판단 근거 엔진)와
// 완전히 동일한 segmentByTerms 를 쓰므로 실제 하이라이트될 용어만 센다. 별칭은 대표 용어로
// 정규화되어, '상장지수펀드'가 먼저 나오면 뒤따르는 'ETF' 표기는 재등장으로 취급된다.
// 문단당 후보가 상한을 넘으면 난이도 높은 용어 → 먼저 등장한 용어 순으로 남기고,
// 밀려난 용어는 "본 것"으로 치지 않아 다음 문단에서 다시 후보가 될 수 있다.
// 렌더 밖(useMemo)에서 순수하게 계산하므로 StrictMode 이중 렌더에도 안전하다.
export function computeFirstOccurrenceTerms(paragraphs: string[], level: Level): Set<string>[] {
  const seen = new Set<string>()
  return paragraphs.map((paragraph) => {
    const candidates: { term: string; order: number }[] = []
    for (const segment of segmentByTerms(paragraph, level)) {
      if (
        segment.term &&
        !seen.has(segment.term) &&
        !candidates.some((candidate) => candidate.term === segment.term)
      ) {
        candidates.push({ term: segment.term, order: candidates.length })
      }
    }

    const kept = candidates
      .sort(
        (a, b) =>
          DIFFICULTY_PRIORITY[getTermDifficulty(b.term)] -
            DIFFICULTY_PRIORITY[getTermDifficulty(a.term)] || a.order - b.order,
      )
      .slice(0, MAX_HIGHLIGHTS_PER_PARAGRAPH)

    const allowed = new Set(kept.map((candidate) => candidate.term))
    for (const candidate of kept) seen.add(candidate.term)
    return allowed
  })
}
