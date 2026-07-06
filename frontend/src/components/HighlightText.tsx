import { useMemo } from 'react'
import { getHighlightTermList } from '../features/paraphrase/seedTerms'
import type { Level } from '../types/auth'

interface HighlightTextProps {
  text: string
  level: Level
  onTermClick: (term: string) => void
  // 이 문단에서 "처음 등장하므로 하이라이트해도 되는" 용어 집합. 상위(computeFirstOccurrenceTerms)
  // 에서 기사 전체를 문단 순서대로 훑어 각 용어의 첫 등장 문단만 골라 내려준다. 넘기지 않으면
  // (단독 사용) 문단 내 모든 용어를 하이라이트 대상으로 본다.
  allowedTerms?: Set<string>
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildTermRegex(terms: string[]): RegExp | null {
  if (terms.length === 0) return null
  return new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'g')
}

// 기사 전체에서 각 용어의 "첫 등장 문단"을 미리 계산한다(PLAN.md §6 가독성 — 같은 용어가
// 기사 안에 여러 번 나와도 첫 등장 한 번만 하이라이트). 반환값은 문단별 허용 용어 집합 배열로,
// HighlightText 의 매칭과 동일한 정규식(길이 내림차순 우선)을 써서 실제 매칭될 용어만 센다.
// 렌더 밖(useMemo)에서 순수하게 계산하므로 StrictMode 이중 렌더에도 안전하다.
export function computeFirstOccurrenceTerms(paragraphs: string[], level: Level): Set<string>[] {
  const terms = getHighlightTermList(level)
  const regex = buildTermRegex(terms)
  if (!regex) return paragraphs.map(() => new Set<string>())

  const seen = new Set<string>()
  return paragraphs.map((paragraph) => {
    const allowed = new Set<string>()
    for (const match of paragraph.matchAll(regex)) {
      const term = match[0]
      if (!seen.has(term)) {
        seen.add(term)
        allowed.add(term)
      }
    }
    return allowed
  })
}

// 스마트 하이라이트 — seed 금융 용어 사전과 일치하는 부분을 클릭 가능한 span 으로
// 감싼다(primary/100 배경 + primary/700 밑줄, PLAN.md §6). 하이라이트 대상 자체가
// level 에 따라 달라진다(getHighlightTermList — advanced 는 기초 용어 일부 제외).
// 클릭하면 onTermClick 으로 매칭된 용어 원문을 그대로 올려보낸다.
function HighlightText({ text, level, onTermClick, allowedTerms }: HighlightTextProps) {
  const terms = useMemo(() => getHighlightTermList(level), [level])
  const termSet = useMemo(() => new Set(terms), [terms])
  const regex = useMemo(() => buildTermRegex(terms), [terms])

  if (!regex) {
    return <>{text}</>
  }

  // 문단 내에서 같은 용어가 두 번 나올 때 두 번째부터를 걸러내는 로컬 집합.
  // 렌더 안에서 새로 만들어 이 렌더의 map 에서만 쓰므로 결정적이다(공유·재사용 없음).
  const usedInParagraph = new Set<string>()
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, index) => {
        // 용어이고 + 이 문단이 첫 등장이며(allowedTerms) + 문단 내에서도 처음일 때만 버튼으로.
        const canHighlight = !allowedTerms || allowedTerms.has(part)
        if (termSet.has(part) && canHighlight && !usedInParagraph.has(part)) {
          usedInParagraph.add(part)
          return (
            <button
              key={`term-${index}-${part}`}
              type="button"
              onClick={() => onTermClick(part)}
              className="mx-0.5 rounded bg-primary-100 px-0.5 text-primary-700 underline decoration-primary-700 decoration-2 underline-offset-2 hover:bg-primary-200"
            >
              {part}
            </button>
          )
        }
        return <span key={`text-${index}`}>{part}</span>
      })}
    </>
  )
}

export default HighlightText
