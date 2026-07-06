import type { Level } from './auth'

// PLAN.md §7 user_vocab(id, user_id, term, explanation, created_at) — user_id는 클라이언트에
// 로그인 사용자가 한 명뿐이라 생략. level 은 같은 용어라도 난이도별 설명이 다르므로(Phase 3)
// 중복 판별 키(term+level)의 일부로 추가했다.
export interface VocabEntry {
  id: string
  term: string
  explanation: string
  level: Level
  createdAt: string
}
