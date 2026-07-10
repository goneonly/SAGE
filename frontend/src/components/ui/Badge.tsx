import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

// 알약형 라벨 — 레벨 뱃지 등 짧은 상태 표기에 쓴다.
// 색·크기 변형이 필요하면 className 으로 덮어쓴다(지금은 브랜드 틴트 한 종류면 충분).
interface BadgeProps {
  className?: string
  children: ReactNode
}

function Badge({ className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-700',
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Badge
