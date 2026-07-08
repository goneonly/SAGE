import type { Level } from '../../types/auth'
import { getHighlightRules, type HighlightRule } from './seedTerms'

// AI 판단 근거 엔진 — "이 자리의 이 단어가 설명이 필요한 금융 용어인가"를 판정한다.
// 판단 순서(각 단계가 하나의 근거):
//   1. 난이도 필터 — 사용자 레벨에서 하이라이트할 가치가 있는 용어만 규칙에 포함(getHighlightRules)
//   2. 표기 매칭 — 별칭 포함, 긴 표기 우선(같은 위치에서 '외국인 순매수' > '순매수')
//   3. 문맥 판별 — 영문 약어 경계 검사 + 다의어 blockedPrefixes 검사(isFinancialUsage)
// 렌더와 무관한 순수 함수로 두어 HighlightText(하이라이트)와
// computeFirstOccurrenceTerms(첫 등장 계산)가 항상 같은 판정을 공유한다.

export interface TextSegment {
  text: string
  /** 금융 용어로 판정된 경우 사전의 대표 용어(별칭이면 대표 용어로 정규화), 아니면 null */
  term: string | null
}

interface Matcher {
  regex: RegExp
  bySurface: Map<string, HighlightRule>
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 규칙은 정적(seed 사전)이므로 레벨별 정규식·표기 맵을 한 번만 만들어 재사용한다.
const matcherCache = new Map<Level, Matcher | null>()

function getMatcher(level: Level): Matcher | null {
  if (matcherCache.has(level)) return matcherCache.get(level) ?? null

  const rules = getHighlightRules(level)
  const matcher: Matcher | null =
    rules.length === 0
      ? null
      : {
          // 길이 내림차순으로 정렬돼 있어 같은 시작 위치에서는 항상 긴 표기가 이긴다.
          regex: new RegExp(rules.map((rule) => escapeRegExp(rule.surface)).join('|'), 'g'),
          bySurface: new Map(rules.map((rule) => [rule.surface, rule])),
        }
  matcherCache.set(level, matcher)
  return matcher
}

const ASCII_WORD = /^[A-Za-z0-9]+$/

// 매칭 지점의 앞뒤 문맥으로 "금융 용어로 쓰인 게 맞는지" 판정한다.
function isFinancialUsage(text: string, start: number, end: number, rule: HighlightRule): boolean {
  // 영문 약어(ETF, PER 등)가 더 긴 영단어·티커의 일부면 용어가 아님(예: 'SUPER' 속 'PER').
  if (ASCII_WORD.test(rule.surface)) {
    const prev = text[start - 1]
    const next = text[end]
    if ((prev && ASCII_WORD.test(prev)) || (next && ASCII_WORD.test(next))) return false
  }

  // 다의어 문맥 제외 — 차단 접두어가 (a) 용어에 직접 붙어 있거나('재조정', '상향조정')
  // (b) 바로 앞 어절 전체이면('상향 조정') 다른 의미로 판단한다. 어절 전체 일치를 요구하는
  // 이유는 '현재 조정 국면'의 '현재'가 '재'로 끝난다고 차단되는 오판을 막기 위해서다.
  if (rule.blockedPrefixes.length > 0) {
    const before = text.slice(0, start)
    const previousWord = before.trimEnd().split(/\s+/).pop() ?? ''
    if (rule.blockedPrefixes.some((prefix) => before.endsWith(prefix) || previousWord === prefix)) {
      return false
    }
  }

  return true
}

// 문단을 "일반 텍스트 | 판정된 용어" 조각의 나열로 분해한다.
export function segmentByTerms(text: string, level: Level): TextSegment[] {
  const matcher = getMatcher(level)
  if (!matcher) return [{ text, term: null }]

  const segments: TextSegment[] = []
  let cursor = 0

  for (const match of text.matchAll(matcher.regex)) {
    const surface = match[0]
    const start = match.index ?? 0
    const rule = matcher.bySurface.get(surface)
    if (!rule || !isFinancialUsage(text, start, start + surface.length, rule)) continue

    if (start > cursor) segments.push({ text: text.slice(cursor, start), term: null })
    segments.push({ text: surface, term: rule.term })
    cursor = start + surface.length
  }

  if (cursor < text.length) segments.push({ text: text.slice(cursor), term: null })
  return segments
}
