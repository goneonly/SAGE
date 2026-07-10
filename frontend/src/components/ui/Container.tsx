import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

// 페이지 본문 공용 컨테이너 — `mx-auto max-w-*` 반복을 없앤다.
// size 는 실제 화면들이 쓰는 폭 4단계로 고정해 임의 폭이 늘어나는 것을 막는다.
const SIZE_CLASS = {
  /** 좁은 폼 — 설정 등 (max-w-lg) */
  sm: 'max-w-lg',
  /** 읽기 폭 — 리더·단어장 등 (max-w-2xl) */
  md: 'max-w-2xl',
  /** 목록 폭 — 뉴스·공지·포트폴리오 등 (max-w-3xl) */
  lg: 'max-w-3xl',
  /** 풀폭 레이아웃 — 하단 바 등 (max-w-7xl) */
  xl: 'max-w-7xl',
} as const

interface ContainerProps {
  size?: keyof typeof SIZE_CLASS
  className?: string
  children: ReactNode
}

function Container({ size = 'md', className, children }: ContainerProps) {
  return <div className={cn('mx-auto w-full', SIZE_CLASS[size], className)}>{children}</div>
}

export default Container
