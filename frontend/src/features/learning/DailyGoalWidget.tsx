import { cn } from '../../lib/cn'
import {
  DAILY_GOAL,
  getActiveStreak,
  getTodayLog,
  isDailyGoalMet,
  useLearningStore,
} from '../../lib/store/learningStore'
import ProgressBar from '../../components/ui/ProgressBar'

function GoalRow({ label, current, goal }: { label: string; current: number; goal: number }) {
  const done = Math.min(current, goal)
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink">{label}</span>
        <span className="tabular-nums text-muted">
          {done} / {goal}
        </span>
      </div>
      <ProgressBar label={label} value={current} max={goal} className="mt-1" />
    </div>
  )
}

// 오늘의 목표 + 연속 학습 — 기사 1개 읽기 · 용어 3개 열어 보기를 채우면 연속 일수가 하루 늘어난다.
// 하루라도 건너뛰면 연속 일수는 0으로 돌아간다(getActiveStreak).
function DailyGoalWidget({ className }: { className?: string }) {
  const storedToday = useLearningStore((state) => state.today)
  const streak = useLearningStore((state) => state.streak)
  const lastGoalDate = useLearningStore((state) => state.lastGoalDate)

  const today = getTodayLog(storedToday)
  const activeStreak = getActiveStreak(streak, lastGoalDate)
  const goalMet = isDailyGoalMet(today)

  return (
    <section className={cn('rounded-xl border border-line bg-surface p-4', className)}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink">오늘의 목표</h3>
        <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
          연속 {activeStreak}일
        </span>
      </div>
      <div className="mt-3 space-y-2.5">
        <GoalRow label="기사 읽기" current={today.articleIds.length} goal={DAILY_GOAL.articles} />
        <GoalRow label="용어 열어 보기" current={today.terms.length} goal={DAILY_GOAL.terms} />
      </div>
      <p className="mt-3 text-xs text-muted" role="status">
        {goalMet
          ? '오늘 목표를 달성했어요. 내일도 이어가 보세요.'
          : '기사를 끝까지 읽고 하이라이트된 용어를 눌러 보세요.'}
      </p>
    </section>
  )
}

export default DailyGoalWidget
