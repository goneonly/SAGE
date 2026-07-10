import { useMemo } from 'react'
import { segmentByTerms } from '../features/paraphrase/termMatcher'
import type { Level } from '../types/auth'

interface HighlightTextProps {
  text: string
  level: Level
  /** 클릭 시 사전의 대표 용어를 올려보낸다 — 별칭('상장지수펀드')을 눌러도 대표 용어('ETF')로 정규화됨 */
  onTermClick: (term: string) => void
  // 이 문단에서 "처음 등장하므로 하이라이트해도 되는" 용어 집합. 상위에서
  // computeFirstOccurrenceTerms(features/paraphrase/firstOccurrence.ts)로 기사 전체를 문단
  // 순서대로 훑어 각 용어의 첫 등장 문단만 골라 내려준다. 넘기지 않으면(단독 사용)
  // 문단 내 모든 용어를 하이라이트 대상으로 본다.
  allowedTerms?: Set<string>
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
