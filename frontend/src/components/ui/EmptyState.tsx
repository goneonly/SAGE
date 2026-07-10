import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

// 빈 상태 공용 컴포넌트 — 아이콘 + 제목 + 설명 + (선택) CTA.
// "데이터가 없어요" 한 줄 대신 다음 행동을 안내해 빈 화면이 막다른 길이 되지 않게 한다.
interface EmptyStateProps {
  /** 이모지 또는 아이콘 노드 — 장식이므로 스크린리더에는 숨긴다 */
  icon?: ReactNode
  title: string
  description?: string
  /** CTA 버튼/링크 — 호출부가 Link 등으로 직접 구성 */
  action?: ReactNode
  className?: string
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-xl border border-dashed border-line bg-surface px-6 py-12 text-center',
        className,
      )}
    >
      {icon && (
        <div aria-hidden="true" className="text-3xl">
          {icon}
        </div>
      )}
      <p className="mt-3 text-sm font-semibold text-ink">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export default EmptyState
