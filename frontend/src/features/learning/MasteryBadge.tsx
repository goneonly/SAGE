import { cn } from '../../lib/cn'
import { MASTERY_LABEL, type MasteryStage } from './mastery'

// 단계가 올라갈수록 진해지는 톤 — 색만으로 구분하지 않도록 항상 단계 이름을 함께 쓴다.
const STAGE_CLASS: Record<MasteryStage, string> = {
  seen: 'bg-bg-alt text-muted',
  learning: 'bg-primary-100 text-primary-700',
  mastered: 'bg-primary-600 text-on-primary',
}

function MasteryBadge({ stage, className }: { stage: MasteryStage; className?: string }) {
  return (
    <span
      className={cn(
        'inline-block shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        STAGE_CLASS[stage],
        className,
      )}
    >
      {MASTERY_LABEL[stage]}
    </span>
  )
}

export default MasteryBadge
