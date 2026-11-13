import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Level } from '../../types/auth'

// 학습 루프 상태 — 용어 숙련도 · 오늘의 목표/연속 학습 · 레벨업 제안.
// TODO(backend): PLAN.md §7 데이터 모델에 아직 없는 영역이다. 백엔드 연동 시
// user_term_progress(user_id, term, article_ids, mastered) · user_daily_log(user_id, date, …) 같은
// 테이블이 필요하다. 지금은 다른 스토어처럼 localStorage 에만 저장한다(사용자 1명 가정).

export interface TermProgress {
  /** 이 용어의 설명을 열어 본 기사 id 목록(중복 없음) — 여러 기사에서 만날수록 익숙해진 것으로 본다 */
  articleIds: string[]
  /** 사용자가 "이제 알아요"로 직접 확인했는지 */
  mastered: boolean
  firstSeenAt: string
}

export interface DayLog {
  /** 로컬 날짜 키(YYYY-MM-DD) */
  date: string
  articleIds: string[]
  terms: string[]
}

/** 오늘의 목표 — 기사 1개 읽기 + 용어 3개 열어 보기 */
export const DAILY_GOAL = { articles: 1, terms: 3 } as const

export function toDateKey(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function yesterdayKey(): string {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return toDateKey(date)
}

function emptyDayLog(date: string): DayLog {
  return { date, articleIds: [], terms: [] }
}

/** 저장된 로그가 어제 이전 것이면 오늘 기준 빈 로그로 본다(자정이 지나면 진행도 초기화). */
export function getTodayLog(log: DayLog): DayLog {
  const todayKey = toDateKey()
  return log.date === todayKey ? log : emptyDayLog(todayKey)
}

export function isDailyGoalMet(log: DayLog): boolean {
  return log.articleIds.length >= DAILY_GOAL.articles && log.terms.length >= DAILY_GOAL.terms
}

/** 화면에 보여줄 연속 일수 — 마지막 달성일이 오늘·어제가 아니면 끊긴 것이므로 0. */
export function getActiveStreak(streak: number, lastGoalDate: string | null): number {
  return lastGoalDate === toDateKey() || lastGoalDate === yesterdayKey() ? streak : 0
}

interface LearningState {
  terms: Record<string, TermProgress>
  today: DayLog
  streak: number
  lastGoalDate: string | null
  /** "나중에"로 닫은 레벨업 제안의 목표 레벨 — 같은 제안을 다시 띄우지 않는다 */
  dismissedLevelUps: Level[]
  recordTermView: (term: string, articleId: string) => void
  recordArticleRead: (articleId: string) => void
  setMastered: (term: string, mastered: boolean) => void
  dismissLevelUp: (level: Level) => void
}

type DayFields = Pick<LearningState, 'today' | 'streak' | 'lastGoalDate'>

// 오늘 로그를 갱신하고, 이번 갱신으로 오늘의 목표를 처음 달성했으면 연속 일수를 올린다.
function updateDay(state: DayFields, patch: (log: DayLog) => DayLog): DayFields {
  const today = patch(getTodayLog(state.today))
  if (!isDailyGoalMet(today) || state.lastGoalDate === today.date) {
    return { today, streak: state.streak, lastGoalDate: state.lastGoalDate }
  }
  return {
    today,
    streak: state.lastGoalDate === yesterdayKey() ? state.streak + 1 : 1,
    lastGoalDate: today.date,
  }
}

function addUnique(list: string[], value: string): string[] {
  return list.includes(value) ? list : [...list, value]
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set) => ({
      terms: {},
      today: emptyDayLog(toDateKey()),
      streak: 0,
      lastGoalDate: null,
      dismissedLevelUps: [],
      recordTermView: (term, articleId) =>
        set((state) => {
          const previous = state.terms[term]
          const progress: TermProgress = previous
            ? { ...previous, articleIds: addUnique(previous.articleIds, articleId) }
            : { articleIds: [articleId], mastered: false, firstSeenAt: new Date().toISOString() }
          return {
            terms: { ...state.terms, [term]: progress },
            ...updateDay(state, (log) => ({ ...log, terms: addUnique(log.terms, term) })),
          }
        }),
      recordArticleRead: (articleId) =>
        set((state) =>
          updateDay(state, (log) => ({ ...log, articleIds: addUnique(log.articleIds, articleId) })),
        ),
      setMastered: (term, mastered) =>
        set((state) => {
          const previous = state.terms[term] ?? {
            articleIds: [],
            mastered: false,
            firstSeenAt: new Date().toISOString(),
          }
          return { terms: { ...state.terms, [term]: { ...previous, mastered } } }
        }),
      dismissLevelUp: (level) =>
        set((state) => ({
          dismissedLevelUps: addUnique(state.dismissedLevelUps, level) as Level[],
        })),
    }),
    { name: 'sage-learning' },
  ),
)
