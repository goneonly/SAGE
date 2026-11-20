import type { TermProgress } from '../../lib/store/learningStore'

// 용어 숙련도 3단계 — 퀴즈 없이 "얼마나 자주 만났는가 + 스스로 안다고 확인했는가"로 판정한다.
//   seen(처음 봄):      설명을 한 번 열어 봄
//   learning(익히는 중): 서로 다른 기사 2곳 이상에서 열어 봤거나, 단어장에 저장함
//   mastered(마스터):    사용자가 "이제 알아요"로 직접 확인함(언제든 되돌릴 수 있음)
export type MasteryStage = 'seen' | 'learning' | 'mastered'

const LEARNING_ARTICLE_COUNT = 2

export const MASTERY_LABEL: Record<MasteryStage, string> = {
  seen: '처음 봄',
  learning: '익히는 중',
  mastered: '마스터',
}

/** 한 번도 열어 보지 않았고 저장하지도 않은 용어는 null. */
export function getMasteryStage(
  progress: TermProgress | undefined,
  isSaved: boolean,
): MasteryStage | null {
  if (progress?.mastered) return 'mastered'
  if (isSaved || (progress && progress.articleIds.length >= LEARNING_ARTICLE_COUNT)) {
    return 'learning'
  }
  return progress ? 'seen' : null
}

export function countMastered(terms: Record<string, TermProgress>): number {
  return Object.values(terms).filter((progress) => progress.mastered).length
}
