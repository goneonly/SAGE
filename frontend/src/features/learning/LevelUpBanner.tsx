import { useAuthStore } from '../../lib/store/authStore'
import { useLearningStore } from '../../lib/store/learningStore'
import { getLevelUpTarget } from './levelUp'
import { LEVEL_NAME } from '../../lib/levels'
import { countMastered } from './mastery'

// 레벨업 제안 배너 — 마스터한 용어가 기준을 넘으면 홈 상단에 뜬다.
// "올리기"는 설정 화면과 같은 authStore.updateLevel 을 쓰고, "나중에"는 같은 제안을 다시 띄우지 않는다.
function LevelUpBanner() {
  const level = useAuthStore((state) => state.user?.level)
  const updateLevel = useAuthStore((state) => state.updateLevel)
  const terms = useLearningStore((state) => state.terms)
  const dismissed = useLearningStore((state) => state.dismissedLevelUps)
  const dismissLevelUp = useLearningStore((state) => state.dismissLevelUp)

  if (!level) return null
  const masteredCount = countMastered(terms)
  const target = getLevelUpTarget(level, masteredCount, dismissed)
  if (!target) return null

  return (
    <section
      aria-label="투자 이해도 올리기 제안"
      className="mb-6 rounded-xl border border-primary-600 bg-primary-50 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4"
    >
      <div>
        <p className="text-sm font-semibold text-ink">
          용어 {masteredCount}개를 마스터했어요. {LEVEL_NAME[target]} 단계로 올려 볼까요?
        </p>
        <p className="mt-1 text-xs text-muted">
          설명이 한 단계 더 깊어져요. 설정에서 언제든 {LEVEL_NAME[level]} 단계로 되돌릴 수 있어요.
        </p>
      </div>
      <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
        <button
          type="button"
          onClick={() => dismissLevelUp(target)}
          className="rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          나중에
        </button>
        <button
          type="button"
          onClick={() => updateLevel(target)}
          className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-on-primary transition hover:bg-primary-600/90"
        >
          {LEVEL_NAME[target]} 단계로 올리기
        </button>
      </div>
    </section>
  )
}

export default LevelUpBanner
