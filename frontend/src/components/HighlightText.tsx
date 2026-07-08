import { useMemo } from 'react'
import { segmentByTerms } from '../features/paraphrase/termMatcher'
import { getTermDifficulty, type TermDifficulty } from '../features/paraphrase/seedTerms'
import type { Level } from '../types/auth'

interface HighlightTextProps {
  text: string
  level: Level
  /** 클릭 시 사전의 대표 용어를 올려보낸다 — 별칭('상장지수펀드')을 눌러도 대표 용어('ETF')로 정규화됨 */
  onTermClick: (term: string) => void
  // 이 문단에서 "처음 등장하므로 하이라이트해도 되는" 용어 집합. 상위(computeFirstOccurrenceTerms)
  // 에서 기사 전체를 문단 순서대로 훑어 각 용어의 첫 등장 문단만 골라 내려준다. 넘기지 않으면
  // (단독 사용) 문단 내 모든 용어를 하이라이트 대상으로 본다.
  allowedTerms?: Set<string>
}

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

// 스마트 하이라이트 — termMatcher 가 금융 용어로 판정한 조각을 클릭 가능한 span 으로
// 감싼다(primary/100 배경 + primary/700 밑줄, PLAN.md §6). 어떤 용어를 하이라이트할지의
// 판단 근거(난이도·별칭·문맥)는 전부 termMatcher/seedTerms 쪽에 있다.
function HighlightText({ text, level, onTermClick, allowedTerms }: HighlightTextProps) {
  const segments = useMemo(() => segmentByTerms(text, level), [text, level])

  // 문단 내에서 같은 용어가 두 번 나올 때 두 번째부터를 걸러내는 로컬 집합.
  // 렌더 안에서 새로 만들어 이 렌더의 map 에서만 쓰므로 결정적이다(공유·재사용 없음).
  const usedInParagraph = new Set<string>()

  return (
    <>
      {segments.map((segment, index) => {
        const term = segment.term
        // 용어이고 + 이 문단이 첫 등장이며(allowedTerms) + 문단 내에서도 처음일 때만 버튼으로.
        if (term && (!allowedTerms || allowedTerms.has(term)) && !usedInParagraph.has(term)) {
          usedInParagraph.add(term)
          return (
            <button
              key={`term-${index}-${term}`}
              type="button"
              onClick={() => onTermClick(term)}
              className="mx-0.5 rounded bg-primary-100 px-0.5 text-primary-700 underline decoration-primary-700 decoration-2 underline-offset-2 hover:bg-primary-200"
            >
              {segment.text}
            </button>
          )
        }
        return <span key={`text-${index}`}>{segment.text}</span>
      })}
    </>
  )
}

export default HighlightText
