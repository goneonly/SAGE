import { useMemo } from 'react'
import { getHighlightTermList } from '../features/paraphrase/seedTerms'
import type { Level } from '../types/auth'

interface HighlightTextProps {
  text: string
  level: Level
  onTermClick: (term: string) => void
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildTermRegex(terms: string[]): RegExp | null {
  if (terms.length === 0) return null
  return new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'g')
}

// 스마트 하이라이트 — seed 금융 용어 사전과 일치하는 부분을 클릭 가능한 span 으로
// 감싼다(primary/100 배경 + primary/700 밑줄, PLAN.md §6). 하이라이트 대상 자체가
// level 에 따라 달라진다(getHighlightTermList — advanced 는 기초 용어 일부 제외).
// 클릭하면 onTermClick 으로 매칭된 용어 원문을 그대로 올려보낸다.
function HighlightText({ text, level, onTermClick }: HighlightTextProps) {
  const terms = useMemo(() => getHighlightTermList(level), [level])
  const termSet = useMemo(() => new Set(terms), [terms])
  const regex = useMemo(() => buildTermRegex(terms), [terms])

  if (!regex) {
    return <>{text}</>
  }

  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, index) =>
        termSet.has(part) ? (
          <button
            key={`term-${index}-${part}`}
            type="button"
            onClick={() => onTermClick(part)}
            className="mx-0.5 rounded bg-primary-100 px-0.5 text-primary-700 underline decoration-primary-700 decoration-2 underline-offset-2 hover:bg-primary-200"
          >
            {part}
          </button>
        ) : (
          <span key={`text-${index}`}>{part}</span>
        ),
      )}
    </>
  )
}

export default HighlightText
