import type { Level } from '../../types/auth'

// 자동 레벨업 제안 — 마스터한 용어가 기준 개수를 넘으면 다음 투자 이해도로 올려 보길 제안한다.
// 제안일 뿐 자동으로 바꾸지는 않는다(설명 난이도가 갑자기 달라지면 흐름이 끊기므로 사용자가 결정).
const NEXT_LEVEL: Partial<Record<Level, Level>> = {
  beginner: 'intermediate',
  intermediate: 'advanced',
}

/** 현재 레벨에서 다음 레벨을 제안하기 위해 필요한 마스터 용어 수 */
export const LEVEL_UP_MASTERED_COUNT: Partial<Record<Level, number>> = {
  beginner: 5,
  intermediate: 12,
}

/** 지금 제안할 목표 레벨. 조건 미달이거나 이미 "나중에"로 닫았으면 null. */
export function getLevelUpTarget(
  level: Level,
  masteredCount: number,
  dismissed: Level[],
): Level | null {
  const target = NEXT_LEVEL[level]
  const required = LEVEL_UP_MASTERED_COUNT[level]
  if (!target || required === undefined) return null
  if (masteredCount < required || dismissed.includes(target)) return null
  return target
}
