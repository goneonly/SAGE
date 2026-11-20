import type { Level } from '../types/auth'

// 투자 이해도(레벨) 표기의 단일 출처 — 설정·회원가입·단어장·레벨업 제안이 모두 여기서 가져다 쓴다.
// 화면마다 "입문/중급/고급", "초보/중급/고급"처럼 다르게 부르지 않도록 한다.
export const LEVEL_NAME: Record<Level, string> = {
  beginner: '기초',
  intermediate: '성장',
  advanced: '심화',
}

/** 쉬운 단계부터 순서대로 */
export const LEVELS: Level[] = ['beginner', 'intermediate', 'advanced']
